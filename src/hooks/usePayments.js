import { useState, useCallback } from 'react'

const API_BASE = 'http://localhost:8080'
const PAYMENTS_PATH = '/api/payments'

export function usePayments() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [payments, setPayments] = useState([])

  const createPayment = useCallback(async (paymentData) => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${API_BASE}${PAYMENTS_PATH}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData),
      })

      if (!res.ok) {
        throw new Error(`Error ${res.status}: ${res.statusText}`)
      }

      const data = await res.json()
      return data
    } catch (err) {
      setError(err.message ?? 'Error al procesar el pago')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const searchPayments = useCallback(async (filters = {}) => {
    setLoading(true)
    setError(null)
    try {
      const queryParams = new URLSearchParams()
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value)
        }
      })

      const res = await fetch(`${API_BASE}${PAYMENTS_PATH}/search?${queryParams.toString()}`)

      if (!res.ok) {
        throw new Error(`Error ${res.status}: ${res.statusText}`)
      }

      const data = await res.json()
      setPayments(Array.isArray(data) ? data : [])
      return data
    } catch (err) {
      setError(err.message ?? 'Error al buscar pagos')
      setPayments([])
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    createPayment,
    searchPayments,
    payments,
    loading,
    error,
  }
}
