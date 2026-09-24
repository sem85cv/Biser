import { useState } from 'react'
import Header from './components/Header.jsx'
import Tabs from './components/Tabs.jsx'
import ItemsList from './components/ItemsList.jsx'
import KitsList from './components/KitsList.jsx'
import ItemSheet from './components/ItemSheet.jsx'
import KitSheet from './components/KitSheet.jsx'
import SettingsSheet from './components/SettingsSheet.jsx'
import { usePersistedState, newId } from './utils/storage.js'
import { DEFAULT_CATEGORIES } from './utils/categories.js'

export default function App() {
  const [items, setItems] = usePersistedState('beads_items', [])
  const [kits, setKits] = usePersistedState('beads_kits', [])
  const [rate, setRate] = usePersistedState('beads_usd_rate', 0)
  const [categories, setCategories] = usePersistedState('beads_categories', DEFAULT_CATEGORIES)
  const [tab, setTab] = useState('items')

  const [itemSheetOpen, setItemSheetOpen] = useState(false)
  const [editingItemId, setEditingItemId] = useState(null)

  const [kitSheetOpen, setKitSheetOpen] = useState(false)
  const [editingKitId, setEditingKitId] = useState(null)

  const [settingsOpen, setSettingsOpen] = useState(false)

  const editingItem = items.find((i) => i.id === editingItemId) || null
  const editingKit = kits.find((k) => k.id === editingKitId) || null

  function openNewItem() { setEditingItemId(null); setItemSheetOpen(true) }
  function openEditItem(id) { setEditingItemId(id); setItemSheetOpen(true) }
  function saveItem(data) {
    if (data.id) {
      setItems((all) => all.map((i) => (i.id === data.id ? { ...i, ...data } : i)))
    } else {
      setItems((all) => [...all, { ...data, id: newId('it'), createdAt: Date.now() }])
    }
    setItemSheetOpen(false)
  }
  function deleteItem(id) {
    if (confirm('Видалити товар зі складу?')) {
      setItems((all) => all.filter((i) => i.id !== id))
    }
  }

  function openNewKit() { setEditingKitId(null); setKitSheetOpen(true) }
  function openEditKit(id) { setEditingKitId(id); setKitSheetOpen(true) }
  function saveKit(data) {
    if (data.id) {
      setKits((all) => all.map((k) => (k.id === data.id ? { ...k, ...data } : k)))
    } else {
      setKits((all) => [...all, { ...data, id: newId('kit'), createdAt: Date.now() }])
    }
    setKitSheetOpen(false)
  }
  function deleteKit(id) {
    if (confirm('Видалити набір?')) {
      setKits((all) => all.filter((k) => k.id !== id))
    }
  }

  return (
    <div className="app">
      <Header onSettings={() => setSettingsOpen(true)} />
      <Tabs active={tab} onChange={setTab} />

      {tab === 'items'
        ? <ItemsList items={items} categories={categories} onEdit={openEditItem} onDelete={deleteItem} />
        : <KitsList kits={kits} items={items} rate={rate} onEdit={openEditKit} onDelete={deleteKit} />}

      <button className="fab" type="button" onClick={tab === 'items' ? openNewItem : openNewKit}>+</button>

      <ItemSheet open={itemSheetOpen} item={editingItem} categories={categories} onSave={saveItem} onClose={() => setItemSheetOpen(false)} />
      <KitSheet open={kitSheetOpen} kit={editingKit} items={items} categories={categories} onSave={saveKit} onClose={() => setKitSheetOpen(false)} />
      <SettingsSheet
        open={settingsOpen} rate={rate} onSaveRate={setRate}
        categories={categories} onChangeCategories={setCategories}
        onClose={() => setSettingsOpen(false)}
      />
    </div>
  )
}
