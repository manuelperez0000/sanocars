import React, { useMemo, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import vehicles from '../data/vehicles'

function formatCurrency(n){ return `$${n.toLocaleString()}` }

export default function VehicleDetail(){
  const { id } = useParams()
  const navigate = useNavigate()
  const vehicle = useMemo(()=> vehicles.find(v=> String(v.id) === String(id)), [id])
  const [activeIndex, setActiveIndex] = useState(0)

  if(!vehicle) return (
    <div className="container py-5">
      <h3>Vehículo no encontrado</h3>
      <p>El vehículo que buscas no existe o fue removido.</p>
      <button className="btn btn-secondary" onClick={()=>navigate(-1)}>Volver</button>
    </div>
  )

  // Installment calculation: show per-month for 24 months, both without interest and with sample interest (6% anual)
  const months = 24
  const price = vehicle.price
  const monthlyNoInterest = (price / months)
  const annualRate = 0.06
  const r = annualRate / 12
  const monthlyWithInterest = (price * r) / (1 - Math.pow(1 + r, -months))

  return (
    <div className="container my-5">
      <div className="mb-4">
        <Link to="/" className="text-muted">← Volver</Link>
      </div>

      <div className="row g-4">
        <div className="col-lg-7">
          <div className="card">
            <div className="p-3 text-center bg-dark">
              <img src={vehicle.images[activeIndex]} alt={vehicle.name} className="img-fluid detail-main-img" />
            </div>
            <div className="card-body">
              <div className="d-flex gap-2">
                {vehicle.images.map((src, i)=> (
                  <button key={i} className={`btn p-0 border-0 thumb-btn ${i===activeIndex? 'active':''}`} onClick={()=>setActiveIndex(i)}>
                    <img src={src} alt={`thumb-${i}`} className={`img-thumbnail ${i===activeIndex? 'thumb-active':''}`} style={{width:100, height:70, objectFit:'cover'}} />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-5">
          <div className="card p-4 shadow-sm">
            <h2 className="mb-1">{vehicle.name} <small className="text-muted">({vehicle.year})</small></h2>
            <p className="text-muted mb-3">{vehicle.brand} • {vehicle.model} • {vehicle.condition}</p>

            <div className="mb-3">
              <h3 className="text-danger">{formatCurrency(price)}</h3>
              <div className="small text-muted">O en cuotas</div>
            </div>

            <div className="mb-3">
              <h6>Pago mensual (sin interés)</h6>
              <div className="fs-5">{formatCurrency(Math.round(monthlyNoInterest))} / mes x {months} meses</div>
            </div>

            <div className="mb-3">
              <h6>Pago mensual (ej. 6% anual)</h6>
              <div className="fs-5">{formatCurrency(Math.round(monthlyWithInterest))} / mes x {months} meses</div>
              <small className="text-muted d-block">Tasa anual de ejemplo: 6% — este valor puede variar según el financiamiento final.</small>
            </div>

            <hr />

            <div className="mb-3">
              <h6 className="mb-2">Detalles del vehículo</h6>
              <ul className="list-unstyled small text-muted">
                <li><strong>Año:</strong> {vehicle.year}</li>
                <li><strong>Motor:</strong> {vehicle.engine} L</li>
                <li><strong>Estado motor:</strong> {vehicle.engineState}</li>
                <li><strong>Kilometraje:</strong> {vehicle.km.toLocaleString()} km</li>
                <li><strong>Condición:</strong> {vehicle.condition}</li>
              </ul>
            </div>

            <div className="mb-3">
              <h6>Características</h6>
              <div className="d-flex flex-wrap gap-2 mt-2">
                {vehicle.features.map((f, i)=> (
                  <span key={i} className="badge bg-primary bg-gradient">{f}</span>
                ))}
              </div>
            </div>

            <div className="d-grid mt-4">
              <button className="btn btn-warning btn-lg">Solicitar financiamiento</button>
              <button className="btn btn-outline-secondary btn-lg mt-2">Contactar vendedor</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
