import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { getBikes } from '../api/bikes'
import type { BikeDto } from '../api/bikes'
import { startRental } from '../api/rentals'
import { useAuth } from '../context/AuthContext.tsx'
import { Card } from '../components/Card'
import { Button } from '../components/Button'
import { FormField } from '../components/FormField'
import { StatusBadge } from '../components/StatusBadge'
import { Loader } from '../components/Loader'
import { formatCurrency } from '../utils/format.ts'

function BikesList() {
  const { user } = useAuth()
  const [items, setItems] = useState<BikeDto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filters, setFilters] = useState<{ stationId?: number; type?: string }>({})
  const [rentingId, setRentingId] = useState<number | null>(null)

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await getBikes(filters)
      setItems(data)
    } catch (err) {
      setError('Не вдалося завантажити велосипеди')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleFilter = (e: FormEvent) => {
    e.preventDefault()
    load()
  }

  const handleRent = async (bikeId: number) => {
    setRentingId(bikeId)
    try {
      await startRental({ bikeId })
      await load()
      alert('Оренду розпочато')
    } catch (err) {
      alert('Не вдалося розпочати оренду')
      console.error(err)
    } finally {
      setRentingId(null)
    }
  }

  return (
    <div className="page">
      <Card title="Велосипеди" subtitle="Фільтрація за станцією та типом">
        <form className="filters" onSubmit={handleFilter}>
          <FormField
            label="ID станції"
            type="number"
            placeholder="Наприклад 1"
            value={filters.stationId ?? ''}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, stationId: e.target.value ? Number(e.target.value) : undefined }))
            }
          />
          <FormField
            label="Тип"
            placeholder="road, mtb..."
            value={filters.type ?? ''}
            onChange={(e) => setFilters((prev) => ({ ...prev, type: e.target.value || undefined }))}
          />
          <Button type="submit">Застосувати</Button>
        </form>

        {loading ? (
          <Loader />
        ) : error ? (
          <div className="alert alert-danger">{error}</div>
        ) : (
          <div className="list">
            {items.map((bike) => (
              <div key={bike.id} className="list-item">
                <div>
                  <div className="item-title">
                    <Link to={`/bikes/${bike.id}`}>{bike.model}</Link>
                    <StatusBadge value={bike.status} />
                  </div>
                  <p className="muted">Тип: {bike.type}</p>
                  <p className="muted">Станція: {bike.stationName ?? bike.stationId}</p>
                </div>
                <div className="item-actions">
                  <div className="price">{formatCurrency(bike.pricePerHour)}/год</div>
                  {user && bike.status.toLowerCase().includes('available') && (
                    <Button
                      disabled={rentingId === bike.id}
                      onClick={() => handleRent(bike.id)}
                    >
                      {rentingId === bike.id ? 'Запуск...' : 'Орендувати'}
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}

export default BikesList
