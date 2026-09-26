import { useState, useEffect, useMemo } from 'react'
import { fmt, fmtUSD, kitCost, toUSD } from '../utils/calc.js'
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

export default function KitsList({ kits, items, rate, onEdit, onDelete }) {
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('date_new')
  const [page, setPage] = useState(1)

  useEffect(() => { setPage(1) }, [search, sort])

  const withCost = useMemo(
    () => kits.map((k) => ({ ...k, _cost: kitCost(k, items) })),
    [kits, items]
  )

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    let list = q ? withCost.filter((k) => k.name.toLowerCase().includes(q)) : withCost.slice()
    list.sort((a, b) => {
      switch (sort) {
        case 'name_asc': return a.name.localeCompare(b.name, 'uk')
        case 'name_desc': return b.name.localeCompare(a.name, 'uk')
        case 'date_old': return (a.createdAt || 0) - (b.createdAt || 0)
        case 'cost_asc': return a._cost - b._cost
        case 'cost_desc': return b._cost - a._cost
        default: return (b.createdAt || 0) - (a.createdAt || 0)
      }
    })
    return list
  }, [withCost, search, sort])

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

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
    <>
      <ListControls
        search={search} onSearch={setSearch}
        sortValue={sort} onSort={setSort}
        sortOptions={SORT_OPTIONS}
        placeholder="Пошук набору…"
      />
      <div className="panel">
        {pageItems.length === 0 && <div className="empty">Нічого не знайдено за запитом «{search}».</div>}
        {pageItems.map((k) => {
          const usd = toUSD(k._cost, rate)
          return (
            <div className="row" key={k.id}>
              <div className="badge" style={{ background: k.img ? 'transparent' : 'var(--other-bg)' }}>
                {k.img ? <img src={k.img} alt="" /> : '🎁'}
              </div>
              <div className="row-main">
                <div className="row-title">{k.name}</div>
                <div className="row-sub">{k.components.length} компонент(ів)</div>
              </div>
              <div>
                <div className="row-cost">{fmt(k._cost)} грн</div>
                <div className="row-sub" style={{ textAlign: 'right' }}>{usd !== null ? fmtUSD(usd) : '—'}</div>
              </div>
              <div className="row-actions">
                <button className="icon-btn" type="button" onClick={() => onEdit(k.id)}>✎</button>
                <button className="icon-btn" type="button" onClick={() => onDelete(k.id)}>✕</button>
              </div>
            </div>
          )
        })}
      </div>
      <Pager page={page} pageCount={pageCount} onPage={setPage} />
    </>
  )
}
