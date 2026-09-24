const FALLBACK_CATEGORY = { id: 'other', label: 'Інше', icon: '📦', color: '#ECEAF6' }

export function getCategory(categories, id) {
  return (categories || []).find((c) => c.id === id) || FALLBACK_CATEGORY
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

export function toUSD(uah, rate) {
  return rate > 0 ? uah / rate : null
}

export function fmtUSD(n) {
  return '$' + (Math.round((n || 0) * 100) / 100).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
}
