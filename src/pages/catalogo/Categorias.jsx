import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Plus, Edit, Trash2, Tag } from 'lucide-react';
import { catalogoService } from '../../services/catalogoService';
import { useAuth } from '../../hooks/useAuth';
import { TableSkeleton, EmptyState, ErrorMessage } from '../../components/ui';
import { useConfirm } from '../../components/ui/ConfirmDialog';
import { notify } from '../../utils/notify';

export const Categorias = () => {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const confirm = useConfirm();
  const { user } = useAuth();
  const isAdmin = user?.rol === 'admin';

  const fetchCategorias = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await catalogoService.getCategorias();
      setCategorias(res.data?.items || res.data?.data || res.data || []);
    } catch (err) {
      setError('Error al cargar categorías');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategorias();
  }, []);

  const handleCreate = async () => {
    const nombre = window.prompt('Nombre de la nueva categoría:');
    if (!nombre) return;
    try {
      await catalogoService.createCategoria({ nombre });
      notify.success('Categoría creada exitosamente');
      fetchCategorias();
    } catch (err) {
      notify.error('Error al crear categoría');
    }
  };

  const handleEdit = async (categoria) => {
    const nombre = window.prompt('Editar nombre de la categoría:', categoria.nombre);
    if (!nombre || nombre === categoria.nombre) return;
    try {
      await catalogoService.updateCategoria(categoria.id, { nombre });
      notify.success('Categoría actualizada exitosamente');
      fetchCategorias();
    } catch (err) {
      notify.error('Error al actualizar categoría');
    }
  };

  const handleDelete = async (categoria) => {
    const confirmed = await confirm({
      title: '¿Eliminar categoría?',
      message: `Estás a punto de eliminar "${categoria.nombre}". Esta acción no se puede deshacer.`,
      confirmText: 'Eliminar',
      type: 'danger',
    });

    if (confirmed) {
      try {
        await catalogoService.deleteCategoria(categoria.id);
        notify.success('Categoría eliminada exitosamente');
        fetchCategorias();
      } catch (err) {
        notify.error('Error al eliminar categoría');
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
              <Tag size={22} className="text-primary-600" />
              Categorías
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">Gestiona las categorías del catálogo</p>
          </div>
        </div>
        {isAdmin && (
          <button onClick={handleCreate} className="btn btn-primary">
            <Plus size={16} /> Crear Categoría
          </button>
        )}
      </div>

      <div className="card">
        {error && <ErrorMessage message={error} onRetry={fetchCategorias} />}
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
            ) : categorias.length === 0 ? (
              <tr>
                <td colSpan="2" className="p-0">
                  <EmptyState
                    title="No hay categorías"
                    description="Comienza registrando una categoría para el catálogo."
                    icon={Tag}
                    action={
                      isAdmin && (
                        <button onClick={handleCreate} className="btn btn-primary">
                          <Plus size={16} /> Crear primera categoría
                        </button>
                      )
                    }
                  />
                </td>
              </tr>
            ) : (
              categorias.map(categoria => (
                <tr key={categoria.id} className="table-row-hover group">
                  <td className="px-6 py-4 font-medium text-gray-900">{categoria.nombre}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                      {isAdmin && (
                        <>
                          <button onClick={() => handleEdit(categoria)} className="btn-ghost p-2 rounded-lg" title="Editar">
                            <Edit size={16} className="text-blue-600" />
                          </button>
                          <button onClick={() => handleDelete(categoria)} className="btn-ghost p-2 rounded-lg" title="Eliminar">
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
