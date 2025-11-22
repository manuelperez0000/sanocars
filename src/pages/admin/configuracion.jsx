import { FaClock, FaPhone, FaWhatsapp, FaEnvelope, FaEdit, FaTrash } from "react-icons/fa";
import useConfiguracion from "../../hooks/useConfiguracion";
import useServices from "../../hooks/useServices";
import { useNavigate } from "react-router-dom";

const Configuracion = () => {
  const {
    loading,
    error,
    getSchedules,
    getPhones,
    getEmails,
    agregarHorario,
    agregarTelefono,
    agregarCorreo,
    startEditing,
    cancelEditing,
    saveEditing,
    eliminarItem,
    editingItem,
    editForm,
    setEditForm,
  } = useConfiguracion();

  const navigate = useNavigate()
  const { loadingServices, errorServices, saving, statusFilter,
    setStatusFilter,
    filteredServices,
    handleStatusChange } = useServices()

  if (loading || loadingServices) {
    return (
      <div className="container mt-4">
        <h2 className="mb-4 text-center">⚙️ Configuración de la Página</h2>
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error || errorServices) {
    return (
      <div className="container mt-4">
        <h2 className="mb-4 text-center">⚙️ Configuración de la Página</h2>
        <div className="alert alert-danger">
          Error: {error || errorServices}
        </div>
      </div>
    );
  }

  const schedules = getSchedules();
  const phones = getPhones();
  const emails = getEmails();

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Configuración de la Página</h2>

      {/* Horarios */}
      <div className="card mb-4 shadow-sm">
        <div className="card-body">
          <h5 className="card-title">
            <FaClock /> Horarios de Trabajo
          </h5>
          {schedules.map((schedule) => (
            <div key={schedule.id} className="row mb-2">
              <div className="col">
                {editingItem && editingItem.id === schedule.id ? (
                  <div className="d-flex gap-2">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Ejemplo: Lunes a Viernes 9:00 - 18:00"
                      value={editForm.texto}
                      onChange={(e) => setEditForm({ ...editForm, texto: e.target.value })}
                    />
                    <button className="btn btn-success btn-sm" onClick={saveEditing}>
                      Guardar
                    </button>
                    <button className="btn btn-secondary btn-sm" onClick={cancelEditing}>
                      Cancelar
                    </button>
                  </div>
                ) : (
                  <div className="d-flex justify-content-between align-items-center">
                    <span>{schedule.texto || "Sin texto"}</span>
                    <div>
                      <button className="btn btn-outline-primary btn-sm me-2" onClick={() => startEditing(schedule)}>
                        <FaEdit />
                      </button>
                      <button className="btn btn-outline-danger btn-sm" onClick={() => eliminarItem(schedule.id)}>
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
          <button
            className="btn btn-outline-primary btn-sm"
            onClick={agregarHorario}
          >
            + Agregar Horario
          </button>
        </div>
      </div>

      {/* Teléfonos */}
      <div className="card mb-4 shadow-sm">
        <div className="card-body">
          <h5 className="card-title">
            <FaPhone /> Teléfonos
          </h5>
          {phones.map((phone) => (
            <div key={phone.id} className="row mb-2">
              <div className="col-md-8">
                {editingItem && editingItem.id === phone.id ? (
                  <div className="d-flex gap-2">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Número de teléfono"
                      value={editForm.texto}
                      onChange={(e) => setEditForm({ ...editForm, texto: e.target.value })}
                    />
                    <div className="form-check d-flex align-items-center ms-2">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id={`whatsapp-edit-${phone.id}`}
                        checked={editForm.whatsapp}
                        onChange={(e) => setEditForm({ ...editForm, whatsapp: e.target.checked })}
                      />
                      <label className="form-check-label ms-2" htmlFor={`whatsapp-edit-${phone.id}`}>
                        <FaWhatsapp color="green" /> WhatsApp
                      </label>
                    </div>
                    <button className="btn btn-success btn-sm" onClick={saveEditing}>
                      Guardar
                    </button>
                    <button className="btn btn-secondary btn-sm" onClick={cancelEditing}>
                      Cancelar
                    </button>
                  </div>
                ) : (
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center">
                      <span className="me-3">{phone.texto || "Sin número"}</span>
                      {phone.whatsapp && <FaWhatsapp color="green" title="WhatsApp" />}
                    </div>
                    <div>
                      <button className="btn btn-outline-primary btn-sm me-2" onClick={() => startEditing(phone)}>
                        <FaEdit />
                      </button>
                      <button className="btn btn-outline-danger btn-sm" onClick={() => eliminarItem(phone.id)}>
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
          <button
            className="btn btn-outline-primary btn-sm"
            onClick={agregarTelefono}
          >
            + Agregar Teléfono
          </button>
        </div>
      </div>

      {/* Correos */}
      <div className="card mb-4 shadow-sm">
        <div className="card-body">
          <h5 className="card-title">
            <FaEnvelope /> Correos Electrónicos
          </h5>
          {emails.map((email) => (
            <div key={email.id} className="row mb-2">
              <div className="col">
                {editingItem && editingItem.id === email.id ? (
                  <div className="d-flex gap-2">
                    <input
                      type="email"
                      className="form-control"
                      placeholder="correo@ejemplo.com"
                      value={editForm.texto}
                      onChange={(e) => setEditForm({ ...editForm, texto: e.target.value })}
                    />
                    <button className="btn btn-success btn-sm" onClick={saveEditing}>
                      Guardar
                    </button>
                    <button className="btn btn-secondary btn-sm" onClick={cancelEditing}>
                      Cancelar
                    </button>
                  </div>
                ) : (
                  <div className="d-flex justify-content-between align-items-center">
                    <span>{email.texto || "Sin correo"}</span>
                    <div>
                      <button className="btn btn-outline-primary btn-sm me-2" onClick={() => startEditing(email)}>
                        <FaEdit />
                      </button>
                      <button className="btn btn-outline-danger btn-sm" onClick={() => eliminarItem(email.id)}>
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
          <button
            className="btn btn-outline-primary btn-sm"
            onClick={agregarCorreo}
          >
            + Agregar Correo
          </button>
        </div>
      </div>
      <div className="mb-5">
        <div className="card mb-4 shadow-sm">
          <div className="container-fluid py-4">
            <div className="row">
              <div className="col-12">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h2>Gestión de Servicios</h2>
                  <button
                    className="btn btn-outline-primary"
                    onClick={() => navigate('/admin/categorias-servicio')}
                  >
                    Categorías
                  </button>
                </div>



                {/* Services Table */}
                <div className="card">
                  <div className="card-body">
                    <div className='flex-between'>
                      <h5 className="card-title">Reservas de clientes ({filteredServices.length})</h5>
                      <select
                        className="form-select w-50"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                      >
                        <option value="">Todos los estados</option>
                        <option value="0">Pendiente</option>
                        <option value="1">Aprobado</option>
                        <option value="2">Cancelado</option>
                        <option value="3">Ejecutado</option>
                      </select>
                    </div>


                    {filteredServices.length === 0 ? (
                      <p>No hay servicios para mostrar.</p>
                    ) : (
                      <div className="table-responsive">
                        <table className="table table-striped table-hover">
                          <thead>
                            <tr>
                              <th>Nombre</th>
                              <th>Email</th>
                              <th>Teléfono</th>
                              <th>Servicio</th>
                              <th>Fecha Reserva</th>

                              <th>Acciones</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredServices.map((service) => (
                              <tr key={service.id}>
                                <td>{service.nombre}</td>
                                <td>{service.email}</td>
                                <td>{service.telefono}</td>
                                <td>{service.servicio}</td>
                                <td>{new Date(service.fecha_reserva).toLocaleDateString()}</td>

                                <td>
                                  <div className="btn-group" role="group">
                                    <input
                                      type="radio"
                                      className="btn-check"
                                      name={`status-${service.id}`}
                                      id={`pending-${service.id}`}
                                      checked={service.status === 0}
                                      onChange={() => handleStatusChange(service.id, 0)}
                                      disabled={saving}
                                    />
                                    <label className="btn btn-outline-warning btn-sm" htmlFor={`pending-${service.id}`}>
                                      Pendiente
                                    </label>

                                    <input
                                      type="radio"
                                      className="btn-check"
                                      name={`status-${service.id}`}
                                      id={`approved-${service.id}`}
                                      checked={service.status === 1}
                                      onChange={() => handleStatusChange(service.id, 1)}
                                      disabled={saving}
                                    />
                                    <label className="btn btn-outline-success btn-sm" htmlFor={`approved-${service.id}`}>
                                      Aprobado
                                    </label>

                                    <input
                                      type="radio"
                                      className="btn-check"
                                      name={`status-${service.id}`}
                                      id={`cancelled-${service.id}`}
                                      checked={service.status === 2}
                                      onChange={() => handleStatusChange(service.id, 2)}
                                      disabled={saving}
                                    />
                                    <label className="btn btn-outline-danger btn-sm" htmlFor={`cancelled-${service.id}`}>
                                      Cancelado
                                    </label>

                                    <input
                                      type="radio"
                                      className="btn-check"
                                      name={`status-${service.id}`}
                                      id={`executed-${service.id}`}
                                      checked={service.status === 3}
                                      onChange={() => handleStatusChange(service.id, 3)}
                                      disabled={saving}
                                    />
                                    <label className="btn btn-outline-info btn-sm" htmlFor={`executed-${service.id}`}>
                                      Ejecutado
                                    </label>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Configuracion;
