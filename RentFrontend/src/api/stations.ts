import { api } from './axios'

export interface StationDto {
  id: number
  name: string
  address: string
  latitude: number
  longitude: number
  availableBikesCount?: number
}

export interface CreateStationDto {
  name: string
  address: string
  latitude: number
  longitude: number
}

export interface UpdateStationDto extends Partial<CreateStationDto> {}

export async function getStations() {
  const res = await api.get<StationDto[]>('/Stations')
  return res.data
}

export async function getStation(id: number) {
  const res = await api.get<StationDto>(`/Stations/${id}`)
  return res.data
}

export async function createStation(payload: CreateStationDto) {
  const res = await api.post<StationDto>('/Stations', payload)
  return res.data
}

export async function updateStation(id: number, payload: UpdateStationDto) {
  const res = await api.put<StationDto>(`/Stations/${id}`, payload)
  return res.data
}

export async function deleteStation(id: number) {
  await api.delete(`/Stations/${id}`)
}
