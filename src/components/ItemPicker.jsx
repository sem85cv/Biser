import { useState, useEffect } from 'react'
import { CAT_ICON, CAT_BG, fmt, costPerUnit } from '../utils/calc.js'

export default function ItemPicker({ open, items, onSelect, onClose }) {
  const [search, setSearch] = useState('')

  useEffect(() => { if (open) setSearch('') }, [open])

  if (!open) return null

  const q = search.trim().toLowerCase()
  const filtered = q ? items.filter((it) => it.name.toLowerCase().includes(q)) : items

  return (
    <div className="sheet-backdrop picker-backdrop open" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="sheet">
        <h2>Оберіть товар</h2>
        <input
          type="text" autoFocus
          className="search-input" style={{ width: '100%' }}
          value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Пошук товару зі складу…"
        />
        <div className="picker-list">
          {filtered.length === 0 && <div className="empty">Нічого не знайдено за запитом «{search}».</div>}
          {filtered.map((it) => (
            <button type="button" className="row picker-row" key={it.id} onClick={() => onSelect(it.id)}>
              <div className="badge" style={{ background: it.img ? 'transparent' : CAT_BG[it.category] || CAT_BG.other }}>
                {it.img ? <img src={it.img} alt="" /> : CAT_ICON[it.category] || '📦'}
              </div>
              <div className="row-main">
                <div className="row-title">{it.name}</div>
                <div className="row-sub">{it.qty} {it.unit} · {fmt(costPerUnit(it))} грн/{it.unit}</div>
              </div>
            </button>
          ))}
        </div>
        <div className="btn-row">
          <button className="btn ghost" type="button" onClick={onClose}>Закрити</button>
        </div>
      </div>
    </div>
  )
}
