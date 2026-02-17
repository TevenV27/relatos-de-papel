import { useState, useEffect, useCallback } from 'react'

const API_BASE = 'http://localhost:8080'
const SEARCH_PATH = '/api/books'


function normalizeBook(raw) {
  return {
    id: raw.id,
    title: raw.title,
    author: raw.author,
    isbn: raw.isbn,
    price: Number(raw.price),
    stock: raw.stock,
    category: raw.category,
    publicationDate: raw.publicationDate,
    rating: raw.rating,
    visible: raw.visible,
    image: raw.image ?? null
  }
}


export function useBooksSearch() {
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchBooks = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${API_BASE}/api/books/action`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          method: 'GET',
          path: SEARCH_PATH
        })
      })
      if (!res.ok) {
        throw new Error(`Error ${res.status}: ${res.statusText}`)
      }
      const data = await res.json()
      const list = Array.isArray(data) ? data : []
      setBooks(list.map(normalizeBook))
    } catch (err) {
      setError(err.message ?? 'Error al cargar los libros')
      setBooks([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchBooks()
  }, [fetchBooks])

  return { books, loading, error, refetch: fetchBooks }
}
