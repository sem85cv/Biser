import { useState, useEffect } from 'react'

export default function SettingsSheet({ open, rate, onSave, onClose }) {
  const [value, setValue] = useState('')

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
    onSave(num)
    onClose()
  }

  return (
    <div className="sheet-backdrop open" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="sheet">
        <h2>Курс валют</h2>
        <label>1 USD = ? грн</label>
        <input
          type="number" min="0" step="0.01" value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="напр. 41.5"
        />
        <p style={{ fontSize: 13, color: 'var(--muted)', marginTop: 10 }}>
          Курс встановлюється вручну і використовується для показу собівартості наборів у доларах.
        </p>
        <div className="btn-row">
          <button className="btn ghost" type="button" onClick={onClose}>Скасувати</button>
          <button className="btn primary" type="button" onClick={save}>Зберегти</button>
        </div>
      </div>
    </div>
  )
}
