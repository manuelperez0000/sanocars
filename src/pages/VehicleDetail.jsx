import React, { useMemo, useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import vehicles from '../data/vehicles'
import PageLayout from '../components/PageLayout'
import { FaClock, FaAlignLeft, FaChevronLeft, FaChevronRight, FaTimes, FaPhone, FaCalculator } from 'react-icons/fa'

function formatCurrency(n) { return `$${n.toLocaleString()}` }

export default function VehicleDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const vehicle = useMemo(() => vehicles.find(v => String(v.id) === String(id)), [id])
  const [activeIndex, setActiveIndex] = useState(0)
  const [modalOpen, setModalOpen] = useState(false)
  const [modalIndex, setModalIndex] = useState(0)

  useEffect(() => {
    if (!modalOpen) return
    function onKey(e) {
      if (e.key === 'Escape') setModalOpen(false)
      if (e.key === 'ArrowLeft') setModalIndex(i => (i - 1 + vehicle.images.length) % vehicle.images.length)
      if (e.key === 'ArrowRight') setModalIndex(i => (i + 1) % vehicle.images.length)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [modalOpen, modalIndex, vehicle.images.length])

  function openModal(index) {
    setModalIndex(index)
    setActiveIndex(index)
    setModalOpen(true)
  }

  function closeModal() {
    setModalOpen(false)
  }

  function prevImage() {
    setModalIndex((i) => (i - 1 + vehicle.images.length) % vehicle.images.length)
  }

  function nextImage() {
    setModalIndex((i) => (i + 1) % vehicle.images.length)
  }

  if (!vehicle) return (
    <PageLayout>
      <div className="container py-5">
        <div className="text-center">
          <h3 className="momo mb-3">Vehículo no encontrado</h3>
          <p className="text-muted mb-4">El vehículo que buscas no existe o fue removido.</p>
          <button className="btn btn-primary btn-lg" onClick={() => navigate(-1)}>Volver al catálogo</button>
        </div>
      </div>
    </PageLayout>
  )

  // Installment calculation: show per-month for 24 months, both without interest and with sample interest (6% anual)

  const price = vehicle.price

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
              <div className="col-lg-7">
                <div className="card border-0 shadow-lg">
                  <div className="card-body p-0">
                    <div className="position-relative">
                      <img
                        src={vehicle.images[activeIndex]}
                        alt={vehicle.name}
                        className="img-fluid w-100 rounded-top detail-main-img"
                        style={{ maxHeight: '500px', objectFit: 'cover', cursor: 'pointer' }}
                        onClick={() => openModal(activeIndex)}
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
                        {vehicle.images.map((src, i) => (
                          <button
                            key={i}
                            className={`btn p-0 border-0 rounded thumb-btn ${i === activeIndex ? 'active' : ''}`}
                            onClick={() => openModal(i)}
                            style={{ flexShrink: 0 }}
                          >
                            <img
                              src={src}
                              alt={`thumb-${i}`}
                              className="rounded shadow-sm"
                              style={{ width: '120px', height: '80px', objectFit: 'cover', cursor: 'pointer' }}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                </div>
                {/* Vehicle History Section */}
                <div className="row justify-content-center mt-3">
                  <div className="col-12 d-none d-lg-block">
                    <div className="card border-0 shadow-lg">
                      <div className="card-body p-4">
                        <h3 className="momo">Información Adicional del Vehículo</h3>

                        <div className="mb-3">
                          <label htmlFor="additionalDetails" className="form-label">
                            <small className='text-muted'>INFORMACIÓN ADICIONAL</small>
                          </label>
                          <p>
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Suscipit, nulla sunt, eum voluptates numquam delectus, dolorem impedit rem porro temporibus placeat neque? Consectetur autem voluptatum ipsum laboriosam veniam deleniti nostrum.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Vehicle Details */}
              <div className="col-lg-5">
                <div className="card border-0 shadow-lg h-100">
                  <div className="card-body p-4">
                    {/* Header */}

                    <h1 className="momo h2">{vehicle.name}</h1>
                    <p className="text-muted mb-2">{vehicle.brand} • {vehicle.model} • {vehicle.year}</p>

                    {/* Price Section */}
                    <div className=''>
                      <span className='text-muted'>  Precio </span>
                      <h1 className="momo h1 price">{formatCurrency(price)}</h1>
                    </div>

                    <hr />

                    {/* INFORMACIÓN DEL VEHÍCULO */}
                    <div className="mb-4  ">
                      <h5 className="mb-3">INFORMACIÓN DEL VEHÍCULO</h5>
                      <div className="row g-3">
                        <div className="col-6">
                          <div className="p-2 border rounded">
                            <small className="text-muted d-block">AÑO</small>
                            <strong>{vehicle.year}</strong>
                          </div>
                        </div>
                        <div className="col-6">
                          <div className="p-2 border rounded">
                            <small className="text-muted d-block">MODELO</small>
                            <strong>{vehicle.model}</strong>
                          </div>
                        </div>
                        <div className="col-6">
                          <div className="p-2 border rounded">
                            <small className="text-muted d-block">COLOR</small>
                            <strong>{vehicle.color}</strong>
                          </div>
                        </div>
                        <div className="col-6">
                          <div className="p-2 border rounded">
                            <small className="text-muted d-block">TIPO DE TRANSMISIÓN</small>
                            <strong>{vehicle.transmission}</strong>
                          </div>
                        </div>
                        <div className="col-6">
                          <div className="p-2 border rounded">
                            <small className="text-muted d-block">TAMAÑO DE MOTOR</small>
                            <strong>{vehicle.engine}L</strong>
                          </div>
                        </div>
                        <div className="col-6">
                          <div className="p-2 border rounded">
                            <small className="text-muted d-block">CANTIDAD DE PASAJEROS</small>
                            <strong>{vehicle.passengers}</strong>
                          </div>
                        </div>
                        <div className="col-6">
                          <div className="p-2 border rounded">
                            <small className="text-muted d-block">AIRE ACONDICIONADO</small>
                            <strong>{vehicle.ac ? 'Si' : 'No'}</strong>
                          </div>
                        </div>
                        <div className="col-6">
                          <div className="p-2 border rounded">
                            <small className="text-muted d-block">GARANTIA</small>
                            <strong>12 Meses</strong>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* HISTORIAL DE REPARACIONES */}
                    <div className="mb-4">
                      <h5 className="mb-3">HISTORIAL DE REPARACIONES</h5>
                      <div className="mb-3 flex-between p-2 border rounded">
                        <small className='text-muted d-block'>CAMBIO DE ACEITE Y FILTRO:</small>
                        <strong>26/12/2025</strong>
                      </div>
                      <div className="mb-3 p-2 border rounded">
                        <small className='text-muted d-block'>MANTENIMIENTO GENERAL:</small>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                      </div>
                      <div className="mb-3 p-2 border rounded">
                        <small className='text-muted d-block'>INSPECCIÓN VEHICULAR:</small>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
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
                      <a
                        className="btn btn-outline-dark btn-lg d-flex align-items-center justify-content-center"
                        href={`https://wa.me/8108091171993?text=${encodeURIComponent(`Hola, estoy interesado en el vehículo ${vehicle.name} (ID: ${vehicle.id}). ¿Podrían darme más información?`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <FaPhone className="me-2" />
                        Contactar vendedor
                      </a>

                      <Link to="/financiamiento" className="btn btn-primary btn-lg d-flex align-items-center justify-content-center">
                        <FaCalculator className="me-2" />
                        Solicitar financiamiento
                      </Link>

                    </div>
                  </div>
                </div>
              </div>

              {/* Vehicle History Section */}
              <div className="row justify-content-center mt-3">
                <div className="col-12 d-block d-lg-none">
                  <div className="card border-0 shadow-lg">
                    <div className="card-body p-4">
                      <h3 className="momo">Información Adicional del Vehículo</h3>

                      <div className="mb-3">
                        <label htmlFor="additionalDetails" className="form-label">
                          <small className='text-muted'>INFORMACIÓN ADICIONAL</small>
                        </label>
                        <p>
                          Lorem ipsum dolor sit amet consectetur adipisicing elit. Suscipit, nulla sunt, eum voluptates numquam delectus, dolorem impedit rem porro temporibus placeat neque? Consectetur autem voluptatum ipsum laboriosam veniam deleniti nostrum.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal for full-screen gallery */}
        {modalOpen && (
          <div className="gallery-modal d-flex align-items-center justify-content-center" onClick={closeModal}>
            <button className="gallery-close btn btn-link text-light" onClick={(e) => { e.stopPropagation(); closeModal(); }} aria-label="Cerrar">
              <FaTimes size={28} />
            </button>

            <button className="gallery-nav left btn btn-link text-light" onClick={(e) => { e.stopPropagation(); prevImage(); }} aria-label="Anterior">
              <FaChevronLeft size={36} />
            </button>

            <img
              src={vehicle.images[modalIndex]}
              alt={`full-${modalIndex}`}
              className="img-fluid"
              onClick={(e) => e.stopPropagation()}
              style={{ maxWidth: '90%', maxHeight: '90%', objectFit: 'contain' }}
            />

            <button className="gallery-nav right btn btn-link text-light" onClick={(e) => { e.stopPropagation(); nextImage(); }} aria-label="Siguiente">
              <FaChevronRight size={36} />
            </button>
          </div>
        )}


      </div>
    </PageLayout>
  )
}
