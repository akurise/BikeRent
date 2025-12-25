import { api } from './axios'

export interface RentalDto {
  id: number
  userId: number
  userEmail: string
  bikeId: number
  bikeModel: string
  bikeType: string
  startTime: string
  endTime?: string
  totalPrice: number
  status: string
  durationHours: number
}

export interface StartRentalDto {
  bikeId: number
}

export interface FinishRentalDto {
  rentalId: number
}

export async function startRental(payload: StartRentalDto) {
  const res = await api.post<RentalDto>('/Rentals/start', payload)
  return res.data
}

export async function finishRental(payload: FinishRentalDto) {
  const res = await api.post<RentalDto>('/Rentals/finish', payload)
  return res.data
}

export async function getActiveRental() {
  const res = await api.get<RentalDto | null>('/Rentals/active')
  return res.data
}

export async function getRentalHistory() {
  const res = await api.get<RentalDto[]>('/Rentals/history')
  return res.data
}

export async function getAllRentals() {
  const res = await api.get<RentalDto[]>('/Rentals')
  return res.data
}
