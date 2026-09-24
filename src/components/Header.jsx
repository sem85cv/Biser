export default function Header({ onSettings }) {
  return (
    <div className="hero">
      <div className="blob" />
      <div className="hero-inner">
        <div className="hero-top">
          <div>
            <h1><b>Бісер</b> · Облік</h1>
            <p>склад матеріалів і собівартість наборів</p>
          </div>
          <button type="button" className="gear-btn" onClick={onSettings} aria-label="Налаштування курсу">⚙</button>
        </div>
      </div>
    </div>
  )
}
