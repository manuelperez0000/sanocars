

import React, { useState } from 'react';
import { FaCar, FaShoppingCart, FaTools, FaKey, FaClock, FaCaretDown, FaCreditCard } from 'react-icons/fa';
import SegVentas from '../../components/segVentas';
import SegAlquileres from '../../components/segAlquileres';
import SegShaken from '../../components/segShaken';
import useSeguimiento from '../../hooks/useSeguimiento';
import SegServicios from '../../components/segServicios';

const Seguimiento = () => {
  const [activeTab, setActiveTab] = useState('venta-vehiculo');
  const { vehicles, loading, error, updateQuotaStatus } = useSeguimiento();

  const tabs = [
    {
      id: 'venta-vehiculo',
      title: 'Venta de vehiculo',
      icon: <FaCar className="me-2" />
    },
    {
      id: 'pagos-alquiler',
      title: 'Pagos de alquiler',
      icon: <FaClock className="me-2" />
    },
    {
      id: 'shaken',
      title: 'Shaken',
      icon: <FaKey className="me-2" />
    },
    {
      id: 'servicios',
      title: 'Pagos de servicios',
      icon: <FaCreditCard className="me-2" />
    }
  ];
 
  const renderTabContent = () => {
    switch (activeTab) {
      case 'venta-vehiculo':
        return <SegVentas vehicles={vehicles} loading={loading} error={error} updateQuotaStatus={updateQuotaStatus} />;
      case 'pagos-alquiler':
        return <SegAlquileres />;
      case 'shaken':
        return <SegShaken />;
      case 'servicios':
        return <SegServicios />;
      default:
        return <SegVentas vehicles={vehicles} loading={loading} error={error} />;
    }
  };

  return (
    <div className='m-0 p-3'>
      <div className="container-fluid">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3 className="text-dark fw-bold" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}>
            Seguimiento de pagos y shaken
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
        <div className="pt-3">
            {renderTabContent()}
         </div>
      </div>
    </div>
  )
}

export default Seguimiento
