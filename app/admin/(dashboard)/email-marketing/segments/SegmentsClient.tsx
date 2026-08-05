"use client";

import { useState } from "react";
import { Filter, Calendar, Plus, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createSegment, updateSegment, deleteSegment } from "./actions";

type Segment = any;

export function SegmentsClient({ initialSegments }: { initialSegments: Segment[] }) {
  const [segments, setSegments] = useState(initialSegments);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedSegment, setSelectedSegment] = useState<Segment | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    isActive: true,
    rules: "{}" // We keep rules as a stringified JSON for the basic modal
  });

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      isActive: true,
      rules: "{}"
    });
    setSelectedSegment(null);
  };

  const handleOpenCreate = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleOpenEdit = (segment: Segment) => {
    setSelectedSegment(segment);
    setFormData({
      name: segment.name,
      description: segment.description || "",
      isActive: segment.isActive,
      rules: JSON.stringify(segment.rules, null, 2) || "{}"
    });
    setIsModalOpen(true);
  };

  const handleOpenDelete = (segment: Segment) => {
    setSelectedSegment(segment);
    setIsDeleteDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    let parsedRules = {};
    try {
      parsedRules = JSON.parse(formData.rules);
    } catch (err) {
      alert("El formato JSON de las reglas es inválido");
      setIsLoading(false);
      return;
    }

    const payload = { ...formData, rules: parsedRules };

    try {
      if (selectedSegment) {
        const res = await updateSegment(selectedSegment.id, payload);
        if (res.success) {
          alert("Segmento actualizado");
          setSegments(segments.map(s => s.id === selectedSegment.id ? { ...s, ...res.segment } : s));
          setIsModalOpen(false);
        } else {
          alert(res.error || "Error al actualizar");
        }
      } else {
        const res = await createSegment(payload);
        if (res.success) {
          alert("Segmento creado");
          setSegments([res.segment, ...segments]);
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
    if (!selectedSegment) return;
    setIsLoading(true);
    try {
      const res = await deleteSegment(selectedSegment.id);
      if (res.success) {
        alert("Segmento eliminado");
        setSegments(segments.filter(s => s.id !== selectedSegment.id));
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
          <h1 className="text-2xl font-bold text-gray-900">Segmentos</h1>
          <p className="text-gray-500 mt-1">
            Filtros dinámicos basados en comportamiento y datos demográficos
          </p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleOpenCreate}>
          <Plus className="w-4 h-4 mr-2" />
          Crear Segmento
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
                  Reglas
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
              {segments.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    <Filter className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                    <p className="text-lg font-medium text-gray-900">No hay segmentos</p>
                    <p>Aún no has creado ningún segmento dinámico.</p>
                  </td>
                </tr>
              ) : (
                segments.map((s) => (
                  <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{s.name}</div>
                      {s.description && (
                        <div className="text-sm text-gray-500 mt-1 truncate max-w-xs">{s.description}</div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-xs font-mono bg-gray-100 p-2 rounded truncate max-w-[250px]">
                        {JSON.stringify(s.rules)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${s.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {s.isActive ? "Activo" : "Inactivo"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        {new Date(s.createdAt).toLocaleDateString("es-ES")}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleOpenEdit(s)} className="text-blue-600 hover:text-blue-900 px-2">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleOpenDelete(s)} className="text-red-600 hover:text-red-900 px-2">
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

      {/* Segment Form Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{selectedSegment ? "Editar Segmento" : "Crear Segmento"}</DialogTitle>
            <DialogDescription>
              {selectedSegment ? "Modifica los detalles del segmento." : "Crea un nuevo segmento definiendo las reglas (formato JSON básico por ahora)."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre del segmento *</Label>
              <Input
                id="name"
                required
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ej. Clientes de España"
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

            <div className="space-y-2">
              <Label htmlFor="rules">Reglas (JSON)</Label>
              <textarea
                id="rules"
                rows={4}
                className="w-full min-h-[100px] border border-gray-300 rounded-md p-2 text-sm font-mono"
                value={formData.rules}
                onChange={e => setFormData({ ...formData, rules: e.target.value })}
                placeholder='{"country": "ES"}'
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
                Segmento activo
              </Label>
            </div>

            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading} className="bg-blue-600 hover:bg-blue-700">
                {isLoading ? "Guardando..." : "Guardar Segmento"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Eliminar Segmento</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que deseas eliminar este segmento? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm font-medium">{selectedSegment?.name}</p>
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
    </>
  );
}
