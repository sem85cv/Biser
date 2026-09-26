import { useState, useEffect } from 'react'
import { fmt, fmtUSD, costPerUnit, toUSD } from '../utils/calc.js'
import { uploadImage } from '../utils/upload.js'
import ItemPicker from './ItemPicker.jsx'

export default function KitSheet({ open, kit, items, categories, rate, onSave, onClose }) {
  const [name, setName] = useState('')
  const [img, setImg] = useState('')
  const [uploading, setUploading] = useState(false)
  const [components, setComponents] = useState([])
  const [pickerForIndex, setPickerForIndex] = useState(null)

  useEffect(() => {
    if (open) {
      setName(kit ? kit.name : '')
      setImg(kit ? kit.img || '' : '')
      if (kit) {
        setComponents(kit.components)
      } else {
        setComponents(items.length ? [{ itemId: items[0].id, qty: '' }] : [])
      }
    }
  }, [open, kit, items])

  if (!open) return null

  const total = components.reduce((sum, c) => {
    const it = items.find((i) => i.id === c.itemId)
    return sum + (it ? costPerUnit(it) * (parseFloat(c.qty) || 0) : 0)
  }, 0)

  function updateComponent(idx, field, value) {
    setComponents((rows) => rows.map((r, i) => (i === idx ? { ...r, [field]: value } : r)))
  }
  function removeComponent(idx) {
    setComponents((rows) => rows.filter((_, i) => i !== idx))
  }
  function addComponent() {
    if (!items.length) {
      alert('Спочатку додайте товари на склад')
      return
    }
    const newIdx = components.length
    setComponents((rows) => [...rows, { itemId: items[0].id, qty: '' }])
    setPickerForIndex(newIdx)
  }
  function pickItem(itemId) {
    updateComponent(pickerForIndex, 'itemId', itemId)
    setPickerForIndex(null)
  }

  function handleFile(e) {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)
    uploadImage(file, 'kits')
      .then((url) => setImg(url))
      .catch((err) => alert('Не вдалося завантажити фото: ' + err.message))
      .finally(() => setUploading(false))
  }

  function save() {
    if (!name.trim()) {
      alert('Вкажіть назву набору')
      return
    }
    const cleaned = components
      .map((c) => ({ itemId: c.itemId, qty: parseFloat(c.qty) || 0 }))
      .filter((c) => c.qty > 0)
    onSave({ id: kit ? kit.id : undefined, name, img, components: cleaned })
  }

  return (
    <div className="sheet-backdrop open" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="sheet">
        <h2>{kit ? 'Редагувати набір' : 'Новий набір'}</h2>

        <div className="img-pick">
          <label className="badge badge-pick">
            {uploading ? '…' : (img ? <img src={img} alt="" /> : '🎁')}
            <input type="file" accept="image/*" onChange={handleFile} style={{ display: 'none' }} />
          </label>
          <span style={{ fontSize: 13, color: 'var(--muted)' }}>{uploading ? 'Завантаження…' : "Фото набору (необов'язково)"}</span>
        </div>

        <label>Назва набору</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="напр. Браслет «Літо»" />

        <label>Компоненти</label>
        {!items.length && <div className="row-sub">Спочатку додайте товари на склад.</div>}
        {components.map((c, idx) => {
          const it = items.find((i) => i.id === c.itemId)
          return (
            <div className="comp-row" key={idx}>
              <button type="button" className="comp-picker-btn" onClick={() => setPickerForIndex(idx)}>
                {it ? it.name : 'Оберіть товар'} <span className="chevron">▾</span>
              </button>
              <input
                type="number" min="0" step="0.01" placeholder="к-сть"
                value={c.qty}
                onChange={(e) => updateComponent(idx, 'qty', e.target.value)}
              />
              <button className="icon-btn" type="button" onClick={() => removeComponent(idx)}>✕</button>
            </div>
          )
        })}
        <button className="link-btn" type="button" onClick={addComponent}>+ Додати компонент</button>

        <div className="total-line">
          <span>Собівартість набору</span>
          <div style={{ textAlign: 'right' }}>
            <b>{fmt(total)} грн</b>
            <div className="row-sub">{toUSD(total, rate) !== null ? fmtUSD(toUSD(total, rate)) : 'встановіть курс у ⚙'}</div>
          </div>
        </div>

        <div className="btn-row">
          <button className="btn ghost" type="button" onClick={onClose}>Скасувати</button>
          <button className="btn primary" type="button" onClick={save}>Зберегти</button>
        </div>
      </div>

      <ItemPicker
        open={pickerForIndex !== null}
        items={items}
        categories={categories}
        onSelect={pickItem}
        onClose={() => setPickerForIndex(null)}
      />
    </div>
  )
}
