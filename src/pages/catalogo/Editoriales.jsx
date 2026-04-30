import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Plus, Edit, Trash2, Building2 } from 'lucide-react';
import { catalogoService } from '../../services/catalogoService';
import { useAuth } from '../../hooks/useAuth';
import { TableSkeleton, EmptyState, ErrorMessage } from '../../components/ui';
import { useConfirm } from '../../components/ui/ConfirmDialog';
import { notify } from '../../utils/notify';

export const Editoriales = () => {
  const [editoriales, setEditoriales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const confirm = useConfirm();
  const { user } = useAuth();
  const isAdmin = user?.rol === 'admin';

  const fetchEditoriales = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await catalogoService.getEditoriales();
      setEditoriales(res.data?.items || res.data?.data || res.data || []);
    } catch (err) {
      setError('Error al cargar editoriales');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEditoriales();
  }, []);

  const handleCreate = async () => {
    const nombre = window.prompt('Nombre de la nueva editorial:');
    if (!nombre) return;
    try {
      await catalogoService.createEditorial({ nombre });
      notify.success('Editorial creada exitosamente');
      fetchEditoriales();
    } catch (err) {
      notify.error('Error al crear editorial');
    }
  };

  const handleEdit = async (editorial) => {
    const nombre = window.prompt('Editar nombre de la editorial:', editorial.nombre);
    if (!nombre || nombre === editorial.nombre) return;
    try {
      await catalogoService.updateEditorial(editorial.id, { nombre });
      notify.success('Editorial actualizada exitosamente');
      fetchEditoriales();
    } catch (err) {
      notify.error('Error al actualizar editorial');
    }
  };

  const handleDelete = async (editorial) => {
    const confirmed = await confirm({
      title: '¿Eliminar editorial?',
      message: `Estás a punto de eliminar "${editorial.nombre}". Esta acción no se puede deshacer.`,
      confirmText: 'Eliminar',
      type: 'danger',
    });

    if (confirmed) {
      try {
        await catalogoService.deleteEditorial(editorial.id);
        notify.success('Editorial eliminada exitosamente');
        fetchEditoriales();
      } catch (err) {
        notify.error('Error al eliminar editorial');
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/catalogo" className="btn-ghost p-2 rounded-lg">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Building2 size={22} className="text-primary-600" />
              Editoriales
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">Gestiona las editoriales del catálogo</p>
          </div>
        </div>
        {isAdmin && (
          <button onClick={handleCreate} className="btn btn-primary">
            <Plus size={16} /> Crear Editorial
          </button>
        )}
      </div>

      <div className="card">
        {error && <ErrorMessage message={error} onRetry={fetchEditoriales} />}
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50/80 text-xs uppercase text-gray-500 border-b border-gray-100">
            <tr>
              <th className="px-6 py-3.5 font-semibold">Nombre</th>
              <th className="px-6 py-3.5 font-semibold text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              <tr>
                <td colSpan="2" className="p-0">
                  <TableSkeleton rows={4} cols={2} />
                </td>
              </tr>
            ) : editoriales.length === 0 ? (
              <tr>
                <td colSpan="2" className="p-0">
                  <EmptyState
                    title="No hay editoriales"
                    description="Comienza registrando una editorial para el catálogo."
                    icon={Building2}
                    action={
                      isAdmin && (
                        <button onClick={handleCreate} className="btn btn-primary">
                          <Plus size={16} /> Crear primera editorial
                        </button>
                      )
                    }
                  />
                </td>
              </tr>
            ) : (
              editoriales.map(editorial => (
                <tr key={editorial.id} className="table-row-hover group">
                  <td className="px-6 py-4 font-medium text-gray-900">{editorial.nombre}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                      {isAdmin && (
                        <>
                          <button onClick={() => handleEdit(editorial)} className="btn-ghost p-2 rounded-lg" title="Editar">
                            <Edit size={16} className="text-blue-600" />
                          </button>
                          <button onClick={() => handleDelete(editorial)} className="btn-ghost p-2 rounded-lg" title="Eliminar">
                            <Trash2 size={16} className="text-red-500" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
