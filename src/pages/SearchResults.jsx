import { useSearchParams } from 'react-router-dom'
import VehicleList from '../components/VehicleList'
import { useEffect, useState } from 'react'
import { apiurl } from '../utils/globals'
import request from '../utils/request'

export default function SearchResults() {
  const [searchParams] = useSearchParams()
  const [vehicles, setVehicles] = useState([])
  const marca = searchParams.get('marca')
  const modelo = searchParams.get('modelo')

  const getVehicles = async (marca, modelo) => {
    const vehiclesRequested = await request.get(apiurl + "/search/" + marca + "/" + modelo)
    setVehicles(vehiclesRequested?.data?.body || [])
  }

  useEffect(() => {
    getVehicles(marca, modelo)
  }, [])

  return (
    <div className="container mt-5">
      <h1>Resultados de Búsqueda</h1>
      <VehicleList vehicles={vehicles || []} type={"ani"} />
    </div>
  )
}
