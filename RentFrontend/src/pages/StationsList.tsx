import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getStations } from '../api/stations'
import type { StationDto } from '../api/stations'
import { Card } from '../components/Card'
import { Loader } from '../components/Loader'

function StationsList() {
  const [items, setItems] = useState<StationDto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    getStations()
      .then(setItems)
      .catch((err) => {
        console.error(err)
        setError('Не вдалося завантажити станції')
      })
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="page">
      <Card title="Станції">
        {loading ? (
          <Loader />
        ) : error ? (
          <div className="alert alert-danger">{error}</div>
        ) : (
          <div className="list">
            {items.map((station) => (
              <div key={station.id} className="list-item">
                <div>
                  <div className="item-title">
                    <Link to={`/stations/${station.id}`}>{station.name}</Link>
                  </div>
                  <p className="muted">{station.address}</p>
                </div>
                <div className="item-actions">
                  <div className="badge badge-success">
                    Доступно: {station.availableBikesCount ?? 0}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}

export default StationsList
