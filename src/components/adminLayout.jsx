import Sidebar from "./sidebar"

const AdminLayout = ({ children }) => {
    return <>
        <Sidebar />
        <main className="col-12 col-md-9 col-lg-10 p-4 dashboard-main">
            {children}
        </main>
    </>

}

export default AdminLayout