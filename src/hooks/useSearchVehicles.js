import { useState, useEffect } from 'react';
import { brandsModelsService } from '../services/marcasymodelos';
import useHome from './useHome';

export const useSearchVehicles = () => {
    const [vehicles, setVehicles] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { allVehicles } = useHome();

    // Load vehicles data from API
    useEffect(() => {
        const loadVehicles = async () => {
            try {
                console.log('🚀 Loading vehicles from API...');
                setLoading(true);
                setError(null);
                
                const data = await brandsModelsService.getVehicles();
                console.log('✅ Vehicles loaded from API:', data);
                setVehicles(data);
            } catch (error) {
                console.error('❌ Error loading vehicles:', error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        loadVehicles();
    }, []);

    // Get unique brands from allVehicles
    const availableBrands = vehicles ? vehicles.vehicles.filter(vehicle =>
        allVehicles.some(v => v.marca === vehicle.name)
    ) : [];

    // Get unique models for selected brand from allVehicles
    const getAvailableModels = (selectedBrand) => {
        if (!selectedBrand || !vehicles) return [];
        
        return selectedBrand.models.filter(model =>
            allVehicles.some(v => v.marca === selectedBrand.name && v.modelo === model)
        );
    };

    return {
        vehicles,
        loading,
        error,
        availableBrands,
        getAvailableModels,
        reloadVehicles: async () => {
            try {
                setLoading(true);
                const data = await brandsModelsService.getVehicles();
                setVehicles(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        }
    };
};
