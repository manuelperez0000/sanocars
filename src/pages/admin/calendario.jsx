import React, { useState } from 'react'
import useServicios from '../../hooks/useServicios'

const Calendario = () => {
  const [currentDate, setCurrentDate] = useState(new Date())
  const {
    modalOpen,
    setModalOpen,
    form,
    handleChange,
    openNew,
    handleSave
  } = useServicios()

  // Get the first day of the month
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
  // Get the last day of the month
  const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)
  // Get the day of the week for the first day (0 = Sunday, 1 = Monday, etc.)
  const firstDayOfWeek = firstDayOfMonth.getDay()
  // Get the total number of days in the month
  const daysInMonth = lastDayOfMonth.getDate()

  // Create array of day numbers for the calendar
  const calendarDays = []

  // Add empty cells for days before the first day of the month
  for (let i = 0; i < firstDayOfWeek; i++) {
    calendarDays.push(null)
  }

  // Add all days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day)
  }

  // Navigate to previous month
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  // Navigate to next month
  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  // Handle day click
  const handleDayClick = (day) => {
    if (day) {
      // Create date for the clicked day
      const selectedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
      const formattedDate = selectedDate.toISOString().split('T')[0]

      // Open new service modal with the selected date
      openNew()
      // Set the fecha_servicio to the selected date
      setTimeout(() => {
        const dateInput = document.querySelector('input[name="fecha_servicio"]')
        if (dateInput) {
          dateInput.value = formattedDate
          // Trigger change event to update form state
          const event = new Event('change', { bubbles: true })
          dateInput.dispatchEvent(event)
        }
      }, 100)
    }
  }

  // Get month name
  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ]

  const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']

  return (
    <div className="container-fluid py-4">
      <div className="row ">
        <div className="col-10">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className='text-light'>Calendario de Servicios</h2>
            <div className="d-flex align-items-center">
              <button className="btn btn-outline-primary text-light me-2" onClick={goToPreviousMonth}>
                ← Anterior
              </button>
              <h4 className="mb-0 mx-3 text-light">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h4>
              <button className="btn btn-outline-primary text-light" onClick={goToNextMonth}>
                Siguiente →
              </button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="card">
            <div className="card-body">
              {/* Day headers */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(7, 1fr)',
                gap: '2px',
                marginBottom: '10px',
                padding: '10px 0',
                borderBottom: '1px solid #dee2e6'
              }}>
                {dayNames.map(day => (
                  <div key={day} className="text-center fw-bold text-primary" style={{
                    padding: '8px 0',
                    fontSize: '0.9rem'
                  }}>
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar days */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(7, 1fr)',
                gap: '2px'
              }}>
                {calendarDays.map((day, index) => (
                  <div
                    key={index}
                    onClick={() => handleDayClick(day)}
                    style={{
                      aspectRatio: '1',
                      border: '1px solid #dee2e6',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: day ? '#f8f9fa' : '#f8f9fa',
                      opacity: day ? 1 : 0.3,
                      transition: 'all 0.2s ease',
                      minHeight: '80px',
                      cursor: day ? 'pointer' : 'default'
                    }}
                    onMouseEnter={(e) => {
                      if (day) {
                        e.target.style.backgroundColor = '#e3f2fd'
                        e.target.style.transform = 'scale(1.05)'
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (day) {
                        e.target.style.backgroundColor = '#f8f9fa'
                        e.target.style.transform = 'scale(1)'
                      }
                    }}
                  >
                    {day && (
                      <span className="fw-bold" style={{
                        fontSize: '1.2rem',
                        color: '#495057'
                      }}>
                        {day}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-3 text-muted">
            <small>Haz clic en cualquier día para programar un nuevo servicio</small>
          </div>
        </div>
      </div>

      {/* Service Modal - Reusing the modal from servicios.jsx */}
      {modalOpen && (
        <div className="modal-backdrop show" style={{ position: 'fixed', inset: 0, zIndex: 1040 }}></div>
      )}
      {modalOpen && (
        <div className="modal show d-block" tabIndex="-1" role="dialog" style={{ zIndex: 1050 }}>
          <div className="modal-dialog modal-xl" role="document">
            <div className="modal-content">
              <form onSubmit={handleSave}>
                <div className="modal-header">
                  <h5 className="modal-title">Nuevo servicio</h5>
                  <button type="button" className="btn-close" aria-label="Close" onClick={() => setModalOpen(false)}></button>
                </div>
                <div className="modal-body">
                  {/* Client Data Section */}
                  <div className="mb-4">
                    <h6 className="text-primary mb-3">Datos del Cliente</h6>
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Nombre del Cliente *</label>
                        <input name="nombre_cliente" value={form.nombre_cliente || ''} onChange={handleChange} className="form-control" required />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Teléfono</label>
                        <input name="telefono_cliente" value={form.telefono_cliente || ''} onChange={handleChange} className="form-control" />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Email</label>
                        <input type="email" name="email_cliente" value={form.email_cliente || ''} onChange={handleChange} className="form-control" />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Cédula</label>
                        <input name="cedula_cliente" value={form.cedula_cliente || ''} onChange={handleChange} className="form-control" />
                      </div>
                    </div>
                  </div>

                  {/* Vehicle Data Section */}
                  <div className="mb-4">
                    <h6 className="text-primary mb-3">Datos del Vehículo</h6>
                    <div className="row">
                      <div className="col-md-4 mb-3">
                        <label className="form-label">Marca *</label>
                        <input name="marca_vehiculo" value={form.marca_vehiculo || ''} onChange={handleChange} className="form-control" required />
                      </div>
                      <div className="col-md-4 mb-3">
                        <label className="form-label">Modelo *</label>
                        <input name="modelo_vehiculo" value={form.modelo_vehiculo || ''} onChange={handleChange} className="form-control" required />
                      </div>
                      <div className="col-md-4 mb-3">
                        <label className="form-label">Año</label>
                        <input name="anio_vehiculo" value={form.anio_vehiculo || ''} onChange={handleChange} className="form-control" />
                      </div>
                      <div className="col-md-4 mb-3">
                        <label className="form-label">Placa *</label>
                        <input name="placa_vehiculo" value={form.placa_vehiculo || ''} onChange={handleChange} className="form-control" required />
                      </div>
                      <div className="col-md-4 mb-3">
                        <label className="form-label">Color</label>
                        <input name="color_vehiculo" value={form.color_vehiculo || ''} onChange={handleChange} className="form-control" />
                      </div>
                      <div className="col-md-4 mb-3">
                        <label className="form-label">Kilometraje</label>
                        <input name="kilometraje_vehiculo" value={form.kilometraje_vehiculo || ''} onChange={handleChange} className="form-control" />
                      </div>
                    </div>
                  </div>

                  {/* Service Details Section */}
                  <div className="mb-4">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h6 className="text-primary mb-0">Detalles del Servicio</h6>
                      <button type="button" className="btn btn-sm btn-outline-primary" onClick={() => {
                        // This would need to be implemented - for now just show alert
                        alert('Funcionalidad de agregar items próximamente')
                      }}>
                        Agregar Item
                      </button>
                    </div>
                    <div className="table-responsive">
                      <table className="table table-sm">
                        <thead>
                          <tr>
                            <th>Descripción</th>
                            <th>Cantidad</th>
                            <th>Precio Unit.</th>
                            <th>Total</th>
                            <th>Acciones</th>
                          </tr>
                        </thead>
                        <tbody>
                          {form.detalles && form.detalles.length > 0 ? (
                            form.detalles.map((detail, index) => (
                              <tr key={index}>
                                <td>{detail.descripcion}</td>
                                <td>{detail.cantidad}</td>
                                <td>${parseFloat(detail.precio_unitario || 0).toFixed(2)}</td>
                                <td>${parseFloat(detail.total || 0).toFixed(2)}</td>
                                <td>
                                  <button type="button" className="btn btn-sm btn-warning me-1" onClick={() => {
                                    alert('Editar item próximamente')
                                  }}>
                                    Editar
                                  </button>
                                  <button type="button" className="btn btn-sm btn-danger" onClick={() => {
                                    alert('Eliminar item próximamente')
                                  }}>
                                    Eliminar
                                  </button>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={5} className="text-center text-muted">No hay items agregados</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Totals Section */}
                  <div className="mb-4">
                    <div className="row">
                      <div className="col-md-4">
                        <div className="border p-3 rounded">
                          <div className="d-flex justify-content-between">
                            <strong>Subtotal:</strong>
                            <span>${parseFloat(form.subtotal || 0).toFixed(2)}</span>
                          </div>
                          <div className="d-flex justify-content-between">
                            <strong>IVA (16%):</strong>
                            <span>${parseFloat(form.iva || 0).toFixed(2)}</span>
                          </div>
                          <hr />
                          <div className="d-flex justify-content-between">
                            <strong>Total:</strong>
                            <span className="text-primary">${parseFloat(form.total || 0).toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Additional Info */}
                  <div className="mb-4">
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Fecha del Servicio</label>
                        <input type="date" name="fecha_servicio" value={form.fecha_servicio || ''} onChange={handleChange} className="form-control" />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Status</label>
                        <select name="status" value={form.status || 'Pendiente'} onChange={handleChange} className="form-control">
                          <option value="Pendiente">Pendiente</option>
                          <option value="En Progreso">En Progreso</option>
                          <option value="Completado">Completado</option>
                          <option value="Cancelado">Cancelado</option>
                        </select>
                      </div>
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Notas</label>
                      <textarea name="notas" value={form.notas || ''} onChange={handleChange} className="form-control" rows="3"></textarea>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setModalOpen(false)}>Cancelar</button>
                  <button type="submit" className="btn btn-primary">
                    Guardar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Calendario
