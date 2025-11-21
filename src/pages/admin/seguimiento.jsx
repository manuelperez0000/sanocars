

import React, { useState } from 'react';
import { FaCar, FaShoppingCart, FaTools, FaKey } from 'react-icons/fa';

const Seguimiento = () => {
  const [activeTab, setActiveTab] = useState('venta-vehiculo');

  const tabs = [
    {
      id: 'venta-vehiculo',
      title: 'Venta de vehiculo',
      icon: <FaCar className="me-2" />,
      content: 'Contenido para seguimiento de ventas de vehículos'
    },
    {
      id: 'venta-producto',
      title: 'Venta de producto',
      icon: <FaShoppingCart className="me-2" />,
      content: 'Contenido para seguimiento de ventas de productos'
    },
    {
      id: 'pagos-servicios',
      title: 'Pagos de servicios',
      icon: <FaTools className="me-2" />,
      content: 'Contenido para seguimiento de pagos de servicios'
    },
    {
      id: 'pagos-alquiler',
      title: 'Pagos de alquiler',
      icon: <FaKey className="me-2" />,
      content: 'Contenido para seguimiento de pagos de alquiler'
    }
  ];

  return (
    <div className='m-0 p-3'>
      <div className="container-fluid">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3 className="text-dark fw-bold" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}>
            Seguimiento de pagos
          </h3>
        </div>

        {/* Navigation Tabs */}
        <div className="card border-0 shadow-lg mb-2"
             style={{
               background: 'rgba(255, 255, 255, 0)',
               backdropFilter: 'blur(10px)',
               borderRadius: '15px'
             }}>
          <div className="card-body p-0">
            <ul className="nav nav-tabs nav-fill" id="seguimientoTabs" role="tablist">
              {tabs.map((tab) => (
                <li key={tab.id} className="nav-item" role="presentation">
                  <button
                    className={`nav-link ${activeTab === tab.id ? 'active' : ''}`}
                    id={`${tab.id}-tab`}
                    type="button"
                    role="tab"
                    aria-controls={`${tab.id}-tab-pane`}
                    aria-selected={activeTab === tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    style={{
                      border: 'none',
                      borderRadius: '0',
                      fontWeight: 'bold',
                      color: activeTab === tab.id ? '#495057' : '#6c757d',
                      backgroundColor: activeTab === tab.id ? '#fff' : 'transparent'
                    }}
                  >
                    {tab.icon}
                    {tab.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Tab Content */}
        <div className="tab-content" id="seguimientoTabsContent">
          {tabs.map((tab) => (
            <div
              key={tab.id}
              className={`tab-pane fade ${activeTab === tab.id ? 'show active' : ''}`}
              id={`${tab.id}-tab-pane`}
              role="tabpanel"
              aria-labelledby={`${tab.id}-tab`}
              tabIndex="0"
            >
              <div className="card border-0 shadow-lg"
                   style={{
                     background: 'rgba(255, 255, 255, 0.95)',
                     backdropFilter: 'blur(10px)',
                     borderRadius: '15px'
                   }}>
                <div className="card-body p-4">
                  <div className="text-center py-5">
                    <div className="mb-4">
                      {React.cloneElement(tab.icon, { size: 80, className: 'text-primary' })}
                    </div>
                    <h4 className="card-title mb-3">{tab.title}</h4>
                    <p className="text-muted">{tab.content}</p>
                    {/* Aquí irá el contenido específico de cada sección */}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Seguimiento
