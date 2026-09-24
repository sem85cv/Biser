import { fmt, kitCost } from '../utils/calc.js'

export default function KitsList({ kits, items, onEdit, onDelete }) {
  if (!kits.length) {
    return (
      <div className="panel">
        <div className="empty">
          Наборів ще немає.<br />Створіть перший набір з товарів вашого складу.
        </div>
      </div>
    )
  }
  return (
    <div className="panel">
      {kits.map((k) => (
        <div className="row" key={k.id}>
          <div className="badge" style={{ background: k.img ? 'transparent' : 'var(--other-bg)' }}>
            {k.img ? <img src={k.img} alt="" /> : '🎁'}
          </div>
          <div className="row-main">
            <div className="row-title">{k.name}</div>
            <div className="row-sub">{k.components.length} компонент(ів)</div>
          </div>
          <div className="row-cost">{fmt(kitCost(k, items))} грн</div>
          <div className="row-actions">
            <button className="icon-btn" type="button" onClick={() => onEdit(k.id)}>✎</button>
            <button className="icon-btn" type="button" onClick={() => onDelete(k.id)}>✕</button>
          </div>
        </div>
      ))}
    </div>
  )
}
