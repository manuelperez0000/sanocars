import React, { useState, useEffect } from 'react';
import request from '../utils/request';
import { apiurl } from '../utils/globals';

const SegAlquileres = () => {
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRentalsData();
  }, []);

  const fetchRentalsData = async () => {
    try {
      setLoading(true);
      // Fetch all rentals with vehicle information
      const rentalsResponse = await request.get(`${apiurl}/alquileres`);
      const rentalsData = rentalsResponse.data.body || [];

      // For each rental, fetch payment information
      const rentalsWithPayments = await Promise.all(
        rentalsData.map(async (rental) => {
          try {
            const paymentsResponse = await request.get(`${apiurl}/pagos-alquileres/vehiculo/${rental.vehiculo_id}`);
            return {
              ...rental,
              payments: paymentsResponse.data.body?.pagos_realizados || [],
              nextPayment: paymentsResponse.data.body?.fecha_proximo_pago || null
            };
          } catch (error) {
            void error
            // If no payment record exists, return rental with empty payments
            return {
              ...rental,
              payments: [],
              nextPayment: null
            };
          }
        })
      );

      setRentals(rentalsWithPayments);
    } catch (error) {
      console.error('Error fetching rentals data:', error);
      setError('Error al cargar los datos de alquileres');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center p-4">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p className="mt-2">Cargando datos de alquileres...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger">
        <h5>Error</h5>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div>
      <h5 className="mb-4">Seguimiento de Pagos de Alquiler</h5>

      {rentals.length === 0 ? (
        <div className="alert alert-info">
          <h6>No hay vehículos en alquiler</h6>
          <p>No se encontraron registros de alquileres activos.</p>
        </div>
      ) : (
        <div className="row">
          {rentals.map((rental) => (
            <div key={rental.id} className="col-md-6 col-lg-4 mb-4">
              <div className="card h-100 shadow-sm">
                <div className="card-header bg-primary text-white">
                  <h6 className="card-title mb-0">
                    {rental.marca} {rental.modelo}
                  </h6>
                  <small className="text-white-50">
                    Placa: {rental.numero_placa}
                  </small>
                </div>

                <div className="card-body">
                  <div className="mb-3">
                    <strong className="text-muted">Cliente:</strong>
                    <p className="mb-1">{rental.cliente_nombre}</p>
                    {rental.cliente_telefono && (
                      <small className="text-muted">
                        Tel: {rental.cliente_telefono}
                      </small>
                    )}
                  </div>

                  <div className="mb-3">
                    <strong className="text-muted">Fecha de Inicio:</strong>
                    <p className="mb-1">
                      {new Date(rental.fecha_inicio).toLocaleDateString('es-ES')}
                    </p>
                  </div>

                  <div className="mb-3">
                    <strong className="text-muted">Próximo Pago:</strong>
                    <p className="mb-1">
                      {rental.nextPayment
                        ? new Date(rental.nextPayment).toLocaleDateString('es-ES')
                        : 'No establecido'
                      }
                    </p>
                  </div>

                  <div className="mb-3">
                    <strong className="text-muted">Precio Mensual:</strong>
                    <p className="mb-1 text-success fw-bold">
                      ${parseFloat(rental.precio_alquiler).toFixed(2)}
                    </p>
                  </div>

                  <hr />

                  <div>
                    <strong className="text-muted">Historial de Pagos:</strong>
                    {rental.payments && rental.payments.length > 0 ? (
                      <div className="mt-2">
                        {rental.payments.map((paymentDate, index) => (
                          <div key={index} className="d-flex justify-content-between align-items-center py-1 border-bottom">
                            <small>
                              {new Date(paymentDate).toLocaleDateString('es-ES')}
                            </small>
                            <small className="text-success fw-bold">
                              ${parseFloat(rental.precio_alquiler).toFixed(2)}
                            </small>
                          </div>
                        ))}
                        <div className="mt-2 pt-2">
                          <small className="text-muted">
                            Total pagado: ${(rental.payments.length * parseFloat(rental.precio_alquiler)).toFixed(2)}
                          </small>
                        </div>
                      </div>
                    ) : (
                      <div className="mt-2">
                        <small className="text-muted fst-italic">
                          No hay pagos registrados
                        </small>
                      </div>
                    )}
                  </div>
                </div>

                <div className="card-footer bg-light">
                  <small className="text-muted">
                    ID Alquiler: {rental.id}
                  </small>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SegAlquileres;
