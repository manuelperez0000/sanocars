import { FaClock, FaCreditCard } from "react-icons/fa";
import { FaMapMarkerAlt } from "react-icons/fa";
import { FaCarSide } from "react-icons/fa";
import { PiEngineFill } from "react-icons/pi";
import { Link } from 'react-router-dom'
import useVehicles from '../hooks/useVehicles.jsx';
import {  topurl } from "../utils/globals.js";

export default function VehicleCard({ v }) {

  const { getArrayImages } = useVehicles();

  const getFirstImage = (arrayImages) => {
    const refactArray = getArrayImages(arrayImages);
    if (refactArray.length > 0) return `${topurl}/uploads/${refactArray[0]}`;
    return 'default-image.jpg';
  }

  const getStatus = (status)=>{
    if(status == "En alquiler") return  <><FaClock /> Renta </>
    if(status == "En Venta") return  <><FaCreditCard /> Venta</>
  }

  return (
    <Link to={`/vehiculo/${v.id}`} className="text-decoration-none text-reset">
      <div className="card mb-4 vehicle-card h-100">
        
        <div className='badge27'> {getStatus(v.status)} </div>
        
        <img src={v.imagen1 && getFirstImage(v.imagen1)} alt={v.modelo} className="card-img-top vehicle-card-img vehicle-image" />
        <div className="card-body pb-0 d-flex flex-column">
          <small className="texr-muted text-sm">{v.marca}</small>
          <div className='flex-between'>
            <h5 className="gray mb-0">{v.modelo} </h5>
            <h4 className="gray mb-0">{v.anio}</h4>
          </div>
          <div className="details">
            <p className="mb-1"><PiEngineFill /> {v.tamano_motor} L</p>
            <p className="mb-1"><FaMapMarkerAlt /> Fuji, Japon</p>
            <p className="mb-1"><FaCarSide /> {v.tipo_vehiculo}</p>
          </div>
          <hr className="mb-3 mt-2 p-0" />
          <div className="d-flex justify-content-between align-items-center">
            <strong className="gray mb-0 price">¥{v?.precio?.toLocaleString() || 'Sin precio'}</strong>
            <span className="text-muted">{v?.kilometraje?.toLocaleString()} km</span>
          </div>
        </div>
      </div>
    </Link>
  )
}
