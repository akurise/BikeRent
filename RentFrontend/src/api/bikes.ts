import { api } from './axios'

export interface BikeDto {
  id: number
  model: string
  type: string
  pricePerHour: number
  status: string
  stationId: number
  stationName?: string
}

export interface CreateBikeDto {
  model: string
  type: string
  pricePerHour: number
  stationId: number
}

export interface UpdateBikeDto extends Partial<CreateBikeDto> {
  status?: string
}

export interface BikeFilters {
  stationId?: number
  type?: string
}

export async function getBikes(filters: BikeFilters = {}) {
  const res = await api.get<BikeDto[]>('/Bikes', { params: filters })
  return res.data
}

export async function getAvailableBikes() {
  const res = await api.get<BikeDto[]>('/Bikes/available')
  return res.data
}

export async function getBike(id: number) {
  const res = await api.get<BikeDto>(`/Bikes/${id}`)
  return res.data
}

export async function createBike(payload: CreateBikeDto) {
  const res = await api.post<BikeDto>('/Bikes', payload)
  return res.data
}

export async function updateBike(id: number, payload: UpdateBikeDto) {
  const res = await api.put<BikeDto>(`/Bikes/${id}`, payload)
  return res.data
}

export async function deleteBike(id: number) {
  await api.delete(`/Bikes/${id}`)
}
