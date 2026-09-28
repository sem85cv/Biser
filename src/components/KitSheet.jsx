import { useState, useEffect } from 'react'
import { fmt, fmtUSD, costPerUnit, toUSD } from '../utils/calc.js'
import { uploadImage } from '../utils/upload.js'
import ItemPicker from './ItemPicker.jsx'

const BEAD_CATEGORY = 'bead'

export default function KitSheet({ open, kit, items, categories, rate, beadsPerGram, onSave, onClose }) {
  const [name, setName] = useState('')
  const [img, setImg] = useState('')
  const [uploading, setUploading] = useState(false)
  const [components, setComponents] = useState([])
  const [pickerForIndex, setPickerForIndex] = useState(null)

  const ratio = beadsPerGram > 0 ? beadsPerGram : 190

  useEffect(() => {
    if (open) {
      setName(kit ? kit.name : '')
      setImg(kit ? kit.img || '' : '')
      if (kit) {
        setComponents(kit.components.map((c) => {
          const it = items.find((i) => i.id === c.itemId)
          const isBead = it && it.category === BEAD_CATEGORY
          return { ...c, beadCount: isBead && c.qty ? String(Math.round(c.qty * ratio)) : '' }
        }))
      } else {
        setComponents(items.length ? [{ itemId: items[0].id, qty: '', beadCount: '' }] : [])
      }
    }
  }, [open, kit, items])

  if (!open) return null

  const total = components.reduce((sum, c) => {
    const it = items.find((i) => i.id === c.itemId)
    return sum + (it ? costPerUnit(it) * (parseFloat(c.qty) || 0) : 0)
  }, 0)

  function patchComponent(idx, patch) {
    setComponents((rows) => rows.map((r, i) => (i === idx ? { ...r, ...patch } : r)))
  }
  function updateQty(idx, value) {
    patchComponent(idx, { qty: value })
  }
  function updateBeadCount(idx, value) {
    const n = parseFloat(value) || 0
    const grams = n > 0 ? Math.ceil(n / ratio) : ''
    patchComponent(idx, { beadCount: value, qty: grams === '' ? '' : String(grams) })
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
    setComponents((rows) => [...rows, { itemId: items[0].id, qty: '', beadCount: '' }])
    setPickerForIndex(newIdx)
  }
  function pickItem(itemId) {
    patchComponent(pickerForIndex, { itemId, qty: '', beadCount: '' })
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
          const isBead = it && it.category === BEAD_CATEGORY
          return (
            <div key={idx} style={{ marginBottom: 8 }}>
              <div className="comp-row" style={{ marginBottom: isBead ? 4 : 0 }}>
                <button type="button" className="comp-picker-btn" onClick={() => setPickerForIndex(idx)}>
                  {it ? it.name : 'Оберіть товар'} <span className="chevron">▾</span>
                </button>
                {isBead ? (
                  <input
                    type="number" min="0" step="1" placeholder="к-сть бісеринок"
                    value={c.beadCount}
                    onChange={(e) => updateBeadCount(idx, e.target.value)}
                  />
                ) : (
                  <input
                    type="number" min="0" step="0.01" placeholder="к-сть"
                    value={c.qty}
                    onChange={(e) => updateQty(idx, e.target.value)}
                  />
                )}
                <button className="icon-btn" type="button" onClick={() => removeComponent(idx)}>✕</button>
              </div>
              {isBead && (
                <div className="row-sub" style={{ paddingLeft: 2 }}>
                  ≈ {c.qty || 0} г (за {ratio} бісеринок/г, округлено вгору)
                </div>
              )}
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
