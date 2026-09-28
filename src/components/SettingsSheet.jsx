import { useState, useEffect } from 'react'
import CategoriesSheet from './CategoriesSheet.jsx'

export default function SettingsSheet({ open, rate, beadsPerGram, onSave, categories, onChangeCategories, onClose }) {
  const [rateValue, setRateValue] = useState('')
  const [beadsValue, setBeadsValue] = useState('')
  const [catsOpen, setCatsOpen] = useState(false)

  useEffect(() => {
    if (open) {
      setRateValue(rate ? String(rate) : '')
      setBeadsValue(beadsPerGram ? String(beadsPerGram) : '190')
    }
  }, [open, rate, beadsPerGram])

  if (!open) return null

  function save() {
    const patch = {}
    if (rateValue !== '') {
      const num = parseFloat(rateValue)
      if (!num || num <= 0) {
        alert('Вкажіть коректний курс, напр. 41.5')
        return
      }
      patch.rate = num
    }
    const beadsNum = parseFloat(beadsValue)
    if (!beadsNum || beadsNum <= 0) {
      alert('Вкажіть коректну кількість бісеринок в грамі, напр. 190')
      return
    }
    patch.beadsPerGram = beadsNum
    onSave(patch)
    onClose()
  }

  return (
    <div className="sheet-backdrop open" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="sheet">
        <h2>Налаштування</h2>

        <label>Курс валют: 1 USD = ? грн</label>
        <input
          type="number" min="0" step="0.01" value={rateValue}
          onChange={(e) => setRateValue(e.target.value)}
          placeholder="напр. 41.5"
        />
        <p style={{ fontSize: 13, color: 'var(--muted)', marginTop: 10 }}>
          Курс задається вручну і використовується для показу собівартості наборів у доларах.
        </p>

        <label style={{ marginTop: 20 }}>Скільки бісеринок в 1 грамі</label>
        <input
          type="number" min="1" step="1" value={beadsValue}
          onChange={(e) => setBeadsValue(e.target.value)}
          placeholder="напр. 190"
        />
        <p style={{ fontSize: 13, color: 'var(--muted)', marginTop: 10 }}>
          Використовується, щоб перерахувати кількість бісеринок у грами при додаванні
          бісеру в набір (з округленням вгору). Залежить від розміру бісеру, тож можна
          підлаштувати під свій.
        </p>

        <label style={{ marginTop: 22 }}>Категорії товарів</label>
        <button className="btn ghost" type="button" style={{ width: '100%' }} onClick={() => setCatsOpen(true)}>
          Редагувати категорії
        </button>

        <div className="btn-row">
          <button className="btn ghost" type="button" onClick={onClose}>Закрити</button>
          <button className="btn primary" type="button" onClick={save}>Зберегти</button>
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
