import { CAT_ICON, CAT_BG, fmt, costPerUnit } from '../utils/calc.js'

export default function ItemsList({ items, onEdit, onDelete }) {
  if (!items.length) {
    return (
      <div className="panel">
        <div className="empty">
          Склад порожній.<br />Натисніть «+», щоб додати перший товар — бісер, нитку чи фурнітуру.
        </div>
      </div>
    )
  }
  return (
    <div className="panel">
      {items.map((it) => (
        <div className="row" key={it.id}>
          <div className="badge" style={{ background: it.img ? 'transparent' : CAT_BG[it.category] || CAT_BG.other }}>
            {it.img ? <img src={it.img} alt="" /> : CAT_ICON[it.category] || '📦'}
          </div>
          <div className="row-main">
            <div className="row-title">{it.name}</div>
            <div className="row-sub">{it.qty} {it.unit} · {fmt(costPerUnit(it))} грн/{it.unit}</div>
          </div>
          <div className="row-cost">{fmt(it.cost)} грн</div>
          <div className="row-actions">
            <button className="icon-btn" type="button" onClick={() => onEdit(it.id)}>✎</button>
            <button className="icon-btn" type="button" onClick={() => onDelete(it.id)}>✕</button>
          </div>
        </div>
      ))}
    </div>
  )
}
