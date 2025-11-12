import { FaClock, FaCreditCard } from "react-icons/fa";
import { FaMapMarkerAlt } from "react-icons/fa";
import { FaCarSide } from "react-icons/fa";
import { PiEngineFill } from "react-icons/pi";
import { Link } from 'react-router-dom'

const rent = false

export default function VehicleCard({ v, type }) {
  return (
    <Link to={`/vehiculo/${v.id}`} className="text-decoration-none text-reset">
      <div className="card mb-4 vehicle-card h-100">
        <div className='badge'> {type === "rent" ? <><FaClock /> Renta </> : <><FaCreditCard /> Venta</>} </div>
        <img src={v.images && v.images[0] ? v.images[0] : v.image} alt={v.name} className="card-img-top vehicle-card-img" />
        <div className="card-body pb-0 d-flex flex-column">
          <div className='flex-between'>
            <h5 className="gray mb-0">{v.name} </h5>
            <h4 className="gray mb-0">{v.year}</h4>
          </div>
          <div className="details">
            <p className="mb-1"><PiEngineFill /> {v.engine} L</p>
            <p className="mb-1"><FaMapMarkerAlt /> Las Bermudas L</p>
            <p className="mb-1"><FaCarSide />  Sedan L</p>
          </div>
          <hr className="mb-3 mt-2 p-0" />
          <div className="d-flex justify-content-between align-items-center">
            <strong className="gray mb-0 price">${v.price.toLocaleString()}</strong>
            <span className="text-muted">{v.km.toLocaleString()} km</span>
          </div>
        </div>
      </div>
    </Link>
  )
}
