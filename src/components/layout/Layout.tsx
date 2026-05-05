import { NavLink, useNavigate } from 'react-router-dom'
import { logout } from '../../utils/auth'

interface Props {
  children: React.ReactNode
  onLogout: () => void
}

const navClass = ({ isActive }: { isActive: boolean }) =>
  `text-sm px-3 py-1.5 rounded-md transition-colors ${
    isActive
      ? 'bg-teal-600/20 text-teal-400'
      : 'text-stone-400 hover:text-stone-100'
  }`

export default function Layout({ children, onLogout }: Props) {
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    onLogout()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100">
      <header className="border-b border-stone-800 px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <span className="font-bold text-lg text-stone-100">Idun</span>
          <nav className="flex items-center gap-1">
            <NavLink to="/" end className={navClass}>Översikt</NavLink>
            <NavLink to="/historik" className={navClass}>Historik</NavLink>
            <NavLink to="/ny" className={navClass}>+ Ny mätning</NavLink>
            <button
              onClick={handleLogout}
              className="text-sm text-stone-500 hover:text-stone-300 ml-3 transition-colors"
            >
              Logga ut
            </button>
          </nav>
        </div>
      </header>
      <main className="max-w-4xl mx-auto px-4 py-8">{children}</main>
    </div>
  )
}
