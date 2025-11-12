import React, { useState } from 'react'

const marcas = ['Toyota', 'Honda', 'Ford', 'Chevrolet', 'BMW']
const modelosPorMarca = {
  Toyota: ['Corolla', 'Yaris', 'Camry'],
  Honda: ['Civic', 'Accord', 'Fit'],
  Ford: ['Focus', 'Fiesta', 'Mustang'],
  Chevrolet: ['Spark', 'Cruze', 'Malibu'],
  BMW: ['Serie 3', 'Serie 5']
}

export default function SearchBar({ onSearch }) {
  const [marca, setMarca] = useState('')
  const [modelo, setModelo] = useState('')

  const modelos = marca ? modelosPorMarca[marca] || [] : []

  const handleSearch = (e) => {
    e.preventDefault()
    onSearch?.({ marca, modelo })
  }

  return (
    <div className='bg-search card p-4'>
      <h4 className='gray'>Buscar un vehiculo</h4>
      <form className="row gy-2 gx-2 align-items-center" onSubmit={handleSearch}>
        <div className="col-sm-5">
          <select className="form-select form-select-lg" value={marca} onChange={e => { setMarca(e.target.value); setModelo('') }}>
            <option value="">Marca</option>
            {marcas.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>
        <div className="col-sm-5">
          <select className="form-select form-select-lg" value={modelo} onChange={e => setModelo(e.target.value)}>
            <option value="">Modelo</option>
            {modelos.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>
        <div className="col-sm-2 d-grid">
          <button className="btn btn-primary btn-lg">Buscar</button>
        </div>
      </form>
    </div>
  )
}
