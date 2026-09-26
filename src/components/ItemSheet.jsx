import { useState, useEffect, useRef } from 'react'
import { getCategory } from '../utils/calc.js'
import { uploadImage } from '../utils/upload.js'

const emptyForm = { name: '', category: '', unit: 'г', qty: '', cost: '', img: '' }

export default function ItemSheet({ open, item, categories, onSave, onClose }) {
  const [form, setForm] = useState(emptyForm)
  const [costMode, setCostMode] = useState('total') // 'total' | 'unit'
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef(null)

  useEffect(() => {
    if (open) {
      setForm(item ? { ...item } : { ...emptyForm, category: categories[0] ? categories[0].id : '' })
      setCostMode('total')
    }
  }, [open, item, categories])

  if (!open) return null

  function set(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  function switchMode(mode) {
    if (mode === costMode) return
    const qty = parseFloat(form.qty) || 0
    const cur = parseFloat(form.cost) || 0
    let converted = ''
    if (qty > 0 && cur > 0) {
      converted = mode === 'unit' ? String(Math.round((cur / qty) * 100) / 100) : String(Math.round(cur * qty * 100) / 100)
    }
    setForm((f) => ({ ...f, cost: converted }))
    setCostMode(mode)
  }

  function handleFile(e) {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)
    uploadImage(file, 'items')
      .then((url) => set('img', url))
      .catch((err) => alert('Не вдалося завантажити фото: ' + err.message))
      .finally(() => setUploading(false))
  }

  function save() {
    if (!form.name.trim()) {
      alert('Вкажіть назву товару')
      return
    }
    const qty = parseFloat(form.qty) || 0
    const costInput = parseFloat(form.cost) || 0
    const totalCost = costMode === 'unit' ? costInput * qty : costInput
    onSave({
      ...form,
      id: item ? item.id : undefined,
      qty,
      cost: totalCost
    })
  }

  return (
    <div className="sheet-backdrop open" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="sheet">
        <h2>{item ? 'Редагувати товар' : 'Новий товар'}</h2>

        <div className="img-pick">
          <label className="badge badge-pick" style={{ background: form.img ? 'transparent' : getCategory(categories, form.category).color }}>
            {uploading ? '…' : (form.img ? <img src={form.img} alt="" /> : getCategory(categories, form.category).icon)}
            <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} style={{ display: 'none' }} />
          </label>
          <span style={{ fontSize: 13, color: 'var(--muted)' }}>{uploading ? 'Завантаження…' : "Іконка товару (необов'язково)"}</span>
        </div>

        <label>Назва</label>
        <input type="text" value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="напр. Бісер Miyuki чорний" />

        <label>Категорія</label>
        <select value={form.category} onChange={(e) => set('category', e.target.value)}>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.label || '(без назви)'}</option>
          ))}
        </select>

        <div className="row2">
          <div>
            <label>Одиниця</label>
            <select value={form.unit} onChange={(e) => set('unit', e.target.value)}>
              <option value="г">грам</option>
              <option value="м">метр</option>
              <option value="шт">штук</option>
            </select>
          </div>
          <div>
            <label>Кількість на складі</label>
            <input type="number" min="0" step="0.01" value={form.qty} onChange={(e) => set('qty', e.target.value)} />
          </div>
        </div>

        <label>Як вказати вартість</label>
        <div className="mode-toggle">
          <button type="button" className={'mode-btn' + (costMode === 'total' ? ' active' : '')} onClick={() => switchMode('total')}>
            Загальна вартість партії
          </button>
          <button type="button" className={'mode-btn' + (costMode === 'unit' ? ' active' : '')} onClick={() => switchMode('unit')}>
            Вартість за {form.unit || 'од.'}
          </button>
        </div>

        <label>{costMode === 'unit' ? `Вартість однієї одиниці (грн/${form.unit || 'од.'})` : 'Загальна вартість партії, грн'}</label>
        <input type="number" min="0" step="0.01" value={form.cost} onChange={(e) => set('cost', e.target.value)} />
        {costMode === 'unit' && (
          <p style={{ fontSize: 12.5, color: 'var(--muted)', marginTop: 6 }}>
            Загальна вартість партії: {(((parseFloat(form.cost) || 0) * (parseFloat(form.qty) || 0)) || 0).toFixed(2)} грн
          </p>
        )}

        <div className="btn-row">
          <button className="btn ghost" type="button" onClick={onClose}>Скасувати</button>
          <button className="btn primary" type="button" onClick={save}>Зберегти</button>
        </div>
      </div>
    </div>
  )
}
