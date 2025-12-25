import { useEffect, useState } from 'react'
import { getRentalHistory } from '../api/rentals'
import type { RentalDto } from '../api/rentals'
import { Card } from '../components/Card'
import { Loader } from '../components/Loader'
import { formatCurrency, formatDateTime, formatDurationHours } from '../utils/format.ts'

function RentalsHistory() {
  const [items, setItems] = useState<RentalDto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    getRentalHistory()
      .then(setItems)
      .catch((err) => {
        console.error(err)
        setError('Не вдалося завантажити історію')
      })
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="page">
      <Card title="Історія оренд">
        {loading ? (
          <Loader />
        ) : error ? (
          <div className="alert alert-danger">{error}</div>
        ) : items.length === 0 ? (
          <p className="muted">Історія поки порожня.</p>
        ) : (
          <div className="list">
            {items.map((rental) => (
              <div key={rental.id} className="list-item">
                <div>
                  <div className="item-title">{rental.bikeModel}</div>
                  <p className="muted">{rental.bikeType}</p>
                  <p className="muted">Початок: {formatDateTime(rental.startTime)}</p>
                  {rental.endTime && <p className="muted">Кінець: {formatDateTime(rental.endTime)}</p>}
                </div>
                <div className="item-actions">
                  <div>{formatDurationHours(rental.durationHours)}</div>
                  <div className="price">{formatCurrency(rental.totalPrice)}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}

export default RentalsHistory
