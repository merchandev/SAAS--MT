"use client";

import { useState } from "react";
import { DiscountCode } from "@prisma/client";
import { createDiscountCode, updateDiscountCode, toggleDiscountCodeStatus, deleteDiscountCode } from "@/modules/pricing/pricing.actions";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Edit, Trash, CheckCircle, XCircle, Plus, Tag } from "lucide-react";

export function DiscountCodesClient({ initialCodes }: { initialCodes: DiscountCode[] }) {
  const [codes, setCodes] = useState<DiscountCode[]>(initialCodes);
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    code: "",
    description: "",
    valueType: "PERCENTAGE",
    value: "",
    maxUses: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleOpen = (code?: DiscountCode) => {
    if (code) {
      setEditingId(code.id);
      setFormData({
        code: code.code,
        description: code.description || "",
        valueType: code.valueType,
        value: code.value.toString(),
        maxUses: code.maxUses?.toString() || "",
      });
    } else {
      setEditingId(null);
      setFormData({ code: "", description: "", valueType: "PERCENTAGE", value: "", maxUses: "" });
    }
    setIsOpen(true);
  };

  const handleSave = async () => {
    setIsLoading(true);
    const dataToSave = {
      code: formData.code,
      description: formData.description,
      valueType: formData.valueType,
      value: parseFloat(formData.value) || 0,
      maxUses: formData.maxUses ? parseInt(formData.maxUses) : undefined,
    };

    let result;
    if (editingId) {
      result = await updateDiscountCode(editingId, dataToSave);
    } else {
      result = await createDiscountCode(dataToSave);
    }

    if (result.success) {
      setIsOpen(false);
      window.location.reload(); // Refresh para cargar datos frescos, idealmente usaríamos router.refresh()
    } else {
      alert(result.error);
    }
    setIsLoading(false);
  };

  const handleToggle = async (id: string) => {
    await toggleDiscountCodeStatus(id);
    window.location.reload();
  };

  const handleDelete = async (id: string) => {
    if (confirm("¿Estás seguro de que quieres eliminar este código?")) {
      await deleteDiscountCode(id);
      window.location.reload();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
          <Tag className="w-5 h-5 text-blue-600" />
          Códigos de Descuento
        </h3>
        <Button onClick={() => handleOpen()} className="bg-blue-600 hover:bg-blue-700 text-white">
          <Plus className="w-4 h-4 mr-2" /> Añadir Cupón
        </Button>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50/80">
            <tr>
              <th className="px-5 py-4 text-left font-bold text-gray-500 uppercase tracking-wider text-xs">Código</th>
              <th className="px-5 py-4 text-left font-bold text-gray-500 uppercase tracking-wider text-xs">Valor</th>
              <th className="px-5 py-4 text-left font-bold text-gray-500 uppercase tracking-wider text-xs">Usos</th>
              <th className="px-5 py-4 text-center font-bold text-gray-500 uppercase tracking-wider text-xs">Estado</th>
              <th className="px-5 py-4 text-right font-bold text-gray-500 uppercase tracking-wider text-xs">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {codes.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-10 text-center text-gray-500">
                  No hay códigos de descuento configurados.
                </td>
              </tr>
            ) : (
              codes.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="font-bold text-gray-900">{c.code}</div>
                    <div className="text-xs text-gray-500 mt-1">{c.description}</div>
                  </td>
                  <td className="px-5 py-4 font-semibold text-blue-600">
                    {c.valueType === "PERCENTAGE" ? `${c.value}%` : `€${c.value}`}
                  </td>
                  <td className="px-5 py-4 text-gray-600">
                    {c.usedCount} {c.maxUses ? `/ ${c.maxUses}` : '(Ilimitado)'}
                  </td>
                  <td className="px-5 py-4 text-center">
                    <button onClick={() => handleToggle(c.id)} className="focus:outline-none">
                      {c.isActive ? (
                        <CheckCircle className="w-5 h-5 text-green-500 mx-auto" />
                      ) : (
                        <XCircle className="w-5 h-5 text-gray-300 mx-auto" />
                      )}
                    </button>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleOpen(c)} className="text-gray-500 hover:text-blue-600">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(c.id)} className="text-gray-500 hover:text-red-600">
                        <Trash className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingId ? "Editar Código" : "Nuevo Código de Descuento"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Código (Ej: SUMMER2026)</Label>
              <Input 
                value={formData.code} 
                onChange={e => setFormData({...formData, code: e.target.value.toUpperCase()})}
                placeholder="PROMO10"
              />
            </div>
            <div className="space-y-2">
              <Label>Descripción (Opcional)</Label>
              <Input 
                value={formData.description} 
                onChange={e => setFormData({...formData, description: e.target.value})}
                placeholder="Promoción de verano"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Tipo de Descuento</Label>
                <select 
                  className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={formData.valueType}
                  onChange={e => setFormData({...formData, valueType: e.target.value})}
                >
                  <option value="PERCENTAGE">Porcentaje (%)</option>
                  <option value="FIXED">Fijo (€)</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>Valor</Label>
                <Input 
                  type="number"
                  value={formData.value} 
                  onChange={e => setFormData({...formData, value: e.target.value})}
                  placeholder="10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Límite de Usos (Opcional)</Label>
              <Input 
                type="number"
                value={formData.maxUses} 
                onChange={e => setFormData({...formData, maxUses: e.target.value})}
                placeholder="100 (Dejar vacío para ilimitado)"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>Cancelar</Button>
            <Button onClick={handleSave} disabled={isLoading || !formData.code || !formData.value}>
              {isLoading ? "Guardando..." : "Guardar Código"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
