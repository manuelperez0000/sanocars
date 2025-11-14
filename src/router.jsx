import { Route, Routes } from "react-router-dom"
import Home from "./pages/home"
import VehicleDetail from './pages/VehicleDetail'
import Vehicles from './pages/Vehicles'
import Login from './pages/Login'
import Dashboard from './pages/dashboard'
import AdminLayout from "./components/adminLayout"
import Services from "./pages/services"
import Contact from "./pages/Contact"
import Financiamiento from "./pages/Financiamiento"
import Empresa from "./pages/Empresa"
import PageLayout from "./components/PageLayout"
import Service from "./pages/service"

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
            <Route path="/dashboard" element={<AdminLayout><Dashboard /></AdminLayout>} />
        </Routes>
    </>
}
export default Router
