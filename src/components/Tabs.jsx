export default function Tabs({ active, onChange }) {
  return (
    <div className="tabs">
      <button
        type="button"
        className={'tab' + (active === 'items' ? ' active' : '')}
        onClick={() => onChange('items')}
      >
        Склад
      </button>
      <button
        type="button"
        className={'tab' + (active === 'kits' ? ' active' : '')}
        onClick={() => onChange('kits')}
      >
        Набори
      </button>
    </div>
  )
}
