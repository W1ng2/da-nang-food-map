interface UpdateBannerProps {
  onUpdate: () => void
  onDismiss: () => void
}

export function UpdateBanner({ onUpdate, onDismiss }: UpdateBannerProps) {
  return (
    <section className="update-banner" role="status" aria-live="polite">
      <div>
        <strong>地圖有新版</strong>
        <span>更新餐廳資料與景點圖標，重新開啟只需數秒。</span>
      </div>
      <button type="button" onClick={onDismiss}>稍後</button>
      <button type="button" onClick={onUpdate}>立即更新</button>
    </section>
  )
}
