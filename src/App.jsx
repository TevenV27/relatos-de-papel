import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import Login from './pages/Login'
import Home from './pages/Home'
import BookDetail from './pages/BookDetail'
import Landing from './pages/Landing'

function App() {
  const { isAuthenticated } = useAuth()

  return (
    <Routes>
      <Route 
        path="/" 
        element={<Landing />} 
      />
      <Route 
        path="/login" 
        element={isAuthenticated ? <Navigate to="/home" replace /> : <Login />} 
      />
      <Route 
        path="/home" 
        element={<Home />} 
      />
      <Route 
        path="/book/:id" 
        element={isAuthenticated ? <BookDetail /> : <Navigate to="/login" replace />} 
      />
    </Routes>  
  )
}

export default App

