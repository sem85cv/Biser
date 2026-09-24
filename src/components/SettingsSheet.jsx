import { useState, useEffect } from 'react'
import CategoriesSheet from './CategoriesSheet.jsx'

export default function SettingsSheet({ open, rate, onSaveRate, categories, onChangeCategories, onClose }) {
  const [value, setValue] = useState('')
  const [catsOpen, setCatsOpen] = useState(false)

  useEffect(() => {
    if (open) setValue(rate ? String(rate) : '')
  }, [open, rate])

  if (!open) return null

  function save() {
    const num = parseFloat(value)
    if (!num || num <= 0) {
      alert('Вкажіть коректний курс, напр. 41.5')
      return
    }
    onSaveRate(num)
    onClose()
  }

  return (
    <div className="sheet-backdrop open" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="sheet">
        <h2>Налаштування</h2>

        <label>Курс валют: 1 USD = ? грн</label>
        <input
          type="number" min="0" step="0.01" value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="напр. 41.5"
        />
        <p style={{ fontSize: 13, color: 'var(--muted)', marginTop: 10 }}>
          Курс задається вручну і використовується для показу собівартості наборів у доларах.
        </p>

        <label style={{ marginTop: 22 }}>Категорії товарів</label>
        <button className="btn ghost" type="button" style={{ width: '100%' }} onClick={() => setCatsOpen(true)}>
          Редагувати категорії
        </button>

        <div className="btn-row">
          <button className="btn ghost" type="button" onClick={onClose}>Закрити</button>
          <button className="btn primary" type="button" onClick={save}>Зберегти курс</button>
        </div>
      </div>

      <CategoriesSheet
        open={catsOpen}
        categories={categories}
        onChange={onChangeCategories}
        onClose={() => setCatsOpen(false)}
      />
    </div>
  )
}
