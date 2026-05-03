import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Plus, Edit, Trash2, Tag } from 'lucide-react';
import { catalogoService } from '../../services/catalogoService';
import { useAuth } from '../../hooks/useAuth';
import { TableSkeleton, EmptyState, ErrorMessage, EntityModal } from '../../components/ui';
import { useConfirm } from '../../components/ui/ConfirmDialog';
import { notify } from '../../utils/notify';

export const Categorias = () => {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const confirm = useConfirm();
  const { user } = useAuth();
  const isAdmin = user?.rol === 'admin';

  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategoria, setEditingCategoria] = useState(null);
  const [saving, setSaving] = useState(false);

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

  const handleOpenCreate = () => {
    setEditingCategoria(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (categoria) => {
    setEditingCategoria(categoria);
    setModalOpen(true);
  };

  const handleSubmit = async (nombre) => {
    setSaving(true);
    if (editingCategoria) {
      await catalogoService.updateCategoria(editingCategoria.id, { nombre });
      notify.success('Categoría actualizada exitosamente');
    } else {
      await catalogoService.createCategoria({ nombre });
      notify.success('Categoría creada exitosamente');
    }
    fetchCategorias();
    setSaving(false);
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
            <h1 className="text-2xl font-bold text-[var(--text-primary)] flex items-center gap-2">
              <Tag size={22} className="text-primary-600" />
              Categorías
            </h1>
            <p className="text-sm text-[var(--text-muted)] mt-0.5">Gestiona las categorías del catálogo</p>
          </div>
        </div>
        {isAdmin && (
          <button onClick={handleOpenCreate} className="btn btn-primary">
            <Plus size={16} /> Crear Categoría
          </button>
        )}
      </div>

      <div className="card">
        {error && <ErrorMessage message={error} onRetry={fetchCategorias} />}
        <table className="w-full text-left text-sm">
          <thead className="bg-[var(--bg-base)]/50 text-xs uppercase text-[var(--text-muted)] border-b border-[var(--border-color)]">
            <tr>
              <th className="px-6 py-3.5 font-semibold">Nombre</th>
              <th className="px-6 py-3.5 font-semibold text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-color)]">
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
                        <button onClick={handleOpenCreate} className="btn btn-primary">
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
                  <td className="px-6 py-4 font-medium text-[var(--text-primary)]">{categoria.nombre}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                      {isAdmin && (
                        <>
                          <button onClick={() => handleOpenEdit(categoria)} className="btn-ghost p-2 rounded-lg" title="Editar">
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

        <EntityModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSubmit={handleSubmit}
          initialData={editingCategoria}
          entityType="categoria"
          loading={saving}
        />
      </div>
    );
  };
