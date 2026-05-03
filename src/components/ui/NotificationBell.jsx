/**
 * NotificationBell.jsx - Campana de notificaciones con dropdown
 * 
 * Este componente muestra un icono de campana en el header con un badge
 * que indica el número de notificaciones no leídas. Al hacer click,
 * despliega un dropdown con la lista de notificaciones recientes.
 * 
 * @author Teca Biblioteca
 * @version 1.0.0
 */

import { useState, useEffect, useRef } from 'react';
import { Bell, Check, Trash2, Clock, AlertTriangle, Info, X } from 'lucide-react';
import { notificacionesService } from '../../services/notificacionesService';

/**
 * Obtiene el icono según el tipo de notificación
 * @param {string} tipo - Tipo de notificación
 * @returns {JSX.Element} Componente de icono
 */
const getIconByTipo = (tipo) => {
  switch (tipo) {
    case 'alerta':
      return <AlertTriangle size={14} className="text-amber-500" />;
    case 'recordatorio':
      return <Clock size={14} className="text-blue-500" />;
    default:
      return <Info size={14} className="text-emerald-500" />;
  }
};

/**
 * Componente NotificationBell
 * @returns {JSX.Element} Componente de campana de notificaciones
 */
export const NotificationBell = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notificaciones, setNotificaciones] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef(null);

  useEffect(() => {
    loadNotificaciones();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const loadNotificaciones = () => {
    const historial = notificacionesService.getHistorial();
    const count = notificacionesService.getUnreadCount();
    setNotificaciones(historial);
    setUnreadCount(count);
  };

  const handleToggle = () => {
    if (!isOpen) {
      loadNotificaciones();
    }
    setIsOpen(!isOpen);
  };

  const handleMarkAsRead = (id) => {
    notificacionesService.marcarLeida(id);
    loadNotificaciones();
  };

  const handleMarkAllAsRead = () => {
    notificacionesService.marcarTodasLeidas();
    loadNotificaciones();
  };

  const handleClearAll = () => {
    notificacionesService.limpiarHistorial();
    loadNotificaciones();
  };

  const formatTime = (createdAt) => {
    if (!createdAt) return '';
    
    const date = new Date(createdAt);
    const now = new Date();
    const diff = now - date;
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return 'Ahora';
    if (minutes < 60) return `Hace ${minutes}m`;
    if (hours < 24) return `Hace ${hours}h`;
    if (days < 7) return `Hace ${days}d`;
    
    return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={handleToggle}
        className={`
          relative p-2 rounded-lg transition-all duration-200
          ${isOpen ? 'bg-gray-100 text-gray-700' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'}
        `}
        title="Notificaciones"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-50 animate-fade-in">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50/50">
            <h3 className="font-semibold text-gray-900">Notificaciones</h3>
            <div className="flex items-center gap-1">
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                  title="Marcar todo como leído"
                >
                  <Check size={14} />
                </button>
              )}
              <button
                onClick={handleClearAll}
                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Limpiar todo"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notificaciones.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                  <Bell size={20} className="text-gray-400" />
                </div>
                <p className="text-sm text-gray-500">No hay notificaciones</p>
                <p className="text-xs text-gray-400 mt-1">
                  Recibirás alertas sobre tus préstamos
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {notificaciones.slice(0, 10).map((notif) => (
                  <div
                    key={notif.id}
                    className={`
                      px-4 py-3 hover:bg-gray-50/50 transition-colors cursor-pointer
                      ${notif.leida ? 'bg-white' : 'bg-primary-50/30'}
                    `}
                    onClick={() => handleMarkAsRead(notif.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 flex-shrink-0">
                        {getIconByTipo(notif.tipo)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {notif.titulo || 'Notificación'}
                        </p>
                        <p className="text-xs text-gray-500 line-clamp-2 mt-0.5">
                          {notif.mensaje}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {formatTime(notif.createdAt)}
                        </p>
                      </div>
                      {!notif.leida && (
                        <div className="mt-1.5 flex-shrink-0">
                          <div className="w-2 h-2 rounded-full bg-primary-500" />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {notificaciones.length > 0 && (
            <div className="px-4 py-2 border-t border-gray-100 bg-gray-50/30">
              <p className="text-xs text-center text-gray-400">
                {notificaciones.length} notificación{notificaciones.length > 1 ? 's' : ''} en total
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};