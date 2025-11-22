import { Route, Routes } from "react-router-dom"
import Home from "./pages/home"
import VehicleDetail from './pages/VehicleDetail'
import Vehicles from './pages/Vehicles'
import Login from './pages/Login'
import Dashboard from './pages/admin/dashboard'
import AdminLayout from "./components/adminLayout"
import Services from "./pages/services"
import Contact from "./pages/Contact"
import Financiamiento from "./pages/Financiamiento"
import Empresa from "./pages/Empresa"
import PageLayout from "./components/PageLayout"
import Service from "./pages/service"
import Usuarios from "./pages/admin/usuarios"
import AdminFinanciamiento from "./pages/admin/financiamiento"
import FinancingDetail from "./pages/admin/FinancingDetail"
import AdminVehiculos from "./pages/admin/vehiculos"
import AdminServicios from "./pages/admin/servicios"
import Imagenes from "./pages/admin/imagenes"

// New imports for added admin pages
import Inventario from "./pages/admin/inventario"
import Seguimiento from "./pages/admin/seguimiento"
import InspeccionVehicular from "./pages/admin/inspeccionVehicular"
import InformeVehiculos from "./pages/admin/informeVehiculos"
import Facturacion from "./pages/admin/facturacion"
import Facturas from "./pages/admin/facturas"
import NuevoInformeVehiculos from "./pages/admin/nuevoInformeVehiculos"
import CategoriasServicio from "./pages/admin/categoriasServicio"
import Configuracion from "./pages/admin/configuracion"
import Reservas from "./pages/admin/reservas"
const Router = () => {
    return <>
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/vehiculos" element={<PageLayout><Vehicles /></PageLayout>} />
            <Route path="/financiamiento" element={<PageLayout><Financiamiento /></PageLayout>} />
            <Route path="/empresa" element={<PageLayout><Empresa /></PageLayout>} />
            <Route path="/contacto" element={<PageLayout><Contact /></PageLayout>} />
            <Route path="/vehiculo/:id" element={<VehicleDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/services" element={<PageLayout><Services /></PageLayout>} />
            <Route path="/service/:id" element={<PageLayout><Service /></PageLayout>} />
            
            {/* Admin */}
            
            <Route path="/admin/dashboard" element={<AdminLayout><Dashboard /></AdminLayout>} />
            <Route path="/admin/reservas" element={<AdminLayout><Reservas /></AdminLayout>} />
            <Route path="/admin/facturacion" element={<AdminLayout><Facturacion /></AdminLayout>} />
            <Route path="/admin/facturas" element={<AdminLayout><Facturas /></AdminLayout>} />
            <Route path="/admin/usuarios" element={<AdminLayout><Usuarios /></AdminLayout>} />
            <Route path="/admin/financiamiento" element={<AdminLayout><AdminFinanciamiento /></AdminLayout>} />
            <Route path="/admin/financiamiento/:id" element={<AdminLayout><FinancingDetail /></AdminLayout>} />
            <Route path="/admin/vehiculos" element={<AdminLayout><AdminVehiculos /></AdminLayout>} />
            <Route path="/admin/servicios" element={<AdminLayout><AdminServicios /></AdminLayout>} />
            <Route path="/admin/imagenes" element={<AdminLayout><Imagenes /></AdminLayout>} />
            
            <Route path="/admin/inventario" element={<AdminLayout><Inventario /></AdminLayout>} />
            <Route path="/admin/seguimiento" element={<AdminLayout><Seguimiento /></AdminLayout>} />
            <Route path="/admin/inspeccion-vehicular" element={<AdminLayout><InspeccionVehicular /></AdminLayout>} />
            <Route path="/admin/informe-vehiculos" element={<AdminLayout><InformeVehiculos /></AdminLayout>} />
            <Route path="/admin/informe-vehiculos/nuevo" element={<AdminLayout><NuevoInformeVehiculos /></AdminLayout>} />
            <Route path="/admin/categorias-servicio" element={<AdminLayout><CategoriasServicio /></AdminLayout>} />
            <Route path="/admin/configuracion" element={<AdminLayout><Configuracion /></AdminLayout>} />
            <Route path="/*" element={<> <h1 className="text-center mt-5 pt-5"> 404 NOT FOUND</h1> <hr /> </>} />
        </Routes>
    </>
}

export default Router
