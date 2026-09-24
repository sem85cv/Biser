export const CAT_ICON = { bead: '📿', thread: '🧵', findings: '🔗', needle: '🪡', other: '📦' }
export const CAT_LABEL = { bead: 'Бісер', thread: 'Нитка', findings: 'Фурнітура', needle: 'Голка', other: 'Інше' }
export const CAT_BG = {
  bead: 'var(--bead-bg)',
  thread: 'var(--thread-bg)',
  findings: 'var(--find-bg)',
  needle: 'var(--needle-bg)',
  other: 'var(--other-bg)'
}

export function fmt(n) {
  return (Math.round((n || 0) * 100) / 100).toLocaleString('uk-UA', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
}

export function costPerUnit(item) {
  return item.qty > 0 ? item.cost / item.qty : 0
}

export function kitCost(kit, items) {
  return kit.components.reduce((sum, c) => {
    const item = items.find((i) => i.id === c.itemId)
    return sum + (item ? costPerUnit(item) * c.qty : 0)
  }, 0)
}
