import Sidebar from "./sidebar"
import { Navigate } from 'react-router-dom'

const AdminLayout = ({ children }) => {
    // Check localStorage for stored user object and token
    let hasToken = false
    try {
        const raw = localStorage.getItem('user')
        if (raw) {
            const parsed = JSON.parse(raw)
            // expected shape: { token, user }
            if (parsed && parsed.token) {
                hasToken = true
            } else if (parsed && parsed.user && parsed.user.token) {
                hasToken = true
            }
        }
    } catch (err) {
        // log parsing errors in dev, ensure we treat as unauthenticated
        console.warn('adminLayout token parse error', err)
        hasToken = false
    }

    if (!hasToken) {
        // don't render admin UI if not authenticated; redirect to home
        return <Navigate to="/" replace />
    }

    return <div className="container-fluid p-0">
        <div className="row m-0">
            <div className="col-12 col-md-3 col-lg-2 p-0">
                <div className="position-sticky" style={{ top: '0', height: '100vh', overflowY: 'auto' }}>
                    <Sidebar />
                </div>
            </div>
            <main className="col-12 col-md-9 col-lg-10">
                {children}
            </main>
        </div>
    </div>
}

export default AdminLayout
