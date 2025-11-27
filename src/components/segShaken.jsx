import React, { useEffect, useState } from 'react'
import request from '../utils/request'
import { apiurl } from '../utils/globals'

const SegShaken = () => {
  const [vehicles, setVehicles] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [inspections, setInspections] = useState([])
  const [errorInspections, setErrorInspections] = useState(null)
  const [reports, setReports] = useState([])
  const [errorReports, setErrorReports] = useState(null)
  const [loadingReports, setLoadingReports] = useState(false)

  useEffect(() => {
    fetch()
    fetchInspections()
    fetchReports()
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

  function isShakenDueSoon(dateStr) {
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
  }

  return (
    <div>
      <section>


        <h5>Seguimiento de Shaken de vehiculos</h5>

        {loading && <div>Cargando...</div>}
        {error && <div className="alert alert-danger">{error}</div>}

        {!loading && !error && (
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Marca</th>
                  <th>Modelo</th>
                  <th>Año</th>
                  <th>Fecha Shaken</th>
                </tr>
              </thead>
              <tbody>
                {vehicles && vehicles.length > 0 ? vehicles.map(v => {
                  const dueSoon = isShakenDueSoon(v.fecha_shaken)
                  return (
                    <tr key={v.id} >
                      <td style={dueSoon ? { backgroundColor: '#dc3545', color: '#fff' } : undefined} >{v.marca || '-'}</td>
                      <td style={dueSoon ? { backgroundColor: '#dc3545', color: '#fff' } : undefined} >{v.modelo || '-'}</td>
                      <td style={dueSoon ? { backgroundColor: '#dc3545', color: '#fff' } : undefined} >{v.anio || '-'}</td>
                      <td style={dueSoon ? { backgroundColor: '#dc3545', color: '#fff' } : undefined} >{v.fecha_shaken ? new Date(v.fecha_shaken).toLocaleDateString() : '-'}</td>
                    </tr>
                  )
                }) : (
                  <tr>
                    <td colSpan={4} className="text-center">No hay vehículos disponibles</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>
      <section>
        <h5>Seguimiento shaken de inspecciones</h5>
        {loading && <div>Cargando...</div>}
        {errorInspections && <div className="alert alert-danger">{errorInspections}</div>}

        {!loading && !errorInspections && (
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Marca</th>
                  <th>Modelo</th>
                  <th>Año</th>
                  <th>Fecha Shaken</th>
                </tr>
              </thead>
              <tbody>
                {inspections && inspections.length > 0 ? inspections.map(it => {
                  const dueSoon = isShakenDueSoon(it.vehiculo_fecha_shaken)
                  return (
                    <tr key={it.id} >
                      <td style={dueSoon ? { backgroundColor: '#dc3545', color: '#fff' } : undefined}>{it.vehiculo_marca || '-'}</td>
                      <td style={dueSoon ? { backgroundColor: '#dc3545', color: '#fff' } : undefined}>{it.vehiculo_modelo || '-'}</td>
                      <td style={dueSoon ? { backgroundColor: '#dc3545', color: '#fff' } : undefined}>{it.vehiculo_anio || '-'}</td>
                      <td style={dueSoon ? { backgroundColor: '#dc3545', color: '#fff' } : undefined}>{it.vehiculo_fecha_shaken ? new Date(it.vehiculo_fecha_shaken).toLocaleDateString() : '-'}</td>
                    </tr>
                  )
                }) : (
                  <tr>
                    <td colSpan={4} className="text-center">No hay inspecciones disponibles</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section>
        <h5> Informe de vehiculos </h5>
      </section>
      <section>
        <h5>Informes de Vehículos (Shaken)</h5>
        {loadingReports && <div>Cargando informes...</div>}
        {errorReports && <div className="alert alert-danger">{errorReports}</div>}

        {!loadingReports && !errorReports && (
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Marca</th>
                  <th>Modelo</th>
                  <th>Año</th>
                  <th>Fecha Shaken</th>
                </tr>
              </thead>
              <tbody>
                {reports && reports.length > 0 ? reports.map(r => {
                  const dueSoon = isShakenDueSoon(r.vehiculo_fecha_shaken)
                  return (
                    <tr key={r.id} >
                      <td style={dueSoon ? { backgroundColor: '#dc3545', color: '#fff' } : undefined}>{r.vehiculo_marca || '-'}</td>
                      <td style={dueSoon ? { backgroundColor: '#dc3545', color: '#fff' } : undefined}>{r.vehiculo_modelo || '-'}</td>
                      <td style={dueSoon ? { backgroundColor: '#dc3545', color: '#fff' } : undefined}>{r.vehiculo_anio || '-'}</td>
                      <td style={dueSoon ? { backgroundColor: '#dc3545', color: '#fff' } : undefined}>{r.vehiculo_fecha_shaken ? new Date(r.vehiculo_fecha_shaken).toLocaleDateString() : '-'}</td>
                    </tr>
                  )
                }) : (
                  <tr>
                    <td colSpan={4} className="text-center">No hay informes disponibles</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}

export default SegShaken
