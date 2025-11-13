import { Route, Routes } from "react-router-dom"
import Home from "./pages/home"
import VehicleDetail from './pages/VehicleDetail'
import Login from './pages/Login'
import Dashboard from './pages/dashboard'
import AdminLayout from "./components/adminLayout"
import Services from "./pages/services"
import Contact from "./pages/Contact"
import Financiamiento from "./pages/Financiamiento"
import PageLayout from "./components/PageLayout"


const Router = () => {
    return <>
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/financiamiento" element={<PageLayout><Financiamiento /></PageLayout>} />
            <Route path="/contacto" element={<PageLayout><Contact /></PageLayout>} />
            <Route path="/vehiculo/:id" element={<VehicleDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/services" element={<PageLayout><Services /></PageLayout>} />
            <Route path="/dashboard" element={<AdminLayout><Dashboard /></AdminLayout>} />
        </Routes>
    </>
}
export default Router
