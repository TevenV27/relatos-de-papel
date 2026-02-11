import { useParams, useNavigate } from 'react-router-dom'
import { useBooksSearch } from '../hooks/useBooksSearch'
import { useCart } from '../hooks/useCart'
import Header from '../components/layout/Header'
import CartSidebar from '../components/cart/CartSidebar'
import '../styles/BookDetail.css'

const PLACEHOLDER_IMAGE = 'https://via.placeholder.com/200x280?text=Sin+imagen'

const BookDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { books, loading, error } = useBooksSearch()
  const { addToCart, openCart } = useCart()
  const book = books.find(b => String(b.id) === String(id))
  const displayBook = book
    ? { ...book, image: book.image || PLACEHOLDER_IMAGE }
    : null

  const handleAddToCart = () => {
    if (displayBook) {
      addToCart(displayBook)
      openCart()
    }
  }

  if (loading) {
    return (
      <div className="book-detail-container">
        <Header />
        <div className="book-not-found">
          <p>Cargando...</p>
        </div>
      </div>
    )
  }

  if (error || !displayBook) {
    return (
      <div className="book-detail-container">
        <Header />
        <div className="book-not-found">
          <h2>Libro no encontrado</h2>
          <button onClick={() => navigate('/home')}>Volver al inicio</button>
        </div>
      </div>
    )
  }

  return (
    <div className="book-detail-container">
      <Header />
      <div className="book-detail-content">
        <button className="back-button" onClick={() => navigate('/home')}>
          ← Volver
        </button>

        <div className="book-detail-grid">
          <div className="book-detail-image">
            <img src={displayBook.image} alt={displayBook.title} />
          </div>

          <div className="book-detail-info">
            <h1 className="book-detail-title">{displayBook.title}</h1>
            <p className="book-detail-author">por {displayBook.author}</p>

            <div className="book-detail-meta">
              {displayBook.category && (
                <span className="book-meta-item">Género: {displayBook.category}</span>
              )}
              {displayBook.publicationDate && (
                <span className="book-meta-item">
                  Publicación: {new Date(displayBook.publicationDate).getFullYear()}
                </span>
              )}
              {displayBook.rating != null && (
                <span className="book-meta-item">Valoración: {displayBook.rating}</span>
              )}
            </div>

            <div className="book-detail-price">
              <span className="price-label">Precio:</span>
              <span className="price-value">
                ${Number(displayBook.price).toLocaleString('es-CO')}
              </span>
            </div>

            {displayBook.description && (
              <div className="book-detail-description">
                <h3>Descripción</h3>
                <p>{displayBook.description}</p>
              </div>
            )}

            <button className="add-to-cart-button" onClick={handleAddToCart}>
              Agregar al carrito
            </button>
          </div>
        </div>
      </div>
      <CartSidebar />
    </div>
  )
}

export default BookDetail

