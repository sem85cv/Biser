import { useState, useEffect, useRef } from 'react'
import { CAT_ICON } from '../utils/calc.js'

const emptyForm = { name: '', category: 'bead', unit: 'г', qty: '', cost: '', img: '' }

export default function ItemSheet({ open, item, onSave, onClose }) {
  const [form, setForm] = useState(emptyForm)
  const fileRef = useRef(null)

  useEffect(() => {
    if (open) {
      setForm(item ? { ...item } : emptyForm)
    }
  }, [open, item])

  if (!open) return null

  function set(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  function handleFile(e) {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => set('img', reader.result)
    reader.readAsDataURL(file)
  }

  function save() {
    if (!form.name.trim()) {
      alert('Вкажіть назву товару')
      return
    }
    onSave({
      ...form,
      id: item ? item.id : undefined,
      qty: parseFloat(form.qty) || 0,
      cost: parseFloat(form.cost) || 0
    })
  }

  return (
    <div className="sheet-backdrop open" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="sheet">
        <h2>{item ? 'Редагувати товар' : 'Новий товар'}</h2>

        <div className="img-pick">
          <label className="badge badge-pick">
            {form.img ? <img src={form.img} alt="" /> : CAT_ICON[form.category]}
            <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} style={{ display: 'none' }} />
          </label>
          <span style={{ fontSize: 13, color: 'var(--muted)' }}>Іконка товару (необов'язково)</span>
        </div>

        <label>Назва</label>
        <input type="text" value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="напр. Бісер Miyuki чорний" />

        <label>Категорія</label>
        <select value={form.category} onChange={(e) => set('category', e.target.value)}>
          <option value="bead">Бісер</option>
          <option value="thread">Нитка</option>
          <option value="findings">Фурнітура</option>
          <option value="needle">Голка</option>
          <option value="other">Інше</option>
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

        <label>Загальна вартість партії, грн</label>
        <input type="number" min="0" step="0.01" value={form.cost} onChange={(e) => set('cost', e.target.value)} />

        <div className="btn-row">
          <button className="btn ghost" type="button" onClick={onClose}>Скасувати</button>
          <button className="btn primary" type="button" onClick={save}>Зберегти</button>
        </div>
      </div>
    </div>
  )
}
