import { newId } from '../utils/storage.js'

export default function CategoriesSheet({ open, categories, onChange, onClose }) {
  if (!open) return null

  function update(id, field, value) {
    onChange(categories.map((c) => (c.id === id ? { ...c, [field]: value } : c)))
  }
  function remove(id) {
    if (confirm('Видалити категорію? Товари з нею залишаться, але покажуться як «Інше».')) {
      onChange(categories.filter((c) => c.id !== id))
    }
  }
  function add() {
    onChange([...categories, { id: newId('cat'), label: '', icon: '🏷️', color: '#ECEAF6' }])
  }

  return (
    <div className="sheet-backdrop picker-backdrop open" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="sheet">
        <h2>Категорії товарів</h2>
        <div className="cat-list">
          {categories.map((c) => (
            <div className="cat-row" key={c.id}>
              <input
                type="text" className="cat-icon-input" maxLength={2}
                value={c.icon} onChange={(e) => update(c.id, 'icon', e.target.value)}
              />
              <input
                type="text" className="cat-label-input" placeholder="Назва категорії"
                value={c.label} onChange={(e) => update(c.id, 'label', e.target.value)}
              />
              <input
                type="color" className="cat-color-input"
                value={c.color.startsWith('#') ? c.color : '#ECEAF6'}
                onChange={(e) => update(c.id, 'color', e.target.value)}
              />
              <button className="icon-btn" type="button" onClick={() => remove(c.id)}>✕</button>
            </div>
          ))}
        </div>
        <button className="link-btn" type="button" onClick={add}>+ Додати категорію</button>
        <div className="btn-row">
          <button className="btn primary" type="button" onClick={onClose}>Готово</button>
        </div>
      </div>
    </div>
  )
}
