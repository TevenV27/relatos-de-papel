import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useCart } from '../../hooks/useCart'
import { 
  FaBook, 
  FaSearch, 
  FaGlobe, 
  FaUser, 
  FaShoppingCart, 
  FaSignOutAlt 
} from 'react-icons/fa'
import '../../styles/Header.css'

const Header = ({ onSearch }) => {
  const [searchValue, setSearchValue] = useState('')
  const { logout, isAuthenticated } = useAuth()
  const { openCart, getTotalItems } = useCart()
  const navigate = useNavigate()

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (onSearch) {
      onSearch(searchValue)
    }
  }

  const handleSearchChange = (e) => {
    const value = e.target.value
    setSearchValue(value)
    if (onSearch) {
      onSearch(value)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="header">
      <div className="header-content">
        <div className="header-left">
          <div className="logo" onClick={() => navigate('/home')}>
            <FaBook className="logo-icon" />
            <span>Relatos de Papel</span>
          </div>
        </div>
        
        <div className="header-center">
          <form onSubmit={handleSearchSubmit} className="search-form">
            <div className="search-input-wrapper">
              <input
                type="text"
                className="search-input"
                placeholder="Buscar libros, autores..."
                value={searchValue}
                onChange={handleSearchChange}
              />
              <button type="submit" className="search-button">
                <FaSearch />
              </button>
            </div>
          </form>
        </div>
        
        <div className="header-right">
          <button className="header-icon-button" title="Cambiar idioma">
            <FaGlobe />
          </button>
          <button 
            className="header-icon-button" 
            onClick={() => navigate(isAuthenticated ? '/profile' : '/login')}
            title="Perfil"
          >
            <FaUser />
          </button>
          <button 
            className="header-icon-button cart-button" 
            onClick={openCart}
            title="Carrito"
          >
            <FaShoppingCart />
            {getTotalItems() > 0 && (
              <span className="cart-badge">{getTotalItems()}</span>
            )}
          </button>
          <button 
            className="header-icon-button logout-button" 
            onClick={handleLogout}
            title="Cerrar sesión"
          >
            <FaSignOutAlt />
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header

