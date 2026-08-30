import { mkdir, writeFile } from 'node:fs/promises'
import { execFile } from 'node:child_process'
import path from 'node:path'
import { promisify } from 'node:util'

const execFileAsync = promisify(execFile)

const appiumUrl = process.env.APPIUM_URL ?? 'http://127.0.0.1:4723'
const pwaUrl = process.env.PWA_URL ?? 'https://w1ng2.github.io/da-nang-food-map/'
const simulatorUdid = process.env.IOS_SIM_UDID
const simulatorName = process.env.IOS_SIM_NAME ?? 'iPhone Simulator'
const simulatorVersion = process.env.IOS_SIM_VERSION
const artifactDir = path.resolve(process.env.IOS_QA_ARTIFACT_DIR ?? 'artifacts/ios-simulator')
const expectedAppName = '峴港食旅'

if (!simulatorUdid || !simulatorVersion) throw new Error('IOS_SIM_UDID and IOS_SIM_VERSION are required')

await mkdir(artifactDir, { recursive: true })

let browserSession
let homeSession

async function request(method, pathname, body) {
  const response = await fetch(`${appiumUrl}${pathname}`, {
    method,
    headers: body === undefined ? undefined : { 'content-type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
  })
  const text = await response.text()
  let payload
  try {
    payload = text ? JSON.parse(text) : {}
  } catch {
    payload = { value: text }
  }
  if (!response.ok || payload?.value?.error) {
    const message = payload?.value?.message ?? text ?? `${response.status} ${response.statusText}`
    throw new Error(`${method} ${pathname} failed: ${message}`)
  }
  return payload.value
}

async function createSession(extraCapabilities = {}) {
  const value = await request('POST', '/session', {
    capabilities: {
      alwaysMatch: {
        platformName: 'iOS',
        'appium:automationName': 'XCUITest',
        'appium:udid': simulatorUdid,
        'appium:deviceName': simulatorName,
        'appium:platformVersion': simulatorVersion,
        'appium:newCommandTimeout': 180,
        'appium:noReset': true,
        'appium:isHeadless': true,
        'appium:simulatorStartupTimeout': 300_000,
        'appium:reduceMotion': true,
        'appium:wdaLaunchTimeout': 240_000,
        'appium:wdaConnectionTimeout': 240_000,
        'appium:wdaStartupRetries': 1,
        'appium:showXcodeLog': true,
        'appium:webviewConnectTimeout': 30_000,
        'appium:includeSafariInWebviews': true,
        'appium:enableAsyncExecuteFromHttps': true,
        'appium:autoAcceptAlerts': true,
        ...extraCapabilities,
      },
    },
  })
  await request('POST', `/session/${value.sessionId}/timeouts`, { script: 30_000 })
  return value.sessionId
}

async function command(sessionId, method, suffix, body) {
  return request(method, `/session/${sessionId}${suffix}`, body)
}

async function pause(milliseconds) {
  await new Promise(resolve => setTimeout(resolve, milliseconds))
}

async function saveJson(name, value) {
  await writeFile(path.join(artifactDir, name), `${JSON.stringify(value, null, 2)}\n`)
}

async function saveText(name, value) {
  await writeFile(path.join(artifactDir, name), value)
}

async function screenshot(sessionId, name) {
  const base64 = await command(sessionId, 'GET', '/screenshot')
  await writeFile(path.join(artifactDir, name), Buffer.from(base64, 'base64'))
}

async function simulatorScreenshot(name) {
  await execFileAsync('xcrun', ['simctl', 'io', simulatorUdid, 'screenshot', path.join(artifactDir, name)])
}

async function source(sessionId, name) {
  const value = await command(sessionId, 'GET', '/source')
  await saveText(name, value)
  return value
}

async function execute(sessionId, script, args = []) {
  return command(sessionId, 'POST', '/execute/sync', { script, args })
}

async function executeAsync(sessionId, script, args = []) {
  return command(sessionId, 'POST', '/execute/async', { script, args })
}

async function switchContext(sessionId, name) {
  await command(sessionId, 'POST', '/context', { name })
}

async function waitForWebContext(sessionId, timeout = 45_000) {
  const deadline = Date.now() + timeout
  let contexts = []
  while (Date.now() < deadline) {
    contexts = await command(sessionId, 'GET', '/contexts')
    const webContext = contexts.find(context => context !== 'NATIVE_APP')
    if (webContext) return { contexts, webContext }
    await pause(1_000)
  }
  throw new Error(`No WebKit context became available: ${JSON.stringify(contexts)}`)
}

async function findElement(sessionId, using, value) {
  try {
    return await command(sessionId, 'POST', '/element', { using, value })
  } catch {
    return null
  }
}

function elementId(element) {
  return element?.['element-6066-11e4-a52e-4f735466cecf'] ?? element?.ELEMENT
}

async function clickElement(sessionId, element) {
  const id = elementId(element)
  if (!id) throw new Error('Element has no WebDriver id')
  await command(sessionId, 'POST', `/element/${encodeURIComponent(id)}/click`, {})
}

async function clearElement(sessionId, element) {
  const id = elementId(element)
  if (!id) throw new Error('Element has no WebDriver id')
  await command(sessionId, 'POST', `/element/${encodeURIComponent(id)}/clear`, {})
}

async function typeElement(sessionId, element, value) {
  const id = elementId(element)
  if (!id) throw new Error('Element has no WebDriver id')
  await command(sessionId, 'POST', `/element/${encodeURIComponent(id)}/value`, {
    text: value,
    value: Array.from(value),
  })
}

async function findElements(sessionId, using, value) {
  return command(sessionId, 'POST', '/elements', { using, value })
}

async function waitForScript(sessionId, script, timeout = 15_000) {
  const deadline = Date.now() + timeout
  let lastResult
  while (Date.now() < deadline) {
    lastResult = await execute(sessionId, script)
    if (lastResult) return lastResult
    await pause(500)
  }
  throw new Error(`Timed out waiting for web contract: ${JSON.stringify(lastResult)}`)
}

async function findByLabels(sessionId, labels, partial = false) {
  for (const label of labels) {
    const exact = await findElement(sessionId, 'accessibility id', label)
    if (exact) return exact
  }
  const clauses = labels.flatMap(label => {
    const escaped = label.replaceAll("'", "\\'")
    const operator = partial ? 'CONTAINS[c]' : '=='
    return [`label ${operator} '${escaped}'`, `name ${operator} '${escaped}'`]
  })
  return findElement(sessionId, '-ios predicate string', clauses.join(' OR '))
}

async function findVisibleByLabels(sessionId, labels, partial = false) {
  const clauses = labels.flatMap(label => {
    const escaped = label.replaceAll("'", "\\'")
    const operator = partial ? 'CONTAINS[c]' : '=='
    return [`label ${operator} '${escaped}'`, `name ${operator} '${escaped}'`]
  })
  return findElement(sessionId, '-ios predicate string', `visible == 1 AND (${clauses.join(' OR ')})`)
}

async function waitForVisibleByLabels(sessionId, labels, partial = false, timeout = 10_000) {
  const deadline = Date.now() + timeout
  while (Date.now() < deadline) {
    const element = await findVisibleByLabels(sessionId, labels, partial)
    if (element) return element
    await pause(500)
  }
  return null
}

async function findVisibleShareAction(sessionId, labels) {
  const clauses = labels.map(label => {
    const escaped = label.replaceAll("'", "\\'")
    return `label CONTAINS[c] '${escaped}'`
  })
  return findElement(
    sessionId,
    '-ios predicate string',
    `visible == 1 AND name == 'actionGroupCell' AND (${clauses.join(' OR ')})`,
  )
}

async function nativeSwipeUp(sessionId) {
  const rect = await command(sessionId, 'GET', '/window/rect')
  const x = Math.round(rect.width * 0.5)
  const startY = Math.round(rect.height * 0.78)
  const endY = Math.round(rect.height * 0.32)
  await command(sessionId, 'POST', '/actions', {
    actions: [{
      type: 'pointer',
      id: 'finger',
      parameters: { pointerType: 'touch' },
      actions: [
        { type: 'pointerMove', duration: 0, x, y: startY, origin: 'viewport' },
        { type: 'pointerDown', button: 0 },
        { type: 'pause', duration: 150 },
        { type: 'pointerMove', duration: 600, x, y: endY, origin: 'viewport' },
        { type: 'pointerUp', button: 0 },
      ],
    }],
  })
  await command(sessionId, 'DELETE', '/actions')
}

async function fastWebMapDrag(sessionId) {
  const rect = await execute(sessionId, `
    const rect = document.querySelector('.maplibregl-canvas')?.getBoundingClientRect()
    return rect ? { x: rect.x, y: rect.y, width: rect.width, height: rect.height } : null
  `)
  if (!rect) throw new Error('Map canvas rectangle was not available for fast-drag QA')
  const startX = Math.round(rect.x + rect.width * 0.78)
  const endX = Math.round(rect.x + rect.width * 0.22)
  const y = Math.round(rect.y + rect.height * 0.52)
  await command(sessionId, 'POST', '/actions', {
    actions: [{
      type: 'pointer',
      id: 'map-drag-finger',
      parameters: { pointerType: 'touch' },
      actions: [
        { type: 'pointerMove', duration: 0, x: startX, y, origin: 'viewport' },
        { type: 'pointerDown', button: 0 },
        { type: 'pointerMove', duration: 120, x: endX, y, origin: 'viewport' },
        { type: 'pointerUp', button: 0 },
      ],
    }],
  })
  await command(sessionId, 'DELETE', '/actions')
}

async function waitForWebContract(sessionId) {
  const deadline = Date.now() + 45_000
  let lastResult
  while (Date.now() < deadline) {
    try {
      lastResult = await execute(sessionId, `return {
        title: document.title,
        url: location.href,
        readyState: document.readyState,
        bodyText: document.body?.innerText?.slice(0, 800) ?? '',
        hasMapCanvas: Boolean(document.querySelector('.maplibregl-canvas')),
        manifestHref: document.querySelector('link[rel="manifest"]')?.href ?? null,
        standalone: window.matchMedia('(display-mode: standalone)').matches || navigator.standalone === true,
        serviceWorkerControlled: Boolean(navigator.serviceWorker?.controller),
      }`)
      if (lastResult.readyState === 'complete' && lastResult.hasMapCanvas && lastResult.bodyText.includes('間符合')) {
        return lastResult
      }
    } catch {
      // Safari may not have entered the web context yet.
    }
    await pause(1_000)
  }
  throw new Error(`PWA web contract did not become ready: ${JSON.stringify(lastResult)}`)
}

async function assertMapCount(sessionId, expected) {
  return waitForScript(sessionId, `
    const count = Number(document.querySelector('.map-status strong')?.textContent)
    const accessibleCount = document.querySelectorAll('.map-place-accessible').length
    const webGlRenderer = document.querySelector('.map-canvas')?.dataset.restaurantMarkerRenderer
    const clustering = document.querySelector('.map-canvas')?.dataset.restaurantClustering
    const domMarkerCount = document.querySelectorAll('.maplibregl-marker').length
    return count === ${expected} && accessibleCount === ${expected} && webGlRenderer === 'webgl-symbol' && clustering === 'true' && domMarkerCount === 0
      ? { count, accessibleCount, webGlRenderer, clustering, domMarkerCount }
      : null
  `)
}

async function verifyStandaloneCoreFlows(sessionId) {
  await execute(sessionId, `
    localStorage.removeItem('danang-food-map:favorites')
    localStorage.removeItem('danang-food-map:visited')
    location.hash = ''
    setTimeout(() => location.reload(), 0)
    return true
  `)
  await pause(1_500)
  const initialContract = await waitForWebContract(sessionId)
  await assertMapCount(sessionId, 36)

  const moveCountBeforeDrag = Number(await execute(sessionId, `return document.querySelector('.map-canvas')?.dataset.mapMoveCount || 0`))
  await screenshot(sessionId, '08a-fast-drag-before.png')
  await fastWebMapDrag(sessionId)
  const dragContract = await waitForScript(sessionId, `
    const canvas = document.querySelector('.map-canvas')
    const moveCount = Number(canvas?.dataset.mapMoveCount || 0)
    const domMarkerCount = document.querySelectorAll('.maplibregl-marker').length
    return moveCount > ${moveCountBeforeDrag} && canvas?.dataset.restaurantMarkerRenderer === 'webgl-symbol' && domMarkerCount === 0
      ? { moveCountBefore: ${moveCountBeforeDrag}, moveCountAfter: moveCount, renderer: canvas.dataset.restaurantMarkerRenderer, domMarkerCount }
      : null
  `)
  await screenshot(sessionId, '08b-fast-drag-after.png')

  const search = await findElement(sessionId, 'css selector', 'input[aria-label="搜尋餐廳"]')
  if (!search) throw new Error('Restaurant search input was not found')
  await clearElement(sessionId, search)
  await typeElement(sessionId, search, 'MỘC Quán Seafood')
  await assertMapCount(sessionId, 1)

  const selectedMoc = await execute(sessionId, `
    const button = document.querySelector('button.map-place-accessible[aria-label^="MỘC Quán Seafood"]')
    if (!button) return false
    button.click()
    return true
  `)
  if (!selectedMoc) throw new Error('MỘC Quán Seafood WebGL marker accessibility action was not found after searching')

  const detailContract = await waitForScript(sessionId, `
    const dialog = document.querySelector('.place-sheet')
    if (!dialog || !dialog.textContent.includes('MỘC Quán Seafood')) return null
    return {
      text: dialog.textContent,
      hash: location.hash,
      googleMaps: dialog.querySelector('a[href*="google.com/maps"]')?.href ?? null,
      appleMaps: dialog.querySelector('a[href*="maps.apple.com"]')?.href ?? null,
      photoAlt: dialog.querySelector('.place-sheet__photo img')?.alt ?? null,
      booking: dialog.querySelector('.contact-actions a[href*="mocseafood.com/dat-ban"]')?.href ?? null,
    }
  `)
  for (const requiredText of ['蒜香牛油龍蝦', '400,000–900,000 VND', 'HK$120–270']) {
    if (!detailContract.text.includes(requiredText)) {
      throw new Error(`MỘC detail is missing ${requiredText}`)
    }
  }
  if (detailContract.hash !== '#place=michelin-moc-quan-seafood') throw new Error(`Unexpected deep link ${detailContract.hash}`)
  if (!detailContract.googleMaps || !detailContract.appleMaps) throw new Error('Restaurant navigation links are missing')
  if (!detailContract.photoAlt?.includes('夜間門面')) throw new Error('MỘC identifying photo is missing')
  if (!detailContract.booking) throw new Error('MỘC official booking action is missing')

  const detailActions = await findElements(sessionId, 'css selector', '.place-sheet .quick-actions button')
  if (detailActions.length !== 3) throw new Error(`Expected 3 detail actions, found ${detailActions.length}`)
  await clickElement(sessionId, detailActions[0])
  await clickElement(sessionId, detailActions[1])
  const storedContract = await waitForScript(sessionId, `
    const favorite = JSON.parse(localStorage.getItem('danang-food-map:favorites') || '[]')
    const visited = JSON.parse(localStorage.getItem('danang-food-map:visited') || '[]')
    return favorite.includes('michelin-moc-quan-seafood') && visited.includes('michelin-moc-quan-seafood')
      ? { favorite, visited }
      : null
  `)

  const close = await findElement(sessionId, 'css selector', '.place-sheet__close')
  if (!close) throw new Error('Restaurant detail close button was not found')
  await clickElement(sessionId, close)
  await clearElement(sessionId, search)
  await assertMapCount(sessionId, 36)

  let filterButtons = await findElements(sessionId, 'css selector', '.filter-strip button:not(.decision-filter-button)')
  if (filterButtons.length !== 4) throw new Error(`Expected 4 collection filters, found ${filterButtons.length}`)
  await clickElement(sessionId, filterButtons[1])
  await assertMapCount(sessionId, 74)
  filterButtons = await findElements(sessionId, 'css selector', '.filter-strip button:not(.decision-filter-button)')
  await clickElement(sessionId, filterButtons[0])
  await assertMapCount(sessionId, 38)
  filterButtons = await findElements(sessionId, 'css selector', '.filter-strip button:not(.decision-filter-button)')
  await clickElement(sessionId, filterButtons[2])
  await assertMapCount(sessionId, 50)
  filterButtons = await findElements(sessionId, 'css selector', '.filter-strip button:not(.decision-filter-button)')
  await clickElement(sessionId, filterButtons[1])
  await assertMapCount(sessionId, 12)
  filterButtons = await findElements(sessionId, 'css selector', '.filter-strip button:not(.decision-filter-button)')
  await clickElement(sessionId, filterButtons[3])
  await assertMapCount(sessionId, 23)
  filterButtons = await findElements(sessionId, 'css selector', '.filter-strip button:not(.decision-filter-button)')
  await clickElement(sessionId, filterButtons[2])
  await assertMapCount(sessionId, 11)

  const tabs = await findElements(sessionId, 'css selector', '.tabbar button')
  if (tabs.length !== 3) throw new Error(`Expected 3 primary tabs, found ${tabs.length}`)
  await clickElement(sessionId, tabs[1])
  const listContract = await waitForScript(sessionId, `
    const cards = [...document.querySelectorAll('.place-card')]
    return cards.length === 11 && cards[0]?.textContent.includes("An's Cafe")
      ? { cardCount: cards.length, firstCard: cards[0].textContent }
      : null
  `)

  const currentTabs = await findElements(sessionId, 'css selector', '.tabbar button')
  await clickElement(sessionId, currentTabs[2])
  const favoritesContract = await waitForScript(sessionId, `
    const cards = [...document.querySelectorAll('.place-card')]
    return cards.length === 1 && cards[0]?.textContent.includes('MỘC Quán Seafood')
      ? { cardCount: cards.length, text: cards[0].textContent }
      : null
  `)

  const favoriteTabs = await findElements(sessionId, 'css selector', '.tabbar button')
  await clickElement(sessionId, favoriteTabs[0])
  const locate = await findElement(sessionId, 'css selector', '.locate-button')
  if (!locate) throw new Error('Current-location button was not found')
  await clickElement(sessionId, locate)
  const locationContract = await waitForScript(sessionId, `
    const canvas = document.querySelector('.map-canvas')
    const button = document.querySelector('.locate-button')
    return canvas?.dataset.userLocationRenderer === 'webgl-circle' && canvas?.dataset.userLocationVisible === 'true' && button?.textContent.includes('重新定位')
      ? { renderer: canvas.dataset.userLocationRenderer, visible: canvas.dataset.userLocationVisible, buttonText: button.textContent, domMarkerCount: document.querySelectorAll('.maplibregl-marker').length }
      : null
  `, 25_000)

  const coreContract = {
    initial: { standalone: initialContract.standalone, count: 36 },
    fastDrag: dragContract,
    search: { query: 'MỘC Quán Seafood', count: 1 },
    detail: detailContract,
    storage: storedContract,
    collections: { michelin: 36, highRating: 38, cafeDessert: 12, breakfast: 11, total: 97 },
    list: listContract,
    favorites: favoritesContract,
    location: locationContract,
  }
  await saveJson('08-core-flows-contract.json', coreContract)
  await screenshot(sessionId, '08-core-flows-final.png')
  return coreContract
}

async function installFromSafari() {
  browserSession = await createSession()
  await execFileAsync('xcrun', ['simctl', 'openurl', simulatorUdid, pwaUrl])
  await pause(2_000)
  await execute(browserSession, 'mobile: activateApp', [{ bundleId: 'com.apple.mobilesafari' }])
  const { contexts } = await waitForWebContext(browserSession)
  const webContext = contexts.find(context => context !== 'NATIVE_APP')
  await switchContext(browserSession, webContext)

  const browserContract = await waitForWebContract(browserSession)
  const dataContract = await executeAsync(browserSession, `
    const done = arguments[arguments.length - 1]
    fetch(new URL('places.json', location.href))
      .then(response => {
        if (!response.ok) throw new Error('places.json returned ' + response.status)
        return response.json()
      })
      .then(places => done({ placeCount: places.length }))
      .catch(error => done({ error: String(error) }))
  `)
  await saveJson('01-safari-contract.json', { contexts, ...browserContract, ...dataContract })
  await screenshot(browserSession, '01-safari-loaded.png')

  if (browserContract.standalone) throw new Error('Safari unexpectedly reported standalone display mode before installation')
  if (!browserContract.manifestHref) throw new Error('PWA manifest link is missing')
  if (dataContract.error || dataContract.placeCount !== 97) {
    throw new Error(`Expected 97 restaurant records, received ${JSON.stringify(dataContract)}`)
  }

  await switchContext(browserSession, 'NATIVE_APP')
  await source(browserSession, '02-safari-native-source.xml')

  const educationClose = await findVisibleByLabels(browserSession, ['Close'])
  if (educationClose) {
    await clickElement(browserSession, educationClose)
    await pause(500)
  }

  let share = await findVisibleByLabels(browserSession, ['Share', 'Share Menu', '分享'], true)
  if (!share) {
    const more = await findVisibleByLabels(browserSession, ['More', 'MoreMenuButton'])
    if (!more) throw new Error('Safari More menu button was not found')
    await clickElement(browserSession, more)
    await pause(750)
    await simulatorScreenshot('02-more-menu.png')
    await source(browserSession, '03-more-menu-source.xml')
    share = await waitForVisibleByLabels(browserSession, ['Share', 'Share Menu', '分享'], true)
  }
  if (!share) throw new Error('Safari Share button was not found')
  await clickElement(browserSession, share)
  await pause(1_000)
  await simulatorScreenshot('04-share-sheet.png')
  await source(browserSession, '04-share-sheet-source.xml')

  let addToHome = await findVisibleShareAction(browserSession, ['Add to Home Screen', '加入主畫面', '加到主畫面'])
  if (!addToHome) {
    const viewMore = await findVisibleByLabels(browserSession, ['View More'])
    if (viewMore) {
      await clickElement(browserSession, viewMore)
      await pause(750)
      await simulatorScreenshot('05-share-sheet-view-more.png')
      await source(browserSession, '05-share-sheet-view-more-source.xml')
      addToHome = await findVisibleShareAction(browserSession, ['Add to Home Screen', '加入主畫面', '加到主畫面'])
    }
  }
  for (let attempt = 0; !addToHome && attempt < 5; attempt += 1) {
    await nativeSwipeUp(browserSession)
    await pause(500)
    await simulatorScreenshot(`05-share-sheet-scroll-${attempt + 1}.png`)
    addToHome = await findVisibleShareAction(browserSession, ['Add to Home Screen', '加入主畫面', '加到主畫面'])
  }
  if (!addToHome) {
    await source(browserSession, '05-share-sheet-final-source.xml')
    throw new Error('Add to Home Screen action was not found in the Share sheet')
  }

  await clickElement(browserSession, addToHome)
  await pause(1_000)
  await simulatorScreenshot('06-add-to-home-screen-dialog.png')
  await source(browserSession, '06-add-dialog-source.xml')

  const add = await findVisibleByLabels(browserSession, ['Add', '加入', '新增'])
  if (!add) throw new Error('Final Add button was not found')
  await clickElement(browserSession, add)
  await pause(2_000)
  await screenshot(browserSession, '07-after-add.png')
}

async function launchFromHomeScreen() {
  if (browserSession) {
    await request('DELETE', `/session/${browserSession}`)
    browserSession = undefined
  }

  homeSession = await createSession()
  await pause(1_000)
  const homeSource = await source(homeSession, '06-home-screen-source.xml')
  await screenshot(homeSession, '06-home-screen.png')
  if (!homeSource.includes(expectedAppName)) {
    throw new Error(`Installed Home Screen app named ${expectedAppName} was not found`)
  }

  const icon = await findByLabels(homeSession, [expectedAppName], true)
  if (!icon) throw new Error(`Home Screen icon ${expectedAppName} was not accessible`)
  await clickElement(homeSession, icon)
  await pause(3_000)
  await screenshot(homeSession, '07-standalone-launched.png')

  const deadline = Date.now() + 30_000
  let contexts = []
  while (Date.now() < deadline) {
    contexts = await command(homeSession, 'GET', '/contexts')
    const webContext = contexts.find(context => context !== 'NATIVE_APP')
    if (webContext) {
      await switchContext(homeSession, webContext)
      const standaloneContract = await waitForWebContract(homeSession)
      await saveJson('07-standalone-contract.json', { contexts, ...standaloneContract })
      if (!standaloneContract.standalone) throw new Error('Installed PWA did not report standalone display mode')
      await execFileAsync('xcrun', ['simctl', 'location', simulatorUdid, 'set', '16.067,108.223'])
      const coreContract = await verifyStandaloneCoreFlows(homeSession)
      return { ...standaloneContract, coreContract }
    }
    await pause(1_000)
  }
  await saveJson('07-standalone-contexts.json', contexts)
  throw new Error('Installed PWA exposed no WebKit context for standalone contract validation')
}

try {
  console.log(`Validating ${pwaUrl} on ${simulatorName}, iOS ${simulatorVersion} (${simulatorUdid})`)
  await installFromSafari()
  const standaloneContract = await launchFromHomeScreen()
  console.log(`PASS: ${expectedAppName} installed, launched, and passed core flows in standalone mode at ${standaloneContract.url}`)
} catch (error) {
  await saveText('failure.txt', `${error.stack ?? error}\n`)
  throw error
} finally {
  for (const sessionId of [browserSession, homeSession]) {
    if (!sessionId) continue
    try {
      await request('DELETE', `/session/${sessionId}`)
    } catch {
      // Preserve the primary QA result.
    }
  }
}
