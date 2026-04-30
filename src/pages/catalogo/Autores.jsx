import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Plus, Edit, Trash2, Users } from 'lucide-react';
import { catalogoService } from '../../services/catalogoService';
import { useAuth } from '../../hooks/useAuth';
import { TableSkeleton, EmptyState, ErrorMessage, EntityModal } from '../../components/ui';
import { useConfirm } from '../../components/ui/ConfirmDialog';
import { notify } from '../../utils/notify';

export const Autores = () => {
  const [autores, setAutores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const confirm = useConfirm();
  const { user } = useAuth();
  const isAdmin = user?.rol === 'admin';

  const [modalOpen, setModalOpen] = useState(false);
  const [editingAutor, setEditingAutor] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetchAutores = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await catalogoService.getAutores();
      setAutores(res.data?.items || res.data?.data || res.data || []);
    } catch (err) {
      setError('Error al cargar autores');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAutores();
  }, []);

  const handleOpenCreate = () => {
    setEditingAutor(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (autor) => {
    setEditingAutor(autor);
    setModalOpen(true);
  };

  const handleSubmit = async (nombre) => {
    setSaving(true);
    if (editingAutor) {
      await catalogoService.updateAutor(editingAutor.id, { nombre });
      notify.success('Autor actualizado exitosamente');
    } else {
      await catalogoService.createAutor({ nombre });
      notify.success('Autor creado exitosamente');
    }
    fetchAutores();
    setSaving(false);
  };

  const handleDelete = async (autor) => {
    const confirmed = await confirm({
      title: '¿Eliminar autor?',
      message: `Estás a punto de eliminar "${autor.nombre}". Esta acción no se puede deshacer.`,
      confirmText: 'Eliminar',
      type: 'danger',
    });

    if (confirmed) {
      try {
        await catalogoService.deleteAutor(autor.id);
        notify.success('Autor eliminado exitosamente');
        fetchAutores();
      } catch (err) {
        notify.error('Error al eliminar autor');
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
              <Users size={22} className="text-primary-600" />
              Autores
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">Gestiona los autores del catálogo</p>
          </div>
        </div>
        {isAdmin && (
          <button onClick={handleOpenCreate} className="btn btn-primary">
            <Plus size={16} /> Crear Autor
          </button>
        )}
      </div>

      <div className="card">
        {error && <ErrorMessage message={error} onRetry={fetchAutores} />}
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
            ) : autores.length === 0 ? (
              <tr>
                <td colSpan="2" className="p-0">
                  <EmptyState
                    title="No hay autores"
                    description="Comienza registrando un autor para el catálogo."
                    iconType="users"
                    action={
                      isAdmin && (
                        <button onClick={handleOpenCreate} className="btn btn-primary">
                          <Plus size={16} /> Crear primer autor
                        </button>
                      )
                    }
                  />
                </td>
              </tr>
            ) : (
              autores.map(autor => (
                <tr key={autor.id} className="table-row-hover group">
                  <td className="px-6 py-4 font-medium text-gray-900">{autor.nombre}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                      {isAdmin && (
                        <>
                          <button onClick={() => handleOpenEdit(autor)} className="btn-ghost p-2 rounded-lg" title="Editar">
                            <Edit size={16} className="text-blue-600" />
                          </button>
                          <button onClick={() => handleDelete(autor)} className="btn-ghost p-2 rounded-lg" title="Eliminar">
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
          initialData={editingAutor}
          entityType="autor"
          loading={saving}
        />
      </div>
    );
  };
