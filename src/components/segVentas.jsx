const SegVentas = ({ vehicles, loading, error }) => {
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

  return (
    <div>
      <h5>Seguimiento de Ventas de Vehículos</h5>
      {vehicles && vehicles.length > 0 ? (
        <div className="row">
          {vehicles.map((vehicle) => (
            <div key={vehicle.id} className="col-md-6 col-lg-4 mb-4">
              <div className="card h-100">
                <div className="card-body">
                  <h6 className="card-title">{vehicle.marca} - {vehicle.modelo} - {vehicle.anio}</h6>
                  <p className="card-text">
                    <strong>Precio:</strong> ${vehicle.precio}<br/>
                  </p>
                  {vehicle.siguientes_pagos && vehicle.siguientes_pagos.length > 0 && (
                    <div className="mt-3">

                      <h6>Cuotas ({vehicle.siguientes_pagos.length})</h6>

                       <div className="table-responsive">
                        <table className="table table-sm">
                          <thead>
                            <tr>
                              <th>#</th>
                              <th>Fecha</th>
                              <th>Monto</th>
                            </tr>
                          </thead>
                          <tbody>
                            {vehicle.siguientes_pagos.map((pago, index) => (
                              <tr key={index}>
                                <td>{pago.numero_cuota}</td>
                                <td>{new Date(pago.fecha_pago).toLocaleDateString('es-ES')}</td>
                                <td>${pago.monto}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div> 
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
    </div>
  );
};

export default SegVentas;
