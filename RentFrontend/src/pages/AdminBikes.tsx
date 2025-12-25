import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { createBike, deleteBike, getBikes, updateBike } from '../api/bikes'
import type { BikeDto } from '../api/bikes'
import { Card } from '../components/Card'
import { Button } from '../components/Button'
import { FormField } from '../components/FormField'
import { Loader } from '../components/Loader'
import { StatusBadge } from '../components/StatusBadge'
import { formatCurrency } from '../utils/format.ts'

interface BikeForm {
  model: string
  type: string
  pricePerHour: number
  stationId: number
  status?: string
}

const initialForm: BikeForm = {
  model: '',
  type: '',
  pricePerHour: 0,
  stationId: 0,
  status: 'available',
}

function AdminBikes() {
  const [items, setItems] = useState<BikeDto[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState<BikeForm>(initialForm)
  const [editingId, setEditingId] = useState<number | null>(null)

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await getBikes()
      setItems(data)
    } catch (err) {
      console.error(err)
      setError('Не вдалося завантажити велосипеди')
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
        await updateBike(editingId, form)
      } else {
        await createBike(form)
      }
      setForm(initialForm)
      setEditingId(null)
      load()
    } catch (err) {
      alert('Помилка при збереженні велосипеда')
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (bike: BikeDto) => {
    setEditingId(bike.id)
    setForm({
      model: bike.model,
      type: bike.type,
      pricePerHour: bike.pricePerHour,
      stationId: bike.stationId,
      status: bike.status,
    })
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Видалити велосипед?')) return
    await deleteBike(id)
    load()
  }

  return (
    <div className="page">
      <Card title="Адміністрування велосипедів" subtitle="Створення та редагування">
        <form className="form grid-2" onSubmit={handleSubmit}>
          <FormField
            label="Модель"
            value={form.model}
            onChange={(e) => setForm((p) => ({ ...p, model: e.target.value }))}
            required
          />
          <FormField
            label="Тип"
            value={form.type}
            onChange={(e) => setForm((p) => ({ ...p, type: e.target.value }))}
            required
          />
          <FormField
            label="Ціна за годину"
            type="number"
            value={form.pricePerHour}
            onChange={(e) => setForm((p) => ({ ...p, pricePerHour: Number(e.target.value) }))}
            required
          />
          <FormField
            label="ID станції"
            type="number"
            value={form.stationId}
            onChange={(e) => setForm((p) => ({ ...p, stationId: Number(e.target.value) }))}
            required
          />
          <FormField
            label="Статус"
            value={form.status}
            onChange={(e) => setForm((p) => ({ ...p, status: e.target.value }))}
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
            {items.map((bike) => (
              <div key={bike.id} className="list-item">
                <div>
                  <div className="item-title">
                    {bike.model} <StatusBadge value={bike.status} />
                  </div>
                  <p className="muted">Тип: {bike.type}</p>
                  <p className="muted">Станція: {bike.stationId}</p>
                </div>
                <div className="item-actions">
                  <div className="price">{formatCurrency(bike.pricePerHour)}</div>
                  <Button variant="ghost" onClick={() => handleEdit(bike)}>
                    Редагувати
                  </Button>
                  <Button variant="danger" onClick={() => handleDelete(bike.id)}>
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

export default AdminBikes
