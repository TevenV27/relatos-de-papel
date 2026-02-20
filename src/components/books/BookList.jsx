import BookCard from './BookCard'
import '../../styles/BookList.css'

const PLACEHOLDER_IMAGE = 'sin_portada.jpg'

const BookList = ({ books, loading, error, onRetry }) => {
  if (loading) {
    return (
      <div className="book-list book-list-loading">
        <p>Cargando catálogo...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="book-list book-list-error">
        <p>{error}</p>
        {onRetry && (
          <button type="button" className="book-list-retry" onClick={onRetry}>
            Reintentar
          </button>
        )}
      </div>
    )
  }

  if (books.length === 0) {
    return (
      <div className="book-list-empty">
        <p>No se encontraron libros con los filtros seleccionados.</p>
      </div>
    )
  }

  return (
    <div className="book-list">
      <div className="book-list-header">
        <h2>Catálogo de Libros</h2>
        <p className="book-count">{books.length} libro{books.length !== 1 ? 's' : ''} encontrado{books.length !== 1 ? 's' : ''}</p>
      </div>
      <div className="book-list-grid">
        {books.map(book => (
          <BookCard
            key={book.id}
            book={{ ...book, image: book.image || PLACEHOLDER_IMAGE }}
          />
        ))}
      </div>
    </div>
  )
}

export default BookList

