import { useState, useMemo, useEffect, useRef } from 'react'
import Header from '../components/layout/Header'
import Sidebar from '../components/layout/Sidebar'
import Banner from '../components/layout/Banner'
import BookList from '../components/books/BookList'
import CartSidebar from '../components/cart/CartSidebar'
import { useBooksSearch } from '../hooks/useBooksSearch'
import { POPULARITY_OPTIONS } from '../utils/constants'
import '../styles/Home.css'

const Home = () => {
  const { books, loading, error, refetch } = useBooksSearch()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedGenre, setSelectedGenre] = useState('Todos')
  const [priceFromInput, setPriceFromInput] = useState('')
  const [priceToInput, setPriceToInput] = useState('')
  const [priceFrom, setPriceFrom] = useState('')
  const [priceTo, setPriceTo] = useState('')
  const [selectedPopularity, setSelectedPopularity] = useState('Ninguno')

  const priceFromTimeoutRef = useRef(null)
  const priceToTimeoutRef = useRef(null)

  const genres = useMemo(
    () => ['Todos', ...new Set(books.map(b => b.category).filter(Boolean))],
    [books]
  )

  const handleSearch = (query) => {
    setSearchQuery(query)
  }

  const handleGenreFilter = (genre) => {
    setSelectedGenre(genre)
  }

  const handlePriceFromChange = (value) => {
    setPriceFromInput(value)

    if (priceFromTimeoutRef.current) {
      clearTimeout(priceFromTimeoutRef.current)
    }

    priceFromTimeoutRef.current = setTimeout(() => {
      setPriceFrom(value)
    }, 500)
  }

  const handlePriceToChange = (value) => {
    setPriceToInput(value)

    if (priceToTimeoutRef.current) {
      clearTimeout(priceToTimeoutRef.current)
    }

    priceToTimeoutRef.current = setTimeout(() => {
      setPriceTo(value)
    }, 500)
  }

  useEffect(() => {
    return () => {
      if (priceFromTimeoutRef.current) {
        clearTimeout(priceFromTimeoutRef.current)
      }
      if (priceToTimeoutRef.current) {
        clearTimeout(priceToTimeoutRef.current)
      }
    }
  }, [])

  const handlePopularityFilter = (popularity) => {
    setSelectedPopularity(popularity)
  }

  const handleClearFilters = () => {
    setSelectedGenre('Todos')
    setPriceFromInput('')
    setPriceToInput('')
    setPriceFrom('')
    setPriceTo('')
    setSelectedPopularity('Ninguno')

    // Limpiar timeouts
    if (priceFromTimeoutRef.current) {
      clearTimeout(priceFromTimeoutRef.current)
    }
    if (priceToTimeoutRef.current) {
      clearTimeout(priceToTimeoutRef.current)
    }
  }

  const filteredBooks = useMemo(() => {
    let result = [...books]

    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      result = result.filter(
        book =>
          book.title?.toLowerCase().includes(q) ||
          book.author?.toLowerCase().includes(q)
      )
    }

    if (selectedGenre !== 'Todos') {
      result = result.filter(book => book.category === selectedGenre)
    }

    if (priceFrom) {
      const fromValue = priceFrom.replace(/\./g, '')
      const from = parseFloat(fromValue)
      if (!isNaN(from)) {
        result = result.filter(book => book.price >= from)
      }
    }
    if (priceTo) {
      const toValue = priceTo.replace(/\./g, '')
      const to = parseFloat(toValue)
      if (!isNaN(to)) {
        result = result.filter(book => book.price <= to)
      }
    }

    if (selectedPopularity === 'Más vendidos') {
      result = [...result].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
    } else if (selectedPopularity === 'Menos vendidos') {
      result = [...result].sort((a, b) => (a.rating ?? 0) - (b.rating ?? 0))
    }

    return result
  }, [books, searchQuery, selectedGenre, priceFrom, priceTo, selectedPopularity])

  return (
    <div className="home-container">
      <Header onSearch={handleSearch} />
      <Banner />
      <div className="home-content">
        <Sidebar
          genres={genres}
          selectedGenre={selectedGenre}
          priceFrom={priceFromInput}
          priceTo={priceToInput}
          selectedPopularity={selectedPopularity}
          onGenreFilter={handleGenreFilter}
          onPriceFromChange={handlePriceFromChange}
          onPriceToChange={handlePriceToChange}
          onPopularityFilter={handlePopularityFilter}
          onClearFilters={handleClearFilters}
        />
        <main className="main-content">
          <BookList
            books={filteredBooks}
            loading={loading}
            error={error}
            onRetry={refetch}
          />
        </main>
      </div>
      <CartSidebar />
    </div>
  )
}

export default Home

