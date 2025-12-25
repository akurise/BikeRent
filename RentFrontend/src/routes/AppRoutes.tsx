import { Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from '../components/Layout'
import { ProtectedRoute } from './ProtectedRoute'
import Home from '../pages/Home.tsx'
import Login from '../pages/Login.tsx'
import Register from '../pages/Register.tsx'
import Profile from '../pages/Profile.tsx'
import BikesList from '../pages/BikesList.tsx'
import BikeDetails from '../pages/BikeDetails.tsx'
import StationsList from '../pages/StationsList.tsx'
import StationDetails from '../pages/StationDetails.tsx'
import RentalsActive from '../pages/RentalsActive.tsx'
import RentalsHistory from '../pages/RentalsHistory.tsx'
import AdminBikes from '../pages/AdminBikes.tsx'
import AdminStations from '../pages/AdminStations.tsx'

export function AppRoutes() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route path="/bikes" element={<BikesList />} />
        <Route path="/bikes/:id" element={<BikeDetails />} />
        <Route path="/stations" element={<StationsList />} />
        <Route path="/stations/:id" element={<StationDetails />} />
        <Route
          path="/rentals/active"
          element={
            <ProtectedRoute>
              <RentalsActive />
            </ProtectedRoute>
          }
        />
        <Route
          path="/rentals/history"
          element={
            <ProtectedRoute>
              <RentalsHistory />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/bikes"
          element={
            <ProtectedRoute roles={['Admin']}>
              <AdminBikes />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/stations"
          element={
            <ProtectedRoute roles={['Admin']}>
              <AdminStations />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  )}
