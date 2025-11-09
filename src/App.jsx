import React from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import Home from './pages/home'
import VehicleDetail from './pages/VehicleDetail'

const Financiamiento = () => (
  <div className="container py-5">
    <h2>Financiamiento</h2>
    <p>Información sobre opciones de financiamiento para tu vehículo.</p>
  </div>
)

const Contacto = () => (
  <div className="container py-5">
    <h2>Contacto</h2>
    <p>Escríbenos o visítanos para más información.</p>
  </div>
)

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
  <Route path="/financiamiento" element={<Financiamiento />} />
  <Route path="/contacto" element={<Contacto />} />
  <Route path="/vehiculo/:id" element={<VehicleDetail />} />
      </Routes>
    </BrowserRouter>
  )
}
