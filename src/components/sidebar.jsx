const Sidebar = () => {
    const SidebarButton = ({ children, active = false }) => (
        <button className={`list-group-item list-group-item-action ${active ? 'active' : ''}`} style={{ borderRadius: 8 }}>
            {children}
        </button>
    )
    return <aside className="col-12 col-md-3 col-lg-2 p-4 dashboard-sidebar">
        <h5 className="text-white mb-3">Panel</h5>
        <div className="list-group">
            <SidebarButton>Dashboard</SidebarButton>
            <SidebarButton>Usuarios</SidebarButton>
            <SidebarButton>Financiamiento</SidebarButton>
            <SidebarButton>Vehículos</SidebarButton>
            <SidebarButton>Servicios</SidebarButton>
        </div>
    </aside>
}
export default Sidebar