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

  const share = await findByLabels(browserSession, ['Share', 'Share Menu', '分享'], true)
  if (!share) throw new Error('Safari Share button was not found')
  await clickElement(browserSession, share)
  await pause(1_000)
  await screenshot(browserSession, '02-share-sheet.png')
  await source(browserSession, '03-share-sheet-source.xml')

  let addToHome = await findByLabels(browserSession, ['Add to Home Screen', '加入主畫面', '加到主畫面'], true)
  for (let attempt = 0; !addToHome && attempt < 5; attempt += 1) {
    await nativeSwipeUp(browserSession)
    await pause(500)
    await screenshot(browserSession, `03-share-sheet-scroll-${attempt + 1}.png`)
    addToHome = await findByLabels(browserSession, ['Add to Home Screen', '加入主畫面', '加到主畫面'], true)
  }
  if (!addToHome) {
    await source(browserSession, '04-share-sheet-final-source.xml')
    throw new Error('Add to Home Screen action was not found in the Share sheet')
  }

  await clickElement(browserSession, addToHome)
  await pause(1_000)
  await screenshot(browserSession, '04-add-to-home-screen-dialog.png')
  await source(browserSession, '05-add-dialog-source.xml')

  const add = await findByLabels(browserSession, ['Add', '加入', '新增'])
  if (!add) throw new Error('Final Add button was not found')
  await clickElement(browserSession, add)
  await pause(2_000)
  await screenshot(browserSession, '05-after-add.png')
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
      return standaloneContract
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
  console.log(`PASS: ${expectedAppName} installed and launched in standalone mode at ${standaloneContract.url}`)
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
