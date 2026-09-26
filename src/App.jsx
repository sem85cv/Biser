import { useState } from 'react'
import Header from './components/Header.jsx'
import Tabs from './components/Tabs.jsx'
import ItemsList from './components/ItemsList.jsx'
import KitsList from './components/KitsList.jsx'
import ItemSheet from './components/ItemSheet.jsx'
import KitSheet from './components/KitSheet.jsx'
import SettingsSheet from './components/SettingsSheet.jsx'
import Login from './components/Login.jsx'
import { useAuth } from './hooks/useAuth.js'
import { useFirestoreCollection } from './hooks/useFirestoreCollection.js'
import { useSettingsDoc } from './hooks/useSettingsDoc.js'

export default function App() {
  const { user, loading: authLoading, signIn, signOut } = useAuth()
  const { docs: items, add: addItem, update: updateItem, remove: removeItem, error: itemsError } = useFirestoreCollection('items')
  const { docs: kits, add: addKit, update: updateKit, remove: removeKit } = useFirestoreCollection('kits')
  const { categories, rate, save: saveSettings } = useSettingsDoc()

  const [tab, setTab] = useState('items')

  const [itemSheetOpen, setItemSheetOpen] = useState(false)
  const [editingItemId, setEditingItemId] = useState(null)

  const [kitSheetOpen, setKitSheetOpen] = useState(false)
  const [editingKitId, setEditingKitId] = useState(null)

  const [settingsOpen, setSettingsOpen] = useState(false)

  const editingItem = items.find((i) => i.id === editingItemId) || null
  const editingKit = kits.find((k) => k.id === editingKitId) || null

  if (authLoading) {
    return <div className="center-screen">Завантаження…</div>
  }
  if (!user) {
    return <Login onSignIn={signIn} />
  }
  if (itemsError && itemsError.code === 'permission-denied') {
    return (
      <div className="center-screen">
        <p>У вас немає доступу до цього складу.<br />Зверніться до власника, щоб додав ваш акаунт у список дозволених.</p>
        <button className="btn ghost" type="button" onClick={signOut}>Вийти й спробувати інший акаунт</button>
      </div>
    )
  }

  function openNewItem() { setEditingItemId(null); setItemSheetOpen(true) }
  function openEditItem(id) { setEditingItemId(id); setItemSheetOpen(true) }
  function saveItem(data) {
    const { id, ...rest } = data
    if (id) {
      updateItem(id, rest)
    } else {
      addItem({ ...rest, createdAt: Date.now() })
    }
    setItemSheetOpen(false)
  }
  function deleteItem(id) {
    if (confirm('Видалити товар зі складу?')) removeItem(id)
  }

  function openNewKit() { setEditingKitId(null); setKitSheetOpen(true) }
  function openEditKit(id) { setEditingKitId(id); setKitSheetOpen(true) }
  function saveKit(data) {
    const { id, ...rest } = data
    if (id) {
      updateKit(id, rest)
    } else {
      addKit({ ...rest, createdAt: Date.now() })
    }
    setKitSheetOpen(false)
  }
  function deleteKit(id) {
    if (confirm('Видалити набір?')) removeKit(id)
  }

  function saveCategories(newCategories) { saveSettings({ categories: newCategories }) }
  function saveRate(newRate) { saveSettings({ rate: newRate }) }

  return (
    <div className="app">
      <Header user={user} onSettings={() => setSettingsOpen(true)} onSignOut={signOut} />
      <Tabs active={tab} onChange={setTab} />

      {tab === 'items'
        ? <ItemsList items={items} categories={categories} onEdit={openEditItem} onDelete={deleteItem} />
        : <KitsList kits={kits} items={items} rate={rate} onEdit={openEditKit} onDelete={deleteKit} />}

      <button className="fab" type="button" onClick={tab === 'items' ? openNewItem : openNewKit}>+</button>

      <ItemSheet open={itemSheetOpen} item={editingItem} categories={categories} onSave={saveItem} onClose={() => setItemSheetOpen(false)} />
      <KitSheet open={kitSheetOpen} kit={editingKit} items={items} categories={categories} rate={rate} onSave={saveKit} onClose={() => setKitSheetOpen(false)} />
      <SettingsSheet
        open={settingsOpen} rate={rate} onSaveRate={saveRate}
        categories={categories} onChangeCategories={saveCategories}
        onClose={() => setSettingsOpen(false)}
      />
    </div>
  )
}
