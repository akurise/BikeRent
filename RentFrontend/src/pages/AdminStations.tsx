import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { createStation, deleteStation, getStations, updateStation } from '../api/stations'
import type { StationDto } from '../api/stations'
import { Card } from '../components/Card'
import { Button } from '../components/Button'
import { FormField } from '../components/FormField'
import { Loader } from '../components/Loader'

interface StationForm {
  name: string
  address: string
  latitude: number
  longitude: number
}

const initialForm: StationForm = {
  name: '',
  address: '',
  latitude: 0,
  longitude: 0,
}

function AdminStations() {
  const [items, setItems] = useState<StationDto[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState<StationForm>(initialForm)
  const [editingId, setEditingId] = useState<number | null>(null)

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await getStations()
      setItems(data)
    } catch (err) {
      console.error(err)
      setError('Не вдалося завантажити станції')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      if (editingId) {
        await updateStation(editingId, form)
      } else {
        await createStation(form)
      }
      setForm(initialForm)
      setEditingId(null)
      load()
    } catch (err) {
      alert('Помилка під час збереження станції')
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (station: StationDto) => {
    setEditingId(station.id)
    setForm({
      name: station.name,
      address: station.address,
      latitude: station.latitude,
      longitude: station.longitude,
    })
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Видалити станцію?')) return
    await deleteStation(id)
    load()
  }

  return (
    <div className="page">
      <Card title="Адміністрування станцій" subtitle="Створення та редагування">
        <form className="form grid-2" onSubmit={handleSubmit}>
          <FormField
            label="Назва"
            value={form.name}
            onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
            required
          />
          <FormField
            label="Адреса"
            value={form.address}
            onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))}
            required
          />
          <FormField
            label="Широта"
            type="number"
            value={form.latitude}
            onChange={(e) => setForm((p) => ({ ...p, latitude: Number(e.target.value) }))}
            required
          />
          <FormField
            label="Довгота"
            type="number"
            value={form.longitude}
            onChange={(e) => setForm((p) => ({ ...p, longitude: Number(e.target.value) }))}
            required
          />
          <Button type="submit" disabled={saving}>
            {saving ? 'Зберігаємо...' : editingId ? 'Оновити' : 'Створити'}
          </Button>
          {editingId && (
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setEditingId(null)
                setForm(initialForm)
              }}
            >
              Скасувати
            </Button>
          )}
        </form>

        {loading ? (
          <Loader />
        ) : error ? (
          <div className="alert alert-danger">{error}</div>
        ) : (
          <div className="list">
            {items.map((station) => (
              <div key={station.id} className="list-item">
                <div>
                  <div className="item-title">{station.name}</div>
                  <p className="muted">{station.address}</p>
                </div>
                <div className="item-actions">
                  <div className="badge badge-success">{station.availableBikesCount ?? 0} велосипедів</div>
                  <Button variant="ghost" onClick={() => handleEdit(station)}>
                    Редагувати
                  </Button>
                  <Button variant="danger" onClick={() => handleDelete(station.id)}>
                    Видалити
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}

export default AdminStations
