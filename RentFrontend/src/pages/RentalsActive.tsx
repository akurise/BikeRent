import { useEffect, useState } from 'react'
import { finishRental, getActiveRental } from '../api/rentals'
import type { RentalDto } from '../api/rentals'
import { Card } from '../components/Card'
import { Button } from '../components/Button'
import { Loader } from '../components/Loader'
import { formatCurrency, formatDateTime, formatDurationHours } from '../utils/format.ts'

function RentalsActive() {
  const [rental, setRental] = useState<RentalDto | null>(null)
  const [loading, setLoading] = useState(true)
  const [finishing, setFinishing] = useState(false)
  const [error, setError] = useState('')

  const load = () => {
    setLoading(true)
    getActiveRental()
      .then((res) => setRental(res))
      .catch((err) => {
        console.error(err)
        setError('Не вдалося завантажити активну оренду')
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
  }, [])

  const handleFinish = async () => {
    if (!rental) return
    setFinishing(true)
    try {
      await finishRental({ rentalId: rental.id })
      load()
    } catch (err) {
      alert('Не вдалося завершити оренду')
      console.error(err)
    } finally {
      setFinishing(false)
    }
  }

  return (
    <div className="page">
      <Card title="Поточна оренда">
        {loading ? (
          <Loader />
        ) : error ? (
          <div className="alert alert-danger">{error}</div>
        ) : rental ? (
          <div className="info-list">
            <div>
              <span className="label">Велосипед</span>
              <span>
                {rental.bikeModel} ({rental.bikeType})
              </span>
            </div>
            <div>
              <span className="label">Старт</span>
              <span>{formatDateTime(rental.startTime)}</span>
            </div>
            <div>
              <span className="label">Тривалість</span>
              <span>{formatDurationHours(rental.durationHours)}</span>
            </div>
            <div>
              <span className="label">Вартість</span>
              <span>{formatCurrency(rental.totalPrice)}</span>
            </div>
            <Button onClick={handleFinish} disabled={finishing}>
              {finishing ? 'Завершуємо...' : 'Завершити оренду'}
            </Button>
          </div>
        ) : (
          <p className="muted">Активних оренд немає.</p>
        )}
      </Card>
    </div>
  )
}

export default RentalsActive
