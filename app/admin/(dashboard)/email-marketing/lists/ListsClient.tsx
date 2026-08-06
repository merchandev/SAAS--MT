"use client";

import { useState } from "react";
import { LayoutTemplate, Calendar, Plus, Users, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createList, updateList, deleteList } from "./actions";

type List = any; 

export function ListsClient({ initialLists }: { initialLists: List[] }) {
  const [lists, setLists] = useState(initialLists);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [selectedList, setSelectedList] = useState<List | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    isActive: true
  });

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      isActive: true
    });
    setSelectedList(null);
  };

  const handleOpenCreate = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleOpenEdit = (list: List) => {
    setSelectedList(list);
    setFormData({
      name: list.name,
      description: list.description || "",
      isActive: list.isActive
    });
    setIsModalOpen(true);
  };

  const handleOpenDelete = (list: List) => {
    setSelectedList(list);
    setIsDeleteDialogOpen(true);
  };

  const handleOpenImport = (list: List) => {
    setSelectedList(list);
    setIsImportModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (selectedList) {
        const res = await updateList(selectedList.id, formData);
        if (res.success) {
          alert("Lista actualizada");
          setLists(lists.map(l => l.id === selectedList.id ? { ...l, ...res.list } : l));
          setIsModalOpen(false);
        } else {
          alert(res.error || "Error al actualizar");
        }
      } else {
        const res = await createList(formData);
        if (res.success) {
          alert("Lista creada");
          setLists([{...res.list, _count: { contacts: 0 }}, ...lists]);
          setIsModalOpen(false);
        } else {
          alert(res.error || "Error al crear");
        }
      }
    } catch (error) {
      alert("Ocurrió un error inesperado");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedList) return;
    setIsLoading(true);
    try {
      const res = await deleteList(selectedList.id);
      if (res.success) {
        alert("Lista eliminada");
        setLists(lists.filter(l => l.id !== selectedList.id));
        setIsDeleteDialogOpen(false);
      } else {
        alert(res.error || "Error al eliminar");
      }
    } catch (error) {
      alert("Ocurrió un error inesperado");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Listas Estáticas</h1>
          <p className="text-gray-500 mt-1">
            Agrupa a tus contactos en listas para envíos masivos
          </p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleOpenCreate}>
          <Plus className="w-4 h-4 mr-2" />
          Crear Lista
        </Button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nombre
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contactos
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha Creación
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {lists.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    <LayoutTemplate className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                    <p className="text-lg font-medium text-gray-900">No hay listas</p>
                    <p>Aún no has creado ninguna lista estática.</p>
                  </td>
                </tr>
              ) : (
                lists.map((l) => (
                  <tr key={l.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{l.name}</div>
                      {l.description && (
                        <div className="text-sm text-gray-500 mt-1 truncate max-w-xs">{l.description}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <Users className="w-4 h-4 mr-2 text-gray-400" />
                        {l._count?.contacts || 0}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${l.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {l.isActive ? "Activa" : "Inactiva"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        {new Date(l.createdAt).toLocaleDateString("es-ES")}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleOpenImport(l)} className="text-green-600 hover:text-green-900 px-2" title="Importar Excel">
                          <Plus className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleOpenEdit(l)} className="text-blue-600 hover:text-blue-900 px-2" title="Editar">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleOpenDelete(l)} className="text-red-600 hover:text-red-900 px-2" title="Eliminar">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* List Form Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{selectedList ? "Editar Lista" : "Crear Lista"}</DialogTitle>
            <DialogDescription>
              {selectedList ? "Modifica los detalles de la lista estática." : "Crea una nueva lista para agrupar contactos manualmente."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre de la lista *</Label>
              <Input
                id="name"
                required
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ej. Clientes VIP 2026"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Descripción</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                placeholder="Descripción interna..."
              />
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
              />
              <Label htmlFor="isActive" className="text-sm font-normal cursor-pointer">
                Lista activa (disponible para enviar campañas)
              </Label>
            </div>

            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading} className="bg-blue-600 hover:bg-blue-700">
                {isLoading ? "Guardando..." : "Guardar Lista"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Eliminar Lista</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que deseas eliminar esta lista? Los contactos seguirán en la base de datos, pero la lista y su relación desaparecerán.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm font-medium">{selectedList?.name}</p>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button type="button" variant="destructive" onClick={handleDelete} disabled={isLoading}>
              {isLoading ? "Eliminando..." : "Eliminar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Import Excel Modal */}
      <Dialog open={isImportModalOpen} onOpenChange={setIsImportModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Importar Contactos (Excel)</DialogTitle>
            <DialogDescription>
              Sube un archivo Excel (.xlsx, .csv) con los correos que deseas agregar a la lista <strong>{selectedList?.name}</strong>.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={async (e) => {
            e.preventDefault();
            if (!selectedList) return;
            const fileInput = (e.target as HTMLFormElement).elements.namedItem("file") as HTMLInputElement;
            const file = fileInput?.files?.[0];
            if (!file) {
              alert("Por favor selecciona un archivo.");
              return;
            }

            setIsLoading(true);
            try {
              const form = new FormData();
              form.append("file", file);
              form.append("listId", selectedList.id);
              
              const res = await fetch(`/api/admin/email-marketing/contacts/import`, {
                method: "POST",
                body: form
              });
              
              const data = await res.json();
              
              if (data.success) {
                alert(`Importación completada. Se importaron ${data.importedCount} contactos.`);
                setIsImportModalOpen(false);
                // Update count in UI optionally
                setLists(lists.map(l => l.id === selectedList.id ? { ...l, _count: { contacts: (l._count?.contacts || 0) + data.importedCount } } : l));
              } else {
                alert(data.error || "Ocurrió un error al importar.");
              }
            } catch (err) {
              alert("Error de conexión al importar.");
            } finally {
              setIsLoading(false);
            }
          }} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="file">Archivo Excel</Label>
              <Input
                id="file"
                name="file"
                type="file"
                accept=".xlsx, .xls, .csv"
                required
              />
              <p className="text-xs text-gray-500">
                El sistema detectará automáticamente los correos válidos en cualquier columna del archivo.
              </p>
            </div>
            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => setIsImportModalOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading} className="bg-green-600 hover:bg-green-700">
                {isLoading ? "Importando..." : "Importar"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
