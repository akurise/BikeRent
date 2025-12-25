import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getBike } from '../api/bikes'
import type { BikeDto } from '../api/bikes'
import { startRental } from '../api/rentals'
import { useAuth } from '../context/AuthContext.tsx'
import { Card } from '../components/Card'
import { Button } from '../components/Button'
import { StatusBadge } from '../components/StatusBadge'
import { Loader } from '../components/Loader'
import { formatCurrency } from '../utils/format.ts'

function BikeDetails() {
  const { id } = useParams()
  const [bike, setBike] = useState<BikeDto | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [renting, setRenting] = useState(false)
  const { user } = useAuth()

  useEffect(() => {
    if (!id) return
    setLoading(true)
    getBike(Number(id))
      .then(setBike)
      .catch((err) => {
        console.error(err)
        setError('Не вдалося завантажити велосипед')
      })
      .finally(() => setLoading(false))
  }, [id])

  const handleRent = async () => {
    if (!bike) return
    setRenting(true)
    try {
      await startRental({ bikeId: bike.id })
      alert('Оренду розпочато')
    } catch (err) {
      alert('Помилка при старті оренди')
      console.error(err)
    } finally {
      setRenting(false)
    }
  }

  if (loading) return <Loader />
  if (error) return <div className="alert alert-danger">{error}</div>
  if (!bike) return null

  return (
    <div className="page">
      <Card title={bike.model} subtitle={`Тип: ${bike.type}`}>
        <div className="info-list">
          <div>
            <span className="label">Статус</span>
            <StatusBadge value={bike.status} />
          </div>
          <div>
            <span className="label">Станція</span>
            <span>{bike.stationName ?? bike.stationId}</span>
          </div>
          <div>
            <span className="label">Ціна за годину</span>
            <span>{formatCurrency(bike.pricePerHour)}</span>
          </div>
        </div>
        {user && bike.status.toLowerCase().includes('available') && (
          <Button onClick={handleRent} disabled={renting}>
            {renting ? 'Запуск...' : 'Орендувати'}
          </Button>
        )}
      </Card>
    </div>
  )
}

export default BikeDetails
