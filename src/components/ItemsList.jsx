import { useState, useEffect, useMemo } from 'react'
import { CAT_ICON, CAT_BG, fmt, costPerUnit } from '../utils/calc.js'
import ListControls from './ListControls.jsx'
import Pager from './Pager.jsx'

const PAGE_SIZE = 8
const SORT_OPTIONS = [
  { value: 'date_new', label: 'Спочатку нові' },
  { value: 'date_old', label: 'Спочатку старі' },
  { value: 'name_asc', label: 'Назва: А → Я' },
  { value: 'name_desc', label: 'Назва: Я → А' },
  { value: 'cost_desc', label: 'Вартість: спадання' },
  { value: 'cost_asc', label: 'Вартість: зростання' }
]

export default function ItemsList({ items, onEdit, onDelete }) {
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('date_new')
  const [page, setPage] = useState(1)

  useEffect(() => { setPage(1) }, [search, sort])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    let list = q ? items.filter((it) => it.name.toLowerCase().includes(q)) : items.slice()
    list.sort((a, b) => {
      switch (sort) {
        case 'name_asc': return a.name.localeCompare(b.name, 'uk')
        case 'name_desc': return b.name.localeCompare(a.name, 'uk')
        case 'date_old': return (a.createdAt || 0) - (b.createdAt || 0)
        case 'cost_asc': return a.cost - b.cost
        case 'cost_desc': return b.cost - a.cost
        default: return (b.createdAt || 0) - (a.createdAt || 0)
      }
    })
    return list
  }, [items, search, sort])

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

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
    <>
      <ListControls
        search={search} onSearch={setSearch}
        sortValue={sort} onSort={setSort}
        sortOptions={SORT_OPTIONS}
        placeholder="Пошук товару…"
      />
      <div className="panel">
        {pageItems.length === 0 && <div className="empty">Нічого не знайдено за запитом «{search}».</div>}
        {pageItems.map((it) => (
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
      <Pager page={page} pageCount={pageCount} onPage={setPage} />
    </>
  )
}
