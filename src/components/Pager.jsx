export default function Pager({ page, pageCount, onPage }) {
  if (pageCount <= 1) return null
  return (
    <div className="pager">
      <button type="button" className="pager-btn" disabled={page <= 1} onClick={() => onPage(page - 1)}>‹ Назад</button>
      <span className="pager-info">{page} з {pageCount}</span>
      <button type="button" className="pager-btn" disabled={page >= pageCount} onClick={() => onPage(page + 1)}>Далі ›</button>
    </div>
  )
}
