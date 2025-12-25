import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getStation } from '../api/stations'
import { getBikes } from '../api/bikes'
import { startRental } from '../api/rentals'
import { useAuth } from '../context/AuthContext.tsx'
import type { StationDto } from '../api/stations'
import type { BikeDto } from '../api/bikes'
import { Card } from '../components/Card'
import { Loader } from '../components/Loader'
import { Button } from '../components/Button'
import { StatusBadge } from '../components/StatusBadge'
import { formatCurrency } from '../utils/format.ts'

function StationDetails() {
  const { id } = useParams()
  const [station, setStation] = useState<StationDto | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [availableBikes, setAvailableBikes] = useState<BikeDto[]>([])
  const [rentingId, setRentingId] = useState<number | null>(null)
  const { user } = useAuth()

  useEffect(() => {
    if (!id) return
    const stationId = Number(id)
    setLoading(true)

    Promise.all([getStation(stationId), getBikes({ stationId })])
      .then(([st, bikes]) => {
        setStation(st)
        const available = bikes.filter((b) => b.status.toLowerCase().includes('available'))
        setAvailableBikes(available)
      })
      .catch((err) => {
        console.error(err)
        setError('Не вдалося завантажити станцію')
      })
      .finally(() => setLoading(false))
  }, [id])

  const handleRent = async (bikeId: number) => {
    setRentingId(bikeId)
    try {
      await startRental({ bikeId })
      alert('Оренду розпочато')
      // refresh list
      if (id) {
        const bikes = await getBikes({ stationId: Number(id) })
        const available = bikes.filter((b) => b.status.toLowerCase().includes('available'))
        setAvailableBikes(available)
      }
    } catch (err) {
      alert('Не вдалося розпочати оренду')
      console.error(err)
    } finally {
      setRentingId(null)
    }
  }

  if (loading) return <Loader />
  if (error) return <div className="alert alert-danger">{error}</div>
  if (!station) return null

  return (
    <div className="page">
      <Card title={station.name} subtitle={station.address}>
        <div className="info-list">
          <div>
            <span className="label">Координати</span>
            <span>
              {station.latitude}, {station.longitude}
            </span>
          </div>
          <div>
            <span className="label">Вільних велосипедів</span>
            <span>{station.availableBikesCount ?? 0}</span>
          </div>
        </div>

        <div className="list" style={{ marginTop: 16 }}>
          <div className="item-title">Доступні велосипеди</div>
          {availableBikes.length === 0 ? (
            <p className="muted">Немає доступних велосипедів на цій станції.</p>
          ) : (
            availableBikes.map((bike) => (
              <div key={bike.id} className="list-item">
                <div>
                  <div className="item-title">
                    {bike.model} <StatusBadge value={bike.status} />
                  </div>
                  <p className="muted">Тип: {bike.type}</p>
                </div>
                <div className="item-actions">
                  <div className="price">{formatCurrency(bike.pricePerHour)}/год</div>
                  {user && (
                    <Button
                      disabled={rentingId === bike.id}
                      onClick={() => handleRent(bike.id)}
                    >
                      {rentingId === bike.id ? 'Запуск...' : 'Орендувати'}
                    </Button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  )
}

export default StationDetails
