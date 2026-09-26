export default function Login({ onSignIn }) {
  async function handleClick() {
    try {
      await onSignIn()
    } catch (err) {
      if (err.code !== 'auth/popup-closed-by-user') {
        alert('Не вдалося увійти: ' + err.message)
      }
    }
  }

  return (
    <div className="app">
      <div className="hero"><div className="blob" />
        <div className="hero-inner">
          <h1><b>Бісер</b> · Облік</h1>
          <p>склад матеріалів і собівартість наборів</p>
        </div>
      </div>
      <div className="panel login-panel">
        <p style={{ margin: '10px 0 18px', color: 'var(--muted)', fontSize: 14, lineHeight: 1.6 }}>
          Увійдіть через Google, щоб отримати доступ до спільного складу та наборів.
        </p>
        <button className="btn primary" type="button" style={{ width: '100%' }} onClick={handleClick}>
          Увійти через Google
        </button>
      </div>
    </div>
  )
}
