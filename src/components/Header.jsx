export default function Header({ user, onSettings, onSignOut }) {
  return (
    <div className="hero">
      <div className="blob" />
      <div className="hero-inner">
        <div className="hero-top">
          <div>
            <h1><b>Бісер</b> · Облік</h1>
            <p>склад матеріалів і собівартість наборів</p>
          </div>
          <div className="hero-actions">
            {user && (
              <div className="user-chip" title={user.email}>
                {user.photoURL
                  ? <img src={user.photoURL} alt="" />
                  : <span>{(user.displayName || user.email || '?')[0].toUpperCase()}</span>}
              </div>
            )}
            <button type="button" className="gear-btn" onClick={onSettings} aria-label="Налаштування">⚙</button>
          </div>
        </div>
        {user && (
          <div className="user-line">
            {user.displayName || user.email}
            <button type="button" className="link-btn" style={{ padding: '0 0 0 8px' }} onClick={onSignOut}>Вийти</button>
          </div>
        )}
      </div>
    </div>
  )
}
