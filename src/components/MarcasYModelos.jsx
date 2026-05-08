import { useBrandModels } from '../hooks/useBrandModels';

const MarcasYModelos = () => {
    const {
        // Estados para marcas
        showModal,
        newMarca,
        marcas,
        editingMarca,
        editText,
        
        // Estados para modelos
        selectedMarca,
        modelos,
        showModeloModal,
        newModelo,
        editingModelo,
        editModeloText,
        
        // Estados para modales de confirmación
        showDeleteMarcaModal,
        showDeleteModeloModal,
        itemToDelete,
        
        // Refs
        marcaInputRef,
        modeloInputRef,
        
        // Datos filtrados
        modelosFiltrados,
        
        // Handlers para marcas
        handleOpenModal,
        handleCloseModal,
        handleSaveMarca,
        handleEditMarca,
        handleUpdateMarca,
        handleDeleteMarca,
        confirmDeleteMarca,
        cancelDeleteMarca,
        
        // Handlers para modelos
        handleOpenModeloModal,
        handleCloseModeloModal,
        handleSaveModelo,
        handleEditModelo,
        handleUpdateModelo,
        handleDeleteModelo,
        confirmDeleteModelo,
        cancelDeleteModelo,
        
        // Setters
        setSelectedMarca,
        setNewMarca,
        setNewModelo,
        setEditText,
        setEditModeloText
    } = useBrandModels();

    return (
        <>
            <div className="mb-4 row p-1">
                <div className="col-6">
                    <h2>Marcas</h2>
                    <div className="card col-12 d-flex w-100 p-3">
                        <div className="w-100">
                            <div className='text-end'>
                                <button className="btn btn-primary" onClick={handleOpenModal}>Nueva marca</button>
                            </div>
                            <div>
                                <h5>Lista de Marcas</h5>
                                {marcas.length === 0 ? (
                                    <p className="text-muted">No hay marcas registradas</p>
                                ) : (
                                    <div className="list-group">
                                        {marcas.map((marca, index) => {
                                            console.log(`🔍 Renderizando marca ${index}:`, { marca, editingMarca, isEditing: editingMarca === index });
                                            return (
                                            <div key={marca.id} className="list-group-item d-flex justify-content-between align-items-center p-1">
                                                {editingMarca === index ? (
                                                    <div className="d-flex flex-grow-1 ">
                                                        <input
                                                            type="text"
                                                            className="form-control "
                                                            value={editText}
                                                            onChange={(e) => setEditText(e.target.value)}
                                                        />
                                                        <button className="btn btn-success btn-sm me-1" onClick={handleUpdateMarca}>
                                                            Guardar
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <span>{marca.brand_name}</span>
                                                        <div>
                                                            <button className="btn btn-warning btn-sm me-2" onClick={() => handleEditMarca(index)}>
                                                                Editar
                                                            </button>
                                                            <button className="btn btn-danger btn-sm" onClick={() => handleDeleteMarca(index)}>
                                                                Eliminar
                                                            </button>
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-6">
                    <h2>Modelos</h2>
                    <div className="card p-3">
                        <div className="mb-3">
                            <div className="input-group">
                                <select 
                                    className="form-select" 
                                    value={selectedMarca}
                                    onChange={(e) => setSelectedMarca(e.target.value)}
                                >
                                    <option value="">Selecciona una marca</option>
                                    {marcas.map((marca) => (
                                        <option key={marca.id} value={marca.id}>{marca.brand_name}</option>
                                    ))}
                                </select>
                                <button 
                                    className="btn btn-primary" 
                                    onClick={handleOpenModeloModal}
                                    disabled={!selectedMarca}
                                >
                                    Nuevo modelo
                                </button>
                            </div>
                        </div>
                        
                        {/* Lista de modelos filtrados */}
                        <div>
                            <h6>Modelos de {selectedMarca ? marcas.find(m => m.id === parseInt(selectedMarca))?.name : '...'}</h6>
                            {modelosFiltrados.length === 0 ? (
                                <p className="text-muted">
                                    {selectedMarca ? 'No hay modelos registrados para esta marca' : 'Selecciona una marca para ver sus modelos'}
                                </p>
                            ) : (
                                <div className="list-group">
                                    {modelosFiltrados.map((modelo, index) => {
                                        const originalIndex = modelos.findIndex(m => m.id === modelo.id);
                                        return (
                                            <div key={modelo.id} className="list-group-item d-flex justify-content-between align-items-center p-1">
                                                {editingModelo === originalIndex ? (
                                                    <div className="d-flex flex-grow-1">
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            value={editModeloText}
                                                            onChange={(e) => setEditModeloText(e.target.value)}
                                                        />
                                                        <button className="btn btn-success btn-sm me-1" onClick={handleUpdateModelo}>
                                                            Guardar
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <span>{modelo.name}</span>
                                                        <div>
                                                            <button className="btn btn-warning btn-sm me-2" onClick={() => handleEditModelo(originalIndex)}>
                                                                Editar
                                                            </button>
                                                            <button className="btn btn-danger btn-sm" onClick={() => handleDeleteModelo(originalIndex)}>
                                                                Eliminar
                                                            </button>
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="modal show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Nueva Marca</h5>
                                <button type="button" className="btn-close" onClick={handleCloseModal}></button>
                            </div>
                            <div className="modal-body">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Ingrese el nombre de la marca"
                                    value={newMarca}
                                    onChange={(e) => setNewMarca(e.target.value)}
                                    ref={marcaInputRef}
                                />
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                                    Cancelar
                                </button>
                                <button type="button" className="btn btn-primary" onClick={handleSaveMarca}>
                                    Guardar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal para nuevos modelos */}
            {showModeloModal && (
                <div className="modal show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Nuevo Modelo</h5>
                                <button type="button" className="btn-close" onClick={handleCloseModeloModal}></button>
                            </div>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <label className="form-label">Marca: {marcas.find(m => m.id === parseInt(selectedMarca))?.name}</label>
                                </div>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Ingrese el nombre del modelo"
                                    value={newModelo}
                                    onChange={(e) => setNewModelo(e.target.value)}
                                    ref={modeloInputRef}
                                />
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={handleCloseModeloModal}>
                                    Cancelar
                                </button>
                                <button type="button" className="btn btn-primary" onClick={handleSaveModelo}>
                                    Guardar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de confirmación para eliminar marca */}
            {showDeleteMarcaModal && (
                <div className="modal show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Confirmar Eliminación</h5>
                                <button type="button" className="btn-close" onClick={cancelDeleteMarca}></button>
                            </div>
                            <div className="modal-body">
                                <p>¿Está seguro que desea eliminar la marca "<strong>{itemToDelete?.name}</strong>"?</p>
                                <p className="text-muted">Esta acción no se puede deshacer.</p>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={cancelDeleteMarca}>
                                    Cancelar
                                </button>
                                <button type="button" className="btn btn-danger" onClick={confirmDeleteMarca}>
                                    Eliminar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de confirmación para eliminar modelo */}
            {showDeleteModeloModal && (
                <div className="modal show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Confirmar Eliminación</h5>
                                <button type="button" className="btn-close" onClick={cancelDeleteModelo}></button>
                            </div>
                            <div className="modal-body">
                                <p>¿Está seguro que desea eliminar el modelo "<strong>{itemToDelete?.name}</strong>"?</p>
                                <p className="text-muted">Esta acción no se puede deshacer.</p>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={cancelDeleteModelo}>
                                    Cancelar
                                </button>
                                <button type="button" className="btn btn-danger" onClick={confirmDeleteModelo}>
                                    Eliminar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default MarcasYModelos;