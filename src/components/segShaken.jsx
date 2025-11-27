import React, { useEffect, useState } from 'react'
import request from '../utils/request'
import { apiurl } from '../utils/globals'

const SegShaken = () => {
  const [vehicles, setVehicles] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch()
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
        {/* tabla de shaken de inspecciones */}
      </section>
    </div>
  )
}

export default SegShaken
