import { FaClock, FaPhone, FaWhatsapp, FaEnvelope, FaEdit, FaTrash, FaBuilding, FaMapMarkerAlt } from "react-icons/fa";
import useConfiguracion from "../../hooks/useConfiguracion";
import CategoriasServicio from "./categoriasServicio";

const Configuracion = () => {
  const {
    loading,
    error,
    getSchedules,
    getPhones,
    getEmails,
    getCompanyName,
    getCompanyAddress,
    agregarHorario,
    agregarTelefono,
    agregarCorreo,
    agregarNombreEmpresa,
    agregarDireccionEmpresa,
    startEditing,
    cancelEditing,
    saveEditing,
    eliminarItem,
    editingItem,
    editForm,
    setEditForm,
    createConfiguracion,
  } = useConfiguracion();



  if (loading) {
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

  if (error) {
    return (
      <div className="container mt-4">
        <h2 className="mb-4 text-center">⚙️ Configuración de la Página</h2>
        <div className="alert alert-danger">
          Error: {error}
        </div>
      </div>
    );
  }

  const schedules = getSchedules();
  const phones = getPhones();
  const emails = getEmails();
  const companyNames = getCompanyName();
  const companyAddresses = getCompanyAddress();

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
      <div>
        <CategoriasServicio />
      </div>
    </div>
  );
};

export default Configuracion;
