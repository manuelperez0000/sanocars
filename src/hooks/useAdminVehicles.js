import { useState, useEffect } from 'react';
import { brandsModelsService } from '../services/marcasymodelos';

export const useAdminVehicles = () => {
    const [vehicles, setVehicles] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Load vehicles data from API
    useEffect(() => {
        const loadVehicles = async () => {
            try {
                console.log('🚀 Loading vehicles for admin...');
                setLoading(true);
                setError(null);
                
                const data = await brandsModelsService.getVehicles();
                console.log('✅ Vehicles loaded for admin:', data);
                setVehicles(data);
            } catch (error) {
                console.error('❌ Error loading vehicles for admin:', error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        loadVehicles();
    }, []);

    // Get models for selected brand (replaces objVehicles.vehicles.find)
    const getModelsForBrand = (brand) => {
        if (!vehicles || !vehicles.vehicles) return [];
        
        const vehicle = vehicles.vehicles.find(v => v.name === brand);
        return vehicle ? vehicle.models : [];
    };

    // Get all brands (replaces objVehicles.vehicles.map)
    const getAllBrands = () => {
        return vehicles ? vehicles.vehicles : [];
    };

    return {
        vehicles,
        loading,
        error,
        getModelsForBrand,
        getAllBrands,
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
