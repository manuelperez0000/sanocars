import { useState } from 'react';
import { formatCurrency } from '../utils/globals';

const SegVentas = ({ vehicles, loading, error, updateQuotaStatus }) => {
  const [updatingQuota, setUpdatingQuota] = useState(null);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleVerCuotas = (vehicle) => {
    setSelectedVehicle(vehicle);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedVehicle(null);
  };

  const handleMarkAsPaid = async ({ vehicleId, cuotaIndex, status }) => {

    setUpdatingQuota(`${vehicleId}-${cuotaIndex}`);

    try {
      const result = await updateQuotaStatus({ vehicleId, cuotaIndex, status });
      if (result.success) {
        // Update the local state to reflect the change immediately

        setSelectedVehicle(prev => {
          if (!prev) return prev;
          const updatedPagos = [...prev.siguientes_pagos];
          if (updatedPagos[cuotaIndex - 1]) {
            updatedPagos[cuotaIndex - 1].status = status;
          }
          return {
            ...prev,
            siguientes_pagos: updatedPagos
          };
        });


      } else {
        alert('Error al actualizar el estado de la cuota1: ' + result.message);
      }
    } catch (error) {
      alert('Error al actualizar el estado de la cuota2: ' + error.message);
    } finally {
      setUpdatingQuota(null);
    }
  };

  const calcVencidas = (pagos) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to start of day for accurate comparison
    return pagos.filter(pago => !pago.status && new Date(pago.fecha_pago) < today).length;
  }

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p className="mt-2">Cargando datos de seguimiento...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        <h5>Error</h5>
        <p>{error}</p>
      </div>
    );
  }

  const bgStatus = (status, pago) => {

    return status ? "bg-success text-white" : calcVencidas([pago]) > 0 ? "bg-danger text-light" : "bg-warning text-dark"
  }

  return (
    <div>
      <h5>Seguimiento de Ventas de Vehículos</h5>
      {vehicles && vehicles.length > 0 ? (
        <div className="row">
          {vehicles.map((vehicle) => (
            <div key={vehicle.id} className="col-6 mb-4">
              <div className="card h-100">
                <div className="card-body">
                  <h6 className="card-title">{vehicle.marca} - {vehicle.modelo} - {vehicle.anio}</h6>
                  <h5>{vehicle.cliente_nombre}</h5>
                  <p className="card-text">
                    <strong>Precio:</strong>{formatCurrency(vehicle.precio,'¥ ')}<br />
                  </p>
                  {vehicle.siguientes_pagos && vehicle.siguientes_pagos.length > 0 && (
                    <div className="mt-3">

                      <h6>Cuotas totales ({vehicle.siguientes_pagos.length})</h6>
                      <h6 className="">Cuotas por pagar: {vehicle.siguientes_pagos.filter(pago => !pago.status).length}</h6>
                      {calcVencidas(vehicle.siguientes_pagos) > 0 && <div role="alert" className='alert alert-danger'>
                        <h5>{calcVencidas(vehicle.siguientes_pagos)} {calcVencidas(vehicle.siguientes_pagos) > 1 ? ` cuotas vencidas` : ` cuota vencida`}</h5>
                      </div>}
                      <button
                        className="btn btn-primary w-100"
                        onClick={() => handleVerCuotas(vehicle)}
                      >
                        Ver cuotas
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No hay vehículos con pagos a cuotas para mostrar.</p>
      )}

      {/* Modal para ver cuotas */}
      {showModal && selectedVehicle && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-fullscreen">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Información del Vehículo y Cuotas</h5>
                <button type="button" className="btn-close" onClick={handleCloseModal}></button>
              </div>
              <div className="modal-body">
                {/* Información completa del vehículo */}
                <div className="mb-4">
                  <h6>Información del Vehículo</h6>
                  <div className="row">
                    <div className="col-md-6">
                      <p><strong>Marca:</strong> {selectedVehicle.marca}</p>
                      <p><strong>Modelo:</strong> {selectedVehicle.modelo}</p>
                      <p><strong>Año:</strong> {selectedVehicle.anio}</p>
                    </div>
                    <div className="col-md-6">
                      <p><strong>Cliente:</strong> {selectedVehicle.cliente_nombre}</p>
                      <p><strong>Precio:</strong> {formatCurrency(selectedVehicle.precio,'¥ ')}</p>
                      <p><strong>Cuotas Totales:</strong> {selectedVehicle.siguientes_pagos?.length || 0}</p>
                      <p><strong>Cuotas Pendientes:</strong> {selectedVehicle.siguientes_pagos?.filter(pago => !pago.status).length || 0}</p>
                    </div>
                  </div>
                </div>

                {/* Tabla de cuotas */}
                <div>
                  <h6>Detalle de Cuotas</h6>
                  <div className="table-responsive">
                    <table className="table table-sm">
                      <thead>
                        <tr>
                          <th># Cuota</th>
                          <th>Fecha de Pago</th>
                          <th>Monto</th>
                          <th>Estado</th>
                          <th>Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedVehicle.siguientes_pagos?.map((pago, index) => (
                          <tr key={index}>
                            <td className={bgStatus(pago.status, pago)}>{pago.numero_cuota}</td>
                            <td className={bgStatus(pago.status, pago)}>{new Date(pago.fecha_pago).toLocaleDateString('es-ES')}</td>
                            <td className={bgStatus(pago.status, pago)}>{formatCurrency(pago.monto,'¥ ')}</td>
                            <td className={bgStatus(pago.status, pago)}>
                              {pago.status ? 'Pagada' : calcVencidas([pago]) > 0 ? "Vencida" : 'Pendiente'}
                            </td>

                            <td>
                              {!pago.status ? (
                                <button
                                  className="btn btn-success btn-sm w-100"
                                  onClick={() => handleMarkAsPaid({ vehicleId: selectedVehicle.id, cuotaIndex: pago.numero_cuota, status: true })}
                                  disabled={updatingQuota === `${selectedVehicle.id}-${pago.numero_cuota}`}
                                >
                                  {updatingQuota === `${selectedVehicle.id}-${pago.numero_cuota}` ? (
                                    <span className="spinner-border spinner-border-sm" role="status"></span>
                                  ) : (
                                    'Marcar como pagada'
                                  )}
                                </button>
                              ) : <button
                                onClick={() => handleMarkAsPaid({ vehicleId: selectedVehicle.id, cuotaIndex: pago.numero_cuota, status: false })}
                                className='w-100'> Marcar como no pagada </button>}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SegVentas;
