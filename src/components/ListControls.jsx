export default function ListControls({ search, onSearch, sortValue, onSort, sortOptions, placeholder }) {
  return (
    <div className="controls">
      <input
        type="text"
        className="search-input"
        value={search}
        onChange={(e) => onSearch(e.target.value)}
        placeholder={placeholder || 'Пошук…'}
      />
      <select className="sort-select" value={sortValue} onChange={(e) => onSort(e.target.value)}>
        {sortOptions.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  )
}
