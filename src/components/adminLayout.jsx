import Sidebar from "./sidebar"

const AdminLayout = ({ children }) => {
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
