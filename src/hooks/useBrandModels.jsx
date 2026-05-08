import { useState, useEffect, useRef } from 'react';
import { brandsService, modelsService, brandsModelsService } from '../services/marcasymodelos';

export const useBrandModels = () => {
    // Estados para marcas
    const [showModal, setShowModal] = useState(false);
    const [newMarca, setNewMarca] = useState('');
    const [marcas, setMarcas] = useState([]);
    const [editingMarca, setEditingMarca] = useState(null);
    const [editText, setEditText] = useState('');
    const [loading, setLoading] = useState(false);
    
    // Estados para modelos
    const [selectedMarca, setSelectedMarca] = useState('');
    const [modelos, setModelos] = useState([]);
    const [showModeloModal, setShowModeloModal] = useState(false);
    const [newModelo, setNewModelo] = useState('');
    const [editingModelo, setEditingModelo] = useState(null);
    const [editModeloText, setEditModeloText] = useState('');
    
    // Refs para autofocus
    const marcaInputRef = useRef(null);
    const modeloInputRef = useRef(null);
    
    // Estados para modales de confirmación
    const [showDeleteMarcaModal, setShowDeleteMarcaModal] = useState(false);
    const [showDeleteModeloModal, setShowDeleteModeloModal] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);

    // Función para recargar datos desde la API
    const reloadBrandsAndModels = async () => {
        try {
            const brandsData = await brandsModelsService.getBrandsWithModels();
            console.log('✅ Brands and models loaded:', brandsData);
            setMarcas(brandsData);
            
            // Extraer todos los modelos de las marcas
            const allModels = [];
            brandsData.forEach(brand => {
                if (brand.models && Array.isArray(brand.models)) {
                    brand.models.forEach(model => {
                        allModels.push({
                            ...model,
                            brand_id: brand.id
                        });
                    });
                }
            });
            setModelos(allModels);
            return brandsData;
        } catch (error) {
            console.error('Error reloading data:', error);
            throw error;
        }
    };

    // Cargar marcas y modelos desde la API al montar el componente
    useEffect(() => {
        const loadData = async () => {
            try {
                console.log('🚀 Starting to load brands and models data...');
                setLoading(true);
                await reloadBrandsAndModels();
                console.log('✅ Brands and models loaded successfully');
            } catch (error) {
                console.error('❌ Error loading data:', error);
                alert('Error al cargar las marcas y modelos: ' + error.message);
            } finally {
                setLoading(false);
            }
        };
        
        loadData();
    }, []);

    // Autofocus para modal de marca
    useEffect(() => {
        if (showModal && marcaInputRef.current) {
            setTimeout(() => {
                marcaInputRef.current.focus();
            }, 100);
        }
    }, [showModal]);

    // Autofocus para modal de modelo
    useEffect(() => {
        if (showModeloModal && modeloInputRef.current) {
            setTimeout(() => {
                modeloInputRef.current.focus();
            }, 100);
        }
    }, [showModeloModal]);

    // Handlers para marcas
    const handleOpenModal = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setNewMarca('');
        setEditingMarca(null);
        setEditText('');
    };

    const handleSaveMarca = async () => {
        if (newMarca.trim()) {
            try {
                setLoading(true);
                await brandsService.create({ name: newMarca.trim() });
                await reloadBrandsAndModels();
                handleCloseModal();
            } catch (error) {
                console.error('Error saving brand:', error);
                alert('Error al guardar la marca: ' + error.message);
            } finally {
                setLoading(false);
            }
        }
    };

    const handleEditMarca = (index) => {
        console.log('🔧 Editando marca:', { index, marca: marcas[index] });
        setEditingMarca(index);
        setEditText(marcas[index].brand_name);
    };

    const handleUpdateMarca = async () => {
        if (editText.trim() && editingMarca !== null) {
            try {
                setLoading(true);
                await brandsService.update(marcas[editingMarca].id, { 
                    name: editText.trim() 
                });
                await reloadBrandsAndModels();
                setEditingMarca(null);
                setEditText('');
            } catch (error) {
                console.error('Error updating brand:', error);
                alert('Error al actualizar la marca: ' + error.message);
            } finally {
                setLoading(false);
            }
        }
    };

    const handleDeleteMarca = async (index) => {
        const marcaAEliminar = marcas[index];
        
        try {
            const hasModels = await brandsModelsService.brandHasModels(marcaAEliminar.id);
            
            if (hasModels) {
                const modelosAsociados = modelos.filter(modelo => modelo.brand_id === marcaAEliminar.id);
                alert(`No se puede eliminar la marca "${marcaAEliminar.name}" porque tiene ${modelosAsociados.length} modelo(s) asociado(s). Primero elimine todos los modelos de esta marca.`);
                return;
            }
            
            setItemToDelete({ type: 'marca', index, id: marcaAEliminar.id, name: marcaAEliminar.name });
            setShowDeleteMarcaModal(true);
        } catch (error) {
            console.error('Error checking brand models:', error);
            alert('Error al verificar modelos asociados');
        }
    };

    const confirmDeleteMarca = async () => {
        if (itemToDelete && itemToDelete.type === 'marca') {
            try {
                setLoading(true);
                await brandsService.delete(itemToDelete.id);
                await reloadBrandsAndModels();
                setShowDeleteMarcaModal(false);
                setItemToDelete(null);
            } catch (error) {
                console.error('Error deleting brand:', error);
                alert('Error al eliminar la marca: ' + error.message);
            } finally {
                setLoading(false);
            }
        }
    };

    const cancelDeleteMarca = () => {
        setShowDeleteMarcaModal(false);
        setItemToDelete(null);
    };

    // Handlers para modelos
    const handleOpenModeloModal = () => {
        if (selectedMarca) {
            setShowModeloModal(true);
        }
    };

    const handleCloseModeloModal = () => {
        setShowModeloModal(false);
        setNewModelo('');
        setEditingModelo(null);
        setEditModeloText('');
    };

    const handleSaveModelo = async () => {
        if (newModelo.trim() && selectedMarca) {
            try {
                setLoading(true);
                await modelsService.create({
                    name: newModelo.trim(),
                    brand_id: parseInt(selectedMarca)
                });
                await reloadBrandsAndModels();
                handleCloseModeloModal();
            } catch (error) {
                console.error('Error saving model:', error);
                alert('Error al guardar el modelo: ' + error.message);
            } finally {
                setLoading(false);
            }
        }
    };

    const handleEditModelo = (index) => {
        setEditingModelo(index);
        setEditModeloText(modelos[index].name);
    };

    const handleUpdateModelo = async () => {
        if (editModeloText.trim() && editingModelo !== null) {
            try {
                setLoading(true);
                await modelsService.update(modelos[editingModelo].id, {
                    name: editModeloText.trim()
                });
                await reloadBrandsAndModels();
                setEditingModelo(null);
                setEditModeloText('');
            } catch (error) {
                console.error('Error updating model:', error);
                alert('Error al actualizar el modelo: ' + error.message);
            } finally {
                setLoading(false);
            }
        }
    };

    const handleDeleteModelo = (index) => {
        const modeloAEliminar = modelos[index];
        setItemToDelete({ type: 'modelo', index, id: modeloAEliminar.id, name: modeloAEliminar.name });
        setShowDeleteModeloModal(true);
    };

    const confirmDeleteModelo = async () => {
        if (itemToDelete && itemToDelete.type === 'modelo') {
            try {
                setLoading(true);
                await modelsService.delete(itemToDelete.id);
                await reloadBrandsAndModels();
                setShowDeleteModeloModal(false);
                setItemToDelete(null);
            } catch (error) {
                console.error('Error deleting model:', error);
                alert('Error al eliminar el modelo: ' + error.message);
            } finally {
                setLoading(false);
            }
        }
    };

    const cancelDeleteModelo = () => {
        setShowDeleteModeloModal(false);
        setItemToDelete(null);
    };

    // Filtrar modelos por marca seleccionada
    const modelosFiltrados = selectedMarca 
        ? modelos.filter(modelo => modelo.brand_id === parseInt(selectedMarca))
        : [];

    return {
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
        
        // Estado de carga
        loading,
        
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
    };
};
