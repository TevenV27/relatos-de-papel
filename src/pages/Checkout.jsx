import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../hooks/useCart'
import { usePayments } from '../hooks/usePayments'
import { FaArrowLeft, FaCreditCard, FaLock, FaSpinner } from 'react-icons/fa'
import '../styles/Checkout.css'

const Checkout = () => {
  const navigate = useNavigate()
  const { cartItems, getTotalPrice, clearCart } = useCart()
  const { createPayment, loading: paymentLoading, error: paymentError } = usePayments()

  const [formData, setFormData] = useState({
    // Información de envío
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    // Información de pago
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: ''
  })

  const [errors, setErrors] = useState({})
  const [processingStatus, setProcessingStatus] = useState('')

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    // Validar información de envío
    if (!formData.fullName.trim()) newErrors.fullName = 'El nombre es requerido'
    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido'
    }
    if (!formData.phone.trim()) newErrors.phone = 'El teléfono es requerido'
    if (!formData.address.trim()) newErrors.address = 'La dirección es requerida'
    if (!formData.city.trim()) newErrors.city = 'La ciudad es requerida'
    if (!formData.postalCode.trim()) newErrors.postalCode = 'El código postal es requerido'

    // Validar información de pago
    if (!formData.cardNumber.trim()) {
      newErrors.cardNumber = 'El número de tarjeta es requerido'
    } else if (formData.cardNumber.replace(/\s/g, '').length < 16) {
      newErrors.cardNumber = 'Número de tarjeta inválido'
    }
    if (!formData.cardName.trim()) newErrors.cardName = 'El nombre en la tarjeta es requerido'
    if (!formData.expiryDate.trim()) {
      newErrors.expiryDate = 'La fecha de expiración es requerida'
    } else if (!/^\d{2}\/\d{2}$/.test(formData.expiryDate)) {
      newErrors.expiryDate = 'Formato inválido (MM/AA)'
    }
    if (!formData.cvv.trim()) {
      newErrors.cvv = 'El CVV es requerido'
    } else if (formData.cvv.length < 3) {
      newErrors.cvv = 'CVV inválido'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (validateForm()) {
      setProcessingStatus('Procesando pago...')

      try {
        // Crear un pago por cada libro en el carrito
        // El microservicio espera un pago por libro según el DTO
        const paymentPromises = cartItems.map(item => {
          const paymentDTO = {
            bookId: item.id,
            quantity: item.quantity,
            unitPrice: item.price,
            totalAmount: item.price * item.quantity,
            customerName: formData.fullName,
            customerEmail: formData.email,
            paymentMethod: 'CREDIT_CARD', // Simplificado para este ejemplo
            status: 'COMPLETED' // Asumimos completado para la demo
          }
          return createPayment(paymentDTO)
        })

        await Promise.all(paymentPromises)

        alert('¡Compra procesada exitosamente! Gracias por tu compra.')
        clearCart()
        navigate('/home')
      } catch (err) {
        console.error('Error al procesar el pago:', err)
        setProcessingStatus('Error al procesar el pago. Por favor intente nuevamente.')
      }
    }
  }

  if (cartItems.length === 0) {
    return (
      <div className="checkout-empty">
        <div className="empty-message">
          <h2>Tu carrito está vacío</h2>
          <p>Agrega algunos libros antes de proceder al pago</p>
          <button onClick={() => navigate('/home')} className="back-button">
            <FaArrowLeft /> Volver a la tienda
          </button>
        </div>
      </div>
    )
  }

  const subtotal = getTotalPrice()
  const shipping = 5000 // Envío fijo
  const total = subtotal + shipping

  return (
    <div className="checkout-container">
      <div className="checkout-header">
        <button onClick={() => navigate('/home')} className="back-button">
          <FaArrowLeft /> Volver
        </button>
        <h1>Finalizar Compra</h1>
      </div>

      {(paymentError || processingStatus && !paymentLoading) && (
        <div className={`status-message ${paymentError ? 'error' : 'info'}`}>
          {paymentError || processingStatus}
        </div>
      )}

      <div className="checkout-content">
        <div className="checkout-main">
          <form onSubmit={handleSubmit} className="checkout-form">
            {/* Información de Envío */}
            <div className="form-section">
              <h2 className="section-title">Información de Envío</h2>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="fullName">Nombre completo *</label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Juan Pérez"
                    className={errors.fullName ? 'error' : ''}
                    disabled={paymentLoading}
                  />
                  {errors.fullName && <span className="error-message">{errors.fullName}</span>}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="email">Email *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="juan@ejemplo.com"
                    className={errors.email ? 'error' : ''}
                    disabled={paymentLoading}
                  />
                  {errors.email && <span className="error-message">{errors.email}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="phone">Teléfono *</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="300 123 4567"
                    className={errors.phone ? 'error' : ''}
                    disabled={paymentLoading}
                  />
                  {errors.phone && <span className="error-message">{errors.phone}</span>}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="address">Dirección *</label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Calle 123 #45-67"
                    className={errors.address ? 'error' : ''}
                    disabled={paymentLoading}
                  />
                  {errors.address && <span className="error-message">{errors.address}</span>}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="city">Ciudad *</label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="Bogotá"
                    className={errors.city ? 'error' : ''}
                    disabled={paymentLoading}
                  />
                  {errors.city && <span className="error-message">{errors.city}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="postalCode">Código Postal *</label>
                  <input
                    type="text"
                    id="postalCode"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    placeholder="110111"
                    className={errors.postalCode ? 'error' : ''}
                    disabled={paymentLoading}
                  />
                  {errors.postalCode && <span className="error-message">{errors.postalCode}</span>}
                </div>
              </div>
            </div>

            {/* Información de Pago */}
            <div className="form-section">
              <h2 className="section-title">
                <FaCreditCard /> Información de Pago
              </h2>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="cardNumber">Número de Tarjeta *</label>
                  <input
                    type="text"
                    id="cardNumber"
                    name="cardNumber"
                    value={formData.cardNumber}
                    onChange={handleInputChange}
                    placeholder="1234 5678 9012 3456"
                    maxLength="19"
                    className={errors.cardNumber ? 'error' : ''}
                    disabled={paymentLoading}
                  />
                  {errors.cardNumber && <span className="error-message">{errors.cardNumber}</span>}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="cardName">Nombre en la Tarjeta *</label>
                  <input
                    type="text"
                    id="cardName"
                    name="cardName"
                    value={formData.cardName}
                    onChange={handleInputChange}
                    placeholder="JUAN PEREZ"
                    className={errors.cardName ? 'error' : ''}
                    disabled={paymentLoading}
                  />
                  {errors.cardName && <span className="error-message">{errors.cardName}</span>}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="expiryDate">Fecha de Expiración *</label>
                  <input
                    type="text"
                    id="expiryDate"
                    name="expiryDate"
                    value={formData.expiryDate}
                    onChange={handleInputChange}
                    placeholder="MM/AA"
                    maxLength="5"
                    className={errors.expiryDate ? 'error' : ''}
                    disabled={paymentLoading}
                  />
                  {errors.expiryDate && <span className="error-message">{errors.expiryDate}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="cvv">CVV *</label>
                  <input
                    type="text"
                    id="cvv"
                    name="cvv"
                    value={formData.cvv}
                    onChange={handleInputChange}
                    placeholder="123"
                    maxLength="4"
                    className={errors.cvv ? 'error' : ''}
                    disabled={paymentLoading}
                  />
                  {errors.cvv && <span className="error-message">{errors.cvv}</span>}
                </div>
              </div>

              <div className="secure-payment">
                <FaLock /> Pago seguro y encriptado
              </div>
            </div>

            <button
              type="submit"
              className="submit-button"
              disabled={paymentLoading}
            >
              {paymentLoading ? (
                <>
                  <FaSpinner className="spinner" /> Procesando...
                </>
              ) : (
                `Confirmar Compra - $${total.toLocaleString('es-CO')}`
              )}
            </button>
          </form>
        </div>

        {/* Resumen del Pedido */}
        <div className="checkout-summary">
          <h2 className="summary-title">Resumen del Pedido</h2>

          <div className="summary-items">
            {cartItems.map(item => (
              <div key={item.id} className="summary-item">
                <img src={item.image} alt={item.title} className="summary-item-image" />
                <div className="summary-item-info">
                  <h3>{item.title}</h3>
                  <p>{item.author}</p>
                  <p className="summary-item-quantity">Cantidad: {item.quantity}</p>
                </div>
                <div className="summary-item-price">
                  ${(item.price * item.quantity).toLocaleString('es-CO')}
                </div>
              </div>
            ))}
          </div>

          <div className="summary-totals">
            <div className="summary-row">
              <span>Subtotal:</span>
              <span>${subtotal.toLocaleString('es-CO')}</span>
            </div>
            <div className="summary-row">
              <span>Envío:</span>
              <span>${shipping.toLocaleString('es-CO')}</span>
            </div>
            <div className="summary-row summary-total">
              <span>Total:</span>
              <span>${total.toLocaleString('es-CO')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Checkout

