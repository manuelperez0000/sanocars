import React, { useState, useEffect } from 'react'
import request from '../utils/request'
import { apiurl, dateFormater } from '../utils/globals'
import { formatCurrency } from '../utils/globals'

const SegServicios = () => {
  const [servicios, setServicios] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedServicio, setSelectedServicio] = useState(null)
  const [updatingPayment, setUpdatingPayment] = useState(null) // Track which payment is being updated

  useEffect(() => {
    fetchServiciosCuotas()
  }, [])

  async function fetchServiciosCuotas() {
    setLoading(true)
    setError(null)
    try {
      const resp = await request.get(apiurl + '/servicios')
      if (resp?.data?.body) {
        // Filter only services with tipo_pago = 'cuotas'
        const serviciosCuotas = resp.data.body.filter(servicio => servicio.tipo_pago === 'cuotas')
        setServicios(serviciosCuotas)
      }
    } catch (err) {
      console.error('fetchServiciosCuotas error', err)
      setError(err?.response?.data?.message || 'Error cargando servicios')
    } finally {
      setLoading(false)
    }
  }

  function openModal(servicio) {
    setSelectedServicio(servicio)
    setModalOpen(true)
  }

  function closeModal() {
    setModalOpen(false)
    setSelectedServicio(null)
  }

  async function togglePagoStatus(servicioId, cuotaIndex) {
    const paymentKey = `${servicioId}-${cuotaIndex}`
    setUpdatingPayment(paymentKey)

    try {
      // Get current servicio data
      const servicio = servicios.find(s => s.id === servicioId)
      if (!servicio || !servicio.cronograma_pagos) return

      // Parse cronograma_pagos if it's a string
      let cronograma = servicio.cronograma_pagos
      if (typeof cronograma === 'string') {
        cronograma = JSON.parse(cronograma)
      }

      // Toggle the payment status
      cronograma[cuotaIndex].pagado = !cronograma[cuotaIndex].pagado

      // Update the servicio
      await request.put(apiurl + '/servicios/' + servicioId, {
        cronograma_pagos: JSON.stringify(cronograma)
      })

      // Refresh data and get updated servicio
      const resp = await request.get(apiurl + '/servicios')
      if (resp?.data?.body) {
        const serviciosCuotas = resp.data.body.filter(servicio => servicio.tipo_pago === 'cuotas')
        setServicios(serviciosCuotas)

        // Update selectedServicio with the refreshed data
        const updatedServicio = serviciosCuotas.find(s => s.id === servicioId)
        if (updatedServicio) {
          setSelectedServicio(updatedServicio)
        }
      }
    } catch (err) {
      console.error('togglePagoStatus error', err)
      setError('Error actualizando estado del pago')
    } finally {
      setUpdatingPayment(null)
    }
  }

  function getCuotasPendientes(servicio) {
    if (!servicio.cronograma_pagos) return 0

    let cronograma = servicio.cronograma_pagos
    if (typeof cronograma === 'string') {
      try {
        cronograma = JSON.parse(cronograma)
      } catch {
        return 0
      }
    }

    return cronograma.filter(cuota => !cuota.pagado).length
  }

  function getProximoPago(servicio) {
    if (!servicio.cronograma_pagos) return '-'

    let cronograma = servicio.cronograma_pagos
    if (typeof cronograma === 'string') {
      try {
        cronograma = JSON.parse(cronograma)
      } catch {
        return '-'
      }
    }

    /* const today = new Date() */
    /* today.setHours(0, 0, 0, 0) */

    // Find unpaid installments and sort by date
    const unpaidInstallments = cronograma
      .filter(cuota => !cuota.pagado)
      .sort((a, b) => new Date(a.fecha_pago) - new Date(b.fecha_pago))

    if (unpaidInstallments.length === 0) return '-'

    // Return the next upcoming payment
    const nextPayment = unpaidInstallments[0]
    return dateFormater(nextPayment.fecha_pago)

  }

  function getCuotasVencidas(servicio) {
    if (!servicio.cronograma_pagos) return 0

    let cronograma = servicio.cronograma_pagos
    if (typeof cronograma === 'string') {
      try {
        cronograma = JSON.parse(cronograma)
      } catch {
        return 0
      }
    }

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Count unpaid installments with due date before today
    return cronograma.filter(cuota => {
      const dueDate = new Date(cuota.fecha_pago)
      dueDate.setHours(0, 0, 0, 0)
      return !cuota.pagado && dueDate < today
    }).length
  }

  function isProximoPagoUrgente(servicio) {
    if (!servicio.cronograma_pagos) return false

    let cronograma = servicio.cronograma_pagos
    if (typeof cronograma === 'string') {
      try {
        cronograma = JSON.parse(cronograma)
      } catch {
        return false
      }
    }

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Find unpaid installments and sort by date
    const unpaidInstallments = cronograma
      .filter(cuota => !cuota.pagado)
      .sort((a, b) => new Date(a.fecha_pago) - new Date(b.fecha_pago))

    if (unpaidInstallments.length === 0) return false

    // Check if next payment is within 3 days
    const nextPayment = unpaidInstallments[0]
    const dueDate = new Date(nextPayment.fecha_pago)
    dueDate.setHours(0, 0, 0, 0)

    const diffTime = dueDate - today
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    return diffDays <= 3 && diffDays >= 0
  }

  return (
    <div className="container-fluid py-4">
      <div className="row">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h2 className="mb-0">Seguimiento de Pagos - Servicios</h2>
          </div>

          {error && <div className="alert alert-danger">{error}</div>}

          <div className="card">
            <div className="card-body p-0">
              {loading ? (
                <div className="p-4">Cargando servicios...</div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead>
                      <tr>
                        <th>Cliente</th>
                        <th>Teléfono</th>
                        <th>Vehículo</th>
                        <th>Cuotas Pendientes</th>
                        <th>Próximo Pago</th>
                        <th>Vencidas</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {servicios && servicios.length > 0 ? (
                        servicios.map(s => (
                          <tr key={s.id} className={
                            getCuotasVencidas(s) > 0
                              ? 'table-danger'
                              : isProximoPagoUrgente(s)
                                ? 'table-warning'
                                : ''
                          }>
                            <td>{s.nombre_cliente}</td>
                            <td>{s.telefono_cliente}</td>
                            <td>{s.marca_vehiculo} {s.modelo_vehiculo} {s.anio_vehiculo} ({s.placa_vehiculo}) </td>

                            <td>
                              <span className={`badge ${getCuotasPendientes(s) > 0 ? 'bg-warning' : 'bg-success'}`}>
                                {getCuotasPendientes(s)}
                              </span>
                            </td>
                            <td>{getProximoPago(s)}</td>
                            <td>
                              <span className={`badge ${getCuotasVencidas(s) > 0 ? 'bg-danger' : 'bg-success'}`}>
                                {getCuotasVencidas(s)}
                              </span>
                            </td>
                            <td>
                              <button
                                className="btn btn-sm btn-primary"
                                onClick={() => openModal(s)}
                              >
                                Ver Cuotas
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={8} className="text-center p-4">
                            No hay servicios con pagos en cuotas
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal for viewing installments */}
      {modalOpen && selectedServicio && (
        <>
          <div className="modal-backdrop show" style={{ position: 'fixed', inset: 0, zIndex: 1040 }}></div>
          <div className="modal show d-block" tabIndex="-1" role="dialog" style={{ zIndex: 1050 }}>
            <div className="modal-dialog modal-xl" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    Cuotas del Servicio - {selectedServicio.nombre_cliente}
                  </h5>
                  <button type="button" className="btn-close" aria-label="Close" onClick={closeModal}></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <strong>Vehículo:</strong> {selectedServicio.marca_vehiculo} {selectedServicio.modelo_vehiculo} {selectedServicio.anio_vehiculo} - ({selectedServicio.placa_vehiculo})
                  </div>
                  <div className="mb-3">
                    <strong>Total del Servicio:</strong> {formatCurrency(selectedServicio.total || 0)}
                  </div>

                  <div className="table-responsive">
                    <table className="table table-sm table-bordered">
                      <thead>
                        <tr>
                          <th>Cuota</th>
                          <th>Fecha de Pago</th>
                          <th>Monto</th>
                          <th>Estado</th>
                          <th>Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(() => {
                          let cronograma = selectedServicio.cronograma_pagos
                          if (typeof cronograma === 'string') {
                            try {
                              cronograma = JSON.parse(cronograma)
                            } catch {
                              cronograma = []
                            }
                          }

                          return cronograma && cronograma.length > 0 ? (
                            cronograma.map((cuota, index) => {
                              // Format date directly from string to avoid timezone issues
                              const formatDate = (dateString) => {
                                const [year, month, day] = dateString.split('-')
                                return `${day}/${month}/${year}`
                              }

                              return (
                                <tr key={index}>
                                  <td>{cuota.numero_cuota}</td>
                                  <td>{formatDate(cuota.fecha_pago)}</td>
                                  <td>{formatCurrency(cuota.monto)}</td>
                                  <td>
                                    <span className={`badge ${cuota.pagado ? 'bg-success' : 'bg-warning'}`}>
                                      {cuota.pagado ? 'Pagado' : 'Pendiente'}
                                    </span>
                                  </td>
                                  <td>
                                    <button
                                      type="button"
                                      className={`btn btn-sm ${cuota.pagado ? 'btn-warning' : 'btn-success'}`}
                                      onClick={() => togglePagoStatus(selectedServicio.id, index)}
                                      disabled={updatingPayment === `${selectedServicio.id}-${index}`}
                                    >
                                      {updatingPayment === `${selectedServicio.id}-${index}` ? (
                                        <>
                                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                          Actualizando...
                                        </>
                                      ) : (
                                        cuota.pagado ? 'Marcar como Pendiente' : 'Marcar como Pagado'
                                      )}
                                    </button>
                                  </td>
                                </tr>
                              )
                            })
                          ) : (
                            <tr>
                              <td colSpan={5} className="text-center">No hay cuotas disponibles</td>
                            </tr>
                          )
                        })()}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={closeModal}>
                    Cerrar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default SegServicios
