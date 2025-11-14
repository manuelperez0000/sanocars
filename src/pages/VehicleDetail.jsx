import React, { useMemo, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import vehicles from '../data/vehicles'
import PageLayout from '../components/PageLayout'

function formatCurrency(n){ return `$${n.toLocaleString()}` }

export default function VehicleDetail(){
  const { id } = useParams()
  const navigate = useNavigate()
  const vehicle = useMemo(()=> vehicles.find(v=> String(v.id) === String(id)), [id])
  const [activeIndex, setActiveIndex] = useState(0)

  if(!vehicle) return (
    <PageLayout>
      <div className="container py-5">
        <div className="text-center">
          <h3 className="momo mb-3">Vehículo no encontrado</h3>
          <p className="text-muted mb-4">El vehículo que buscas no existe o fue removido.</p>
          <button className="btn btn-primary btn-lg" onClick={()=>navigate(-1)}>Volver al catálogo</button>
        </div>
      </div>
    </PageLayout>
  )

  // Installment calculation: show per-month for 24 months, both without interest and with sample interest (6% anual)
  const months = 24
  const price = vehicle.price
  const monthlyNoInterest = (price / months)
  const annualRate = 0.06
  const r = annualRate / 12
  const monthlyWithInterest = (price * r) / (1 - Math.pow(1 + r, -months))

  return (
    <PageLayout>
      <div className="container-fluid py-4">
        <div className="row justify-content-center">
          <div className="col-12 col-xl-10">
            {/* Breadcrumb */}
            <nav aria-label="breadcrumb" className="mb-4">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link to="/vehiculos" className="text-decoration-none">Vehículos</Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">{vehicle.name}</li>
              </ol>
            </nav>

            <div className="row g-3">
              {/* Image Gallery */}
              <div className="col-lg-8">
                <div className="card border-0 shadow-lg">
                  <div className="card-body p-0">
                    <div className="position-relative">
                      <img
                        src={vehicle.images[activeIndex]}
                        alt={vehicle.name}
                        className="img-fluid w-100 rounded-top"
                        style={{ maxHeight: '500px', objectFit: 'cover' }}
                      />
                      <div className="position-absolute top-0 end-0 m-3">
                        <span className="badge fs-6 px-3 py-2 bg-dark text-light">
                          {vehicle.condition}
                        </span>
                      </div>
                    </div>

                    {/* Thumbnails */}
                    <div className="p-3">
                      <div className="d-flex gap-3 overflow-auto">
                        {vehicle.images.map((src, i)=> (
                          <button
                            key={i}
                            className={`btn p-0 border-0 rounded thumb-btn ${i===activeIndex? 'active':''}`}
                            onClick={()=>setActiveIndex(i)}
                            style={{ flexShrink: 0 }}
                          >
                            <img
                              src={src}
                              alt={`thumb-${i}`}
                              className="rounded shadow-sm"
                              style={{width: '120px', height: '80px', objectFit: 'cover'}}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Vehicle Details */}
              <div className="col-lg-4">
                <div className="card border-0 shadow-lg h-100">
                  <div className="card-body p-4">
                    {/* Header */}
                    <div className="mb-4">
                      <h1 className="momo h2 mb-2">{vehicle.name}</h1>
                      <p className="text-muted mb-2">{vehicle.brand} • {vehicle.model} • {vehicle.year}</p>
                    </div>

                    {/* Price Section */}
                    <div className="mb-3">
                        <span className='text-muted'>  Precio </span>
                        <h2 className="momo mb-0 price">{formatCurrency(price)}</h2>
                    </div>

                    <hr />

                    {/* Financing Options */}
                    <div className="mb-4">
                      <h5 className="mb-3">Opciones de pago</h5>

                      <div className="border rounded p-3 mb-3">
                        <div className="d-flex justify-content-between align-items-center">
                          <div>
                            <small className="text-muted d-block">Sin interés</small>
                            <strong className="fs-5">{formatCurrency(Math.round(monthlyNoInterest))}</strong>
                            <small className="text-muted"> /mes x {months} meses</small>
                          </div>
                        </div>
                      </div>

                      <div className="border rounded p-3">
                        <div className="d-flex justify-content-between align-items-center">
                          <div>
                            <small className="text-muted d-block">Con interés (6% anual)</small>
                            <strong className="fs-5">{formatCurrency(Math.round(monthlyWithInterest))}</strong>
                            <small className="text-muted"> /mes x {months} meses</small>
                          </div>
                        </div>
                        <small className="text-muted d-block mt-2">*Tasa de ejemplo. Puede variar según condiciones.</small>
                      </div>
                    </div>

                    {/* Specifications */}
                    <div className="mb-4">
                      <h5 className="mb-3">Especificaciones</h5>
                      <div className="row g-3">
                        <div className="col-6">
                          <div className="p-2 border rounded text-center">
                            <small className="text-muted d-block">Motor</small>
                            <strong>{vehicle.engine}L</strong>
                          </div>
                        </div>
                        <div className="col-6">
                          <div className="p-2 border rounded text-center">
                            <small className="text-muted d-block">Kilometraje</small>
                            <strong>{vehicle.km.toLocaleString()} km</strong>
                          </div>
                        </div>
                        <div className="col-6">
                          <div className="p-2 border rounded text-center">
                            <small className="text-muted d-block">Año</small>
                            <strong>{vehicle.year}</strong>
                          </div>
                        </div>
                        <div className="col-6">
                          <div className="p-2 border rounded text-center">
                            <small className="text-muted d-block">Estado</small>
                            <strong>{vehicle.engineState}</strong>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Features */}
                    {/* <div className="mb-4">
                      <h5 className="mb-3">Características</h5>
                      <div className="d-flex flex-wrap gap-2">
                        {vehicle.features.map((f, i)=> (
                          <span key={i} className="badge bg-primary bg-gradient px-3 py-2">{f}</span>
                        ))}
                      </div>
                    </div> */}

                    {/* Action Buttons */}
                    <div className="d-grid gap-2">
                      <button className="btn btn-warning btn-lg">
                        <i className="fas fa-calculator me-2"></i>
                        Solicitar financiamiento
                      </button>
                      <button className="btn btn-outline-primary btn-lg">
                        <i className="fas fa-phone me-2"></i>
                        Contactar vendedor
                      </button>
                     
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
