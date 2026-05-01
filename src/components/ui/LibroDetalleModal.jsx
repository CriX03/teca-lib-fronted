import { X, BookOpen, Tag, Users, Building2, Calendar, FileText, CheckCircle, XCircle } from 'lucide-react';

export const LibroDetalleModal = ({ isOpen, onClose, libro, loading }) => {
  if (!isOpen || !libro) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={handleBackdropClick}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in" />
      
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden animate-scale-in flex flex-col">
        <div className="flex justify-between items-center p-5 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-primary-100 flex items-center justify-center">
              <BookOpen size={18} className="text-primary-600" />
            </div>
            <h2 className="text-base font-semibold text-gray-900">Detalles del Libro</h2>
          </div>
          <button onClick={onClose} className="btn-ghost p-2 rounded-lg text-gray-400 hover:text-gray-600" disabled={loading}>
            <X size={18} />
          </button>
        </div>
        
        <div className="p-5 overflow-y-auto flex-1 space-y-5">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <svg className="animate-spin h-8 w-8 text-primary-600" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            </div>
          ) : (
            <>
              <div className="text-center pb-4 border-b border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 leading-tight">{libro.titulo}</h3>
                {libro.isbn && (
                  <p className="text-sm text-gray-500 mt-1.5">
                    ISBN: <code className="bg-gray-100 px-2 py-0.5 rounded text-gray-700">{libro.isbn}</code>
                  </p>
                )}
                <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium">
                  {libro.disponible !== false && libro.disponibilidad !== false ? (
                    <span className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-700 rounded-full">
                      <CheckCircle size={14} />
                      Disponible
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-700 rounded-full">
                      <XCircle size={14} />
                      Prestado
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <DetailItem
                    icon={Users}
                    label="Autor"
                    value={libro.autor?.nombre || libro.autor_nombre || libro.autor_id || 'No especificado'}
                  />
                  <DetailItem
                    icon={Building2}
                    label="Editorial"
                    value={libro.editorial?.nombre || libro.editorial_nombre || libro.editorial_id || 'No especificado'}
                  />
                  <DetailItem
                    icon={Tag}
                    label="Categoría"
                    value={libro.categoria?.nombre || libro.categoria_nombre || libro.categoria_id || 'No especificado'}
                  />
                  <DetailItem
                    icon={Calendar}
                    label="Fecha de Publicación"
                    value={libro.fecha_publicacion 
                      ? new Date(libro.fecha_publicacion).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })
                      : 'No especificada'}
                  />
                </div>

                {libro.descripcion && (
                  <div className="pt-2">
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                      <FileText size={16} className="text-gray-400" />
                      Descripción
                    </div>
                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 text-sm text-gray-600 leading-relaxed">
                      {libro.descripcion}
                    </div>
                  </div>
                )}

                <div className="pt-2 text-xs text-gray-400 text-center">
                  <span>ID: {libro.id}</span>
                  {libro.created_at && (
                    <span className="ml-2">
                      • Registrado: {new Date(libro.created_at).toLocaleDateString('es-ES')}
                    </span>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
        
        <div className="p-5 border-t border-gray-100 flex-shrink-0">
          <button onClick={onClose} className="btn btn-primary w-full">
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

const DetailItem = ({ icon: Icon, label, value }) => (
  <div className="flex items-start gap-3">
    <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0 mt-0.5">
      <Icon size={16} className="text-gray-500" />
    </div>
    <div>
      <p className="text-xs text-gray-500 font-medium">{label}</p>
      <p className="text-sm text-gray-900 font-medium">{value}</p>
    </div>
  </div>
);