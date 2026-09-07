interface UpdateBannerProps {
  onUpdate: () => void
  onDismiss: () => void
}

export function UpdateBanner({ onUpdate, onDismiss }: UpdateBannerProps) {
  return (
    <section className="update-banner" role="status" aria-live="polite">
      <div>
        <strong>地圖有新版</strong>
        <span>套用已下載的地圖及手信頁新版，會重新開啟；收藏不受影響。</span>
      </div>
      <button type="button" onClick={onDismiss}>稍後</button>
      <button type="button" onClick={onUpdate}>立即更新</button>
    </section>
  )
}
