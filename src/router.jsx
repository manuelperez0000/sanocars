import { Route, Routes } from "react-router-dom"
import Home from "./pages/home"
import VehicleDetail from './pages/VehicleDetail'
import Login from './pages/Login'
import Dashboard from './pages/dashboard'
import AdminLayout from "./components/adminLayout"

const Financiamiento = () => (
    <div className="container py-5">
        <h2>Financiamiento</h2>
        <p>Información sobre opciones de financiamiento para tu vehículo.</p>
    </div>
)

const Contacto = () => (
    <div className="container py-5">
        <h2>Contacto</h2>
        <p>Escríbenos o visítanos para más información.</p>
    </div>
)

const Router = () => {
    return <>
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/financiamiento" element={<Financiamiento />} />
            <Route path="/contacto" element={<Contacto />} />
            <Route path="/vehiculo/:id" element={<VehicleDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<AdminLayout><Dashboard /></AdminLayout>} />
        </Routes>
    </>
}
export default Router