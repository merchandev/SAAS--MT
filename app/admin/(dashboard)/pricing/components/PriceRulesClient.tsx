"use client";

import { useState } from "react";
import { PriceRule } from "@prisma/client";
import { createPriceRule, updatePriceRule, togglePriceRuleStatus, deletePriceRule } from "@/modules/pricing/pricing.actions";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Edit, Trash, CheckCircle, XCircle, Plus, Settings } from "lucide-react";

export function PriceRulesClient({ initialRules }: { initialRules: PriceRule[] }) {
  const [rules, setRules] = useState<PriceRule[]>(initialRules);
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    type: "NIGHT_SURCHARGE",
    valueType: "FIXED",
    value: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleOpen = (rule?: PriceRule) => {
    if (rule) {
      setEditingId(rule.id);
      setFormData({
        name: rule.name,
        description: rule.description || "",
        type: rule.type,
        valueType: rule.valueType,
        value: rule.value.toString(),
      });
    } else {
      setEditingId(null);
      setFormData({ name: "", description: "", type: "NIGHT_SURCHARGE", valueType: "FIXED", value: "" });
    }
    setIsOpen(true);
  };

  const handleSave = async () => {
    setIsLoading(true);
    const dataToSave = {
      name: formData.name,
      description: formData.description,
      type: formData.type,
      valueType: formData.valueType,
      value: parseFloat(formData.value) || 0,
    };

    let result;
    if (editingId) {
      result = await updatePriceRule(editingId, dataToSave);
    } else {
      result = await createPriceRule(dataToSave);
    }

    if (result.success) {
      setIsOpen(false);
      window.location.reload();
    } else {
      alert(result.error);
    }
    setIsLoading(false);
  };

  const handleToggle = async (id: string) => {
    await togglePriceRuleStatus(id);
    window.location.reload();
  };

  const handleDelete = async (id: string) => {
    if (confirm("¿Estás seguro de que quieres eliminar esta regla?")) {
      await deletePriceRule(id);
      window.location.reload();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
          <Settings className="w-5 h-5 text-indigo-600" />
          Reglas de Precio Globales
        </h3>
        <Button onClick={() => handleOpen()} className="bg-indigo-600 hover:bg-indigo-700 text-white">
          <Plus className="w-4 h-4 mr-2" /> Añadir Regla
        </Button>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50/80">
            <tr>
              <th className="px-5 py-4 text-left font-bold text-gray-500 uppercase tracking-wider text-xs">Nombre y Tipo</th>
              <th className="px-5 py-4 text-left font-bold text-gray-500 uppercase tracking-wider text-xs">Valor</th>
              <th className="px-5 py-4 text-center font-bold text-gray-500 uppercase tracking-wider text-xs">Estado</th>
              <th className="px-5 py-4 text-right font-bold text-gray-500 uppercase tracking-wider text-xs">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {rules.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-10 text-center text-gray-500">
                  No hay reglas de precio configuradas.
                </td>
              </tr>
            ) : (
              rules.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="font-bold text-gray-900">{r.name}</div>
                    <div className="text-xs text-gray-500 mt-1">{r.description}</div>
                    <span className="inline-block mt-2 px-2 py-0.5 bg-gray-100 text-gray-600 text-[10px] uppercase font-bold rounded">
                      {r.type}
                    </span>
                  </td>
                  <td className="px-5 py-4 font-semibold text-indigo-600">
                    {r.valueType === "PERCENTAGE" ? `+${r.value}%` : `+€${r.value}`}
                  </td>
                  <td className="px-5 py-4 text-center">
                    <button onClick={() => handleToggle(r.id)} className="focus:outline-none">
                      {r.isActive ? (
                        <CheckCircle className="w-5 h-5 text-green-500 mx-auto" />
                      ) : (
                        <XCircle className="w-5 h-5 text-gray-300 mx-auto" />
                      )}
                    </button>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleOpen(r)} className="text-gray-500 hover:text-indigo-600">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(r.id)} className="text-gray-500 hover:text-red-600">
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
            <DialogTitle>{editingId ? "Editar Regla" : "Nueva Regla de Precio"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Nombre de la Regla</Label>
              <Input 
                value={formData.name} 
                onChange={e => setFormData({...formData, name: e.target.value})}
                placeholder="Ej: Suplemento Nocturno General"
              />
            </div>
            <div className="space-y-2">
              <Label>Tipo de Regla</Label>
              <select 
                className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={formData.type}
                onChange={e => setFormData({...formData, type: e.target.value})}
              >
                <option value="NIGHT_SURCHARGE">Suplemento Nocturno</option>
                <option value="WEEKEND_SURCHARGE">Suplemento Fin de Semana</option>
                <option value="AIRPORT_FEE">Tasa de Aeropuerto</option>
                <option value="HOLIDAY_SURCHARGE">Suplemento Festivo</option>
                <option value="OTHER">Otro</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Tipo de Valor</Label>
                <select 
                  className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={formData.valueType}
                  onChange={e => setFormData({...formData, valueType: e.target.value})}
                >
                  <option value="FIXED">Fijo (€)</option>
                  <option value="PERCENTAGE">Porcentaje (%)</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>Valor</Label>
                <Input 
                  type="number"
                  value={formData.value} 
                  onChange={e => setFormData({...formData, value: e.target.value})}
                  placeholder="20"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Descripción (Opcional)</Label>
              <Input 
                value={formData.description} 
                onChange={e => setFormData({...formData, description: e.target.value})}
                placeholder="Aplica de 22:00 a 06:00"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>Cancelar</Button>
            <Button onClick={handleSave} disabled={isLoading || !formData.name || !formData.value}>
              {isLoading ? "Guardando..." : "Guardar Regla"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
