import React, { useEffect, useState } from 'react'
import request from '../utils/request'
import { apiurl } from '../utils/globals'

const amarillo = 90
const rojo = 60

const ViewModal = ({ show, onHide, item }) => {
  if (!show || !item) return null

  const renderField = (key, value) => {
    if (value === null || value === undefined || value === '') return null

    // Special handling for detalles field
    if (key === 'detalles') {
      let detallesArray = []
      try {
        if (typeof value === 'string') {
          detallesArray = JSON.parse(value)
        } else if (Array.isArray(value)) {
          detallesArray = value
        }
      } catch (error) {
        console.error('Error parsing detalles:', error)
        return (
          <div key={key} className="mb-2">
            <strong>Detalles:</strong> Error al parsear los detalles
          </div>
        )
      }

      if (!Array.isArray(detallesArray) || detallesArray.length === 0) {
        return (
          <div key={key} className="mb-2">
            <strong>Detalles:</strong> No hay detalles disponibles
          </div>
        )
      }

      return (
        <div key={key} className="mb-3">
          <strong>Detalles:</strong>
          <div className="table-responsive mt-2">
            <table className="table table-sm table-bordered">
              <thead>
                <tr>
                  <th>Descripción</th>
                  <th>Cantidad</th>
                  <th>Precio Unitario</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {detallesArray.map((detalle, index) => (
                  <tr key={index}>
                    <td>{detalle.descripcion || '-'}</td>
                    <td className="text-center">{detalle.cantidad || 0}</td>
                    <td className="text-end">¥{detalle.precio_unitario || 0}</td>
                    <td className="text-end">¥{detalle.total || 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )
    }

    // Special handling for cronograma_pagos field
    if (key === 'cronograma_pagos') {
      let pagosArray = []
      try {
        if (typeof value === 'string') {
          pagosArray = JSON.parse(value)
        } else if (Array.isArray(value)) {
          pagosArray = value
        }
      } catch (error) {
        console.error('Error parsing cronograma_pagos:', error)
        return (
          <div key={key} className="mb-2">
            <strong>Cronograma de Pagos:</strong> Error al parsear el cronograma
          </div>
        )
      }

      if (!Array.isArray(pagosArray) || pagosArray.length === 0) {
        return (
          <div key={key} className="mb-2">
            <strong>Cronograma de Pagos:</strong> No hay pagos programados
          </div>
        )
      }

      return (
        <div key={key} className="mb-3">
          <strong>Cronograma de Pagos:</strong>
          <div className="table-responsive mt-2">
            <table className="table table-sm table-bordered">
              <thead>
                <tr>
                  <th>Cuota</th>
                  <th>Fecha de Pago</th>
                  <th>Monto</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {pagosArray.map((pago, index) => (
                  <tr key={index}>
                    <td className="text-center">{pago.numero_cuota || (index + 1)}</td>
                    <td>{pago.fecha_pago ? new Date(pago.fecha_pago + 'T00:00:00').toLocaleDateString('es-ES') : '-'}</td>
                    <td className="text-end">¥{Math.ceil(pago.monto || 0)}</td>
                    <td>
                      <span className={`badge ${pago.pagado ? 'bg-success' : 'bg-warning'}`}>
                        {pago.pagado ? 'Pagado' : 'Pendiente'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )
    }

    let displayValue = value
    if (key.includes('fecha') && value) {
      displayValue = new Date(value).toLocaleDateString()
    }

    return (
      <div key={key} className="mb-2">
        <strong>{key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}:</strong> {displayValue}
      </div>
    )
  }

  return (
    <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Detalles del Registro</h5>
            <button type="button" className="btn-close" onClick={onHide}></button>
          </div>
          <div className="modal-body">
            {Object.entries(item).map(([key, value]) => renderField(key, value))}
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onHide}>Cerrar</button>
          </div>
        </div>
      </div>
    </div>
  )
}

const ShakenTable = ({ data, marcaKey, modeloKey, anioKey, fechaKey, keyField, emptyMessage, onViewClick }) => {
 
  const calcDays = (shaken) => {
    const today = new Date();
    const shakenDate = new Date(shaken);
    const diffTime = shakenDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays
  };

  const textCalcDays = (days) => {
    return days < 0 ? `Vencido hace ${days * -1} dias` : `${days} dias restantes`
  }

  const styles = (days) => {
    if(days < rojo){
      return { backgroundColor: '#dc3545', color: '#fff' } 
    }
    if(days < amarillo){
      return {backgroundColor: '#ffd374ff', color: '#020202ff'}
    }
  }

  return (
    <div className="table-responsive">
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Marca</th>
            <th>Modelo</th>
            <th>Año</th>
            <th>Fecha Shaken</th>
            <th>Dias restantes</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {data && data.length > 0 ? data.map(item => {
            
            return (
              <tr key={item[keyField]}>
                <td style={styles(calcDays(item[fechaKey]))}>{item[marcaKey] || '-'}</td>
                <td style={styles(calcDays(item[fechaKey]))}>{item[modeloKey] || '-'}</td>
                <td style={styles(calcDays(item[fechaKey]))}>{item[anioKey] || '-'}</td>
                <td style={styles(calcDays(item[fechaKey]))}>{item[fechaKey] ? new Date(item[fechaKey]).toLocaleDateString() : '-'}</td>
                <td style={styles(calcDays(item[fechaKey]))}> {textCalcDays(calcDays(item[fechaKey]))} </td>
                <td> <button className='btn btn-success' onClick={() => onViewClick && onViewClick(item)}> Ver </button> </td>
              </tr>
            )
          }) : (
            <tr>
              <td colSpan={4} className="text-center">{emptyMessage}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

const SegShaken = () => {
  const [vehicles, setVehicles] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [inspections, setInspections] = useState([])
  const [errorInspections, setErrorInspections] = useState(null)
  const [reports, setReports] = useState([])
  const [errorReports, setErrorReports] = useState(null)
  const [loadingReports, setLoadingReports] = useState(false)
  const [services, setServices] = useState([])
  const [errorServices, setErrorServices] = useState(null)
  const [loadingServices, setLoadingServices] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)

  useEffect(() => {
    fetch()
    fetchInspections()
    fetchReports()
    fetchServices()
  }, [])

  async function fetch() {
    setLoading(true)
    setError(null)
    try {
      const resp = await request.get(apiurl + '/vehicles')
      var list = []
      if (resp && resp.data && resp.data.body) list = resp.data.body
      else if (resp && resp.data) list = resp.data

      // filter out status 'eliminado' (case-insensitive)
      list = (list || []).filter(v => ((v.status || '').toString().toLowerCase() !== 'eliminado'))

      // sort by fecha_shaken ascending (oldest first); null/empty dates go to the end
      list.sort((a, b) => {
        var da = a && a.fecha_shaken ? new Date(a.fecha_shaken) : null
        var db = b && b.fecha_shaken ? new Date(b.fecha_shaken) : null
        if (!da && !db) return 0
        if (!da) return 1
        if (!db) return -1
        return da - db
      })

      setVehicles(list)
    } catch (err) {
      console.error('SegShaken fetch error', err)
      setError(err.message || 'Error cargando datos')
    } finally {
      setLoading(false)
    }
  }

  async function fetchInspections() {
    // fetch from inspeccion_vehicular table
    setLoading(true)
    try {
      const resp = await request.get(apiurl + '/inspeccion-vehicular')
      var list = []
      if (resp && resp.data && resp.data.body) list = resp.data.body
      else if (resp && resp.data) list = resp.data

      // sort by vehiculo_fecha_shaken ascending; nulls last
      list = (list || []).sort((a, b) => {
        var da = a && a.vehiculo_fecha_shaken ? new Date(a.vehiculo_fecha_shaken) : null
        var db = b && b.vehiculo_fecha_shaken ? new Date(b.vehiculo_fecha_shaken) : null
        if (!da && !db) return 0
        if (!da) return 1
        if (!db) return -1
        return da - db
      })

      setInspections(list)
    } catch (err) {
      console.error('SegShaken fetchInspections error', err)
      setErrorInspections(err.message || 'Error cargando inspecciones')
    } finally {
      setLoading(false)
    }
  }

  async function fetchReports() {
    setLoadingReports(true)
    setErrorReports(null)
    try {
      const resp = await request.get(apiurl + '/informe-vehiculos')
      var list = []
      if (resp && resp.data && resp.data.body) list = resp.data.body
      else if (resp && resp.data) list = resp.data

      // sort by vehiculo_fecha_shaken ascending; nulls last
      list = (list || []).sort((a, b) => {
        var da = a && a.vehiculo_fecha_shaken ? new Date(a.vehiculo_fecha_shaken) : null
        var db = b && b.vehiculo_fecha_shaken ? new Date(b.vehiculo_fecha_shaken) : null
        if (!da && !db) return 0
        if (!da) return 1
        if (!db) return -1
        return da - db
      })

      setReports(list)
    } catch (err) {
      console.error('SegShaken fetchReports error', err)
      setErrorReports(err.message || 'Error cargando informes')
    } finally {
      setLoadingReports(false)
    }
  }

  async function fetchServices() {
    setLoadingServices(true)
    setErrorServices(null)
    try {
      const resp = await request.get(apiurl + '/servicios')
      var list = []
      if (resp && resp.data && resp.data.body) list = resp.data.body
      else if (resp && resp.data) list = resp.data

      // sort by fecha_shaken ascending; nulls last
      list = (list || []).sort((a, b) => {
        var da = a && a.fecha_shaken ? new Date(a.fecha_shaken) : null
        var db = b && b.fecha_shaken ? new Date(b.fecha_shaken) : null
        if (!da && !db) return 0
        if (!da) return 1
        if (!db) return -1
        return da - db
      })

      setServices(list)
    } catch (err) {
      console.error('SegShaken fetchServices error', err)
      setErrorServices(err.message || 'Error cargando servicios')
    } finally {
      setLoadingServices(false)
    }
  }

  const handleViewClick = (item) => {
    setSelectedItem(item)
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setSelectedItem(null)
  }

  /* function isShakenDueSoon(dateStr) {
    if (!dateStr) return false
    try {
      var shaken = new Date(dateStr)
      var today = new Date()
      // normalize to remove time portion
      today.setHours(0, 0, 0, 0)
      shaken.setHours(0, 0, 0, 0)
      var limit = new Date(today)
      limit.setDate(limit.getDate() + 60) // 60 days ahead
      // if shaken date is on or before limit (including past dates), mark as due soon
      return shaken <= limit
    } catch {
      return false
    }
  } */

  return (
    <div>
      <section>


        <h5>Seguimiento de Shaken de vehiculos</h5>

        {loading && <div>Cargando...</div>}
        {error && <div className="alert alert-danger">{error}</div>}

        {!loading && !error && (
          <ShakenTable
            data={vehicles}
            marcaKey="marca"
            modeloKey="modelo"
            anioKey="anio"
            fechaKey="fecha_shaken"
            keyField="id"
            emptyMessage="No hay vehículos disponibles"
            onViewClick={handleViewClick}
          />
        )}
      </section>
      <section>
        <h5>Seguimiento shaken de inspecciones</h5>
        {loading && <div>Cargando...</div>}
        {errorInspections && <div className="alert alert-danger">{errorInspections}</div>}

        {!loading && !errorInspections && (
          <ShakenTable
            data={inspections}
            marcaKey="vehiculo_marca"
            modeloKey="vehiculo_modelo"
            anioKey="vehiculo_anio"
            fechaKey="vehiculo_fecha_shaken"
            keyField="id"
            emptyMessage="No hay inspecciones disponibles"
            onViewClick={handleViewClick}
          />
        )}
      </section>

      <section>
        <h5>Informes de Vehículos (Shaken)</h5>
        {loadingReports && <div>Cargando informes...</div>}
        {errorReports && <div className="alert alert-danger">{errorReports}</div>}

        {!loadingReports && !errorReports && (
          <ShakenTable
            data={reports}
            marcaKey="vehiculo_marca"
            modeloKey="vehiculo_modelo"
            anioKey="vehiculo_anio"
            fechaKey="vehiculo_fecha_shaken"
            keyField="id"
            emptyMessage="No hay informes disponibles"
            onViewClick={handleViewClick}
          />
        )}
      </section>

      <section>
        <h5>Servicios de Vehículos (Shaken)</h5>
        {loadingServices && <div>Cargando servicios...</div>}
        {errorServices && <div className="alert alert-danger">{errorServices}</div>}

        {!loadingServices && !errorServices && (
          <ShakenTable
            data={services}
            marcaKey="marca_vehiculo"
            modeloKey="modelo_vehiculo"
            anioKey="anio_vehiculo"
            fechaKey="fecha_shaken"
            keyField="id"
            emptyMessage="No hay servicios disponibles"
            onViewClick={handleViewClick}
          />
        )}
      </section>

      <ViewModal show={showModal} onHide={handleCloseModal} item={selectedItem} />
    </div>
  )
}

export default SegShaken
