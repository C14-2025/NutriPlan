// MealHistory.tsx - Versão corrigida e ajustada (ATUALIZADO: edição NÃO altera alimentos)
import React, { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Separator } from './ui/separator';
import { Calendar, Edit, Trash2, Filter } from 'lucide-react';
import type { Meal, FoodItem } from '../App';
import { refeicaoApi } from '../services/refeicaoApi';

interface MealTotals {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface AlimentoQuantidadeDto {
  alimentoId: number;
  quantidade: number;
}

interface MealHistoryProps {
  meals: Meal[];
  onUpdateMeal?: (id: string, meal: Omit<Meal, 'id'>) => void;
  onDeleteMeal?: (id: string) => void;
}

export function MealHistory({ meals, onUpdateMeal, onDeleteMeal }: MealHistoryProps) {
  const [mealTotals, setMealTotals] = useState<Record<string, MealTotals>>({});
  const [filter, setFilter] = useState<'all' | 'Café da manhã' | 'Almoço' | 'Jantar' | 'Lanche'>('all');
  const [dateFilter, setDateFilter] = useState('');
  const [editingMeal, setEditingMeal] = useState<Meal | null>(null);
  const [editFormData, setEditFormData] = useState<Omit<Meal, 'id'> | null>(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [openDialogId, setOpenDialogId] = useState<string | null>(null);

  const getMealTypeLabel = (type: string) => type;

  const getMealTypeBadgeVariant = (type: string) => {
    const map: Record<string, string> = {
      'Café da manhã': 'default',
      'Almoço': 'secondary',
      'Jantar': 'outline',
      'Lanche': 'destructive',
    };
    return map[type] as any;
  };

  useEffect(() => {
    async function loadTotals() {
      const newTotals: Record<string, MealTotals> = {};
      for (const meal of meals) {
        try {
          const resp = await refeicaoApi.calcularTotais(Number(meal.id));
          newTotals[meal.id] = {
            calories: resp.data.calorias || 0,
            protein: resp.data.proteinas || 0,
            carbs: resp.data.carboidratos || 0,
            fat: resp.data.gorduras || 0,
          };
        } catch (err) {
          console.error("Erro ao carregar totais:", err);
        }
      }
      setMealTotals(newTotals);
    }
    loadTotals();
  }, [meals]);

  const filteredMeals = useMemo(() => {
    return meals.filter((meal) => {
      const typeMatch = filter === 'all' || meal.name === filter;
      const dateMatch = !dateFilter || meal.date === dateFilter;
      return typeMatch && dateMatch;
    });
  }, [meals, filter, dateFilter]);

  const sortedMeals = useMemo(() => {
    return [...filteredMeals].sort((a, b) => {
      if (a.date !== b.date) {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
      const order: Record<string, number> = {
        'Café da manhã': 0,
        'Almoço': 1,
        'Jantar': 2,
        'Lanche': 3,
        breakfast: 0, lunch: 1, dinner: 2, snack: 3,
        BREAKFAST: 0, LUNCH: 1, DINNER: 2, SNACK: 3,
      };
      return (order[a.name] ?? 4) - (order[b.name] ?? 4);
    });
  }, [filteredMeals]);

  const groupByDate = (list: Meal[]) => {
    const grouped: Record<string, Meal[]> = {};
    list.forEach((m) => {
      if (!grouped[m.date]) grouped[m.date] = [];
      grouped[m.date].push(m);
    });
    return grouped;
  };

  const groupedMeals = useMemo(() => groupByDate(sortedMeals), [sortedMeals]);

  const formatDate = (date: string) => {
    const d = new Date(date + "T00:00:00-03:00");
    return d.toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const isToday = (date: string) => {
    const today = new Date().toISOString().split("T")[0];
    return today === date;
  };

  const calculateTotalsFromFoodItems = (items: FoodItem[]) => {
    return items.reduce(
        (acc, item) => {
          const qty = item.quantity || 0;
          return {
            calories: acc.calories + (item.calories / 100) * qty,
            protein: acc.protein + (item.protein / 100) * qty,
            carbs: acc.carbs + (item.carbs / 100) * qty,
            fat: acc.fat + (item.fat / 100) * qty,
          };
        },
        { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );
  };

  const handleEditMeal = async (meal: Meal) => {
    // Usar os foodItems já presentes no meal (não reconstruir a partir de IDs)
    setEditingMeal(meal);
    try {
      // Montar editFormData com os dados existentes da meal (mantendo alimentos)
      const totals = calculateTotalsFromFoodItems(meal.foodItems || []);

      // map mealType -> frontend enum (se necessário)
      const reverseMapForEdit: Record<string, string> = {
        'Café da manhã': 'breakfast',
        'Almoço': 'lunch',
        'Jantar': 'dinner',
        'Lanche': 'snack',
      };
      const frontendType = reverseMapForEdit[meal.name] || meal.mealType || 'lunch';

      setEditFormData({
        mealType: frontendType as any,
        date: meal.date,
        foodItems: meal.foodItems || [],
        totalCalories: totals.calories,
        totalProtein: totals.protein,
        totalCarbs: totals.carbs,
        totalFat: totals.fat,
        name: meal.name,
        usuario: meal.usuario,
      });
    } catch (err) {
      console.error("Erro ao preparar edição:", err);
      setEditingMeal(null);
      setEditFormData(null);
    }
  };

  const updateEditFormData = (field: keyof Omit<Meal, 'id'>, value: any) => {
    if (!editFormData) return;
    setEditFormData({ ...editFormData, [field]: value });
  };

  // Mantém função para recalcular ao ajustar quantidades localmente (não utilizada para update backend)
  const updateFoodItem = (id: string, field: keyof FoodItem, value: any) => {
    if (!editFormData) return;
    const updated = editFormData.foodItems.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
    );
    const totals = calculateTotalsFromFoodItems(updated);
    setEditFormData({
      ...editFormData,
      foodItems: updated,
      totalCalories: totals.calories,
      totalProtein: totals.protein,
      totalCarbs: totals.carbs,
      totalFat: totals.fat,
    });
  };

  const handleSaveEdit = async () => {
    if (!editingMeal || !editFormData || !editingMeal.id) {
      alert("Erro: Dados de edição inválidos.");
      return;
    }

    setSaving(true);
    try {
      const frontendToBackendTipoMap: Record<string, string> = {
        breakfast: "Café da manhã",
        lunch: "Almoço",
        dinner: "Jantar",
        snack: "Lanche",
      };

      const backendTipo = frontendToBackendTipoMap[editFormData.mealType] || editFormData.mealType;
      const usuarioId = Number(localStorage.getItem("usuarioId")) || 1;

      const refeicaoPayload = {
        tipo: backendTipo,
        usuario: { id: usuarioId },
      };

      await refeicaoApi.atualizar(Number(editingMeal.id), refeicaoPayload);

      const updatedMealForState: Omit<Meal, "id"> = {
        name: backendTipo,
        foodItems: editingMeal.foodItems || [], // mantém alimentos originais
        totalCalories: editFormData.totalCalories ?? mealTotals[editingMeal.id]?.calories ?? 0,
        totalProtein: editFormData.totalProtein ?? mealTotals[editingMeal.id]?.protein ?? 0,
        totalCarbs: editFormData.totalCarbs ?? mealTotals[editingMeal.id]?.carbs ?? 0,
        totalFat: editFormData.totalFat ?? mealTotals[editingMeal.id]?.fat ?? 0,
        date: editFormData.date,
        mealType: editFormData.mealType as any,
        usuario: editingMeal.usuario || { id: usuarioId },
      };

      onUpdateMeal?.(editingMeal.id, updatedMealForState);

      setOpenDialogId(null);
      setEditingMeal(null);
      setEditFormData(null);
    } catch (err) {
      console.error("Erro ao salvar edição:", err);
      alert("Erro ao salvar edição. Veja o console.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteMeal = async (mealId: string) => {
    if (!confirm("Deseja realmente excluir?")) return;
    setDeletingId(mealId);
    try {
      await refeicaoApi.deletar(Number(mealId));
      onDeleteMeal?.(mealId);
    } catch (err) {
      console.error(err);
    } finally {
      setDeletingId(null);
    }
  };

  return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" /> Filtros
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Tipo de Refeição</Label>
                <Select value={filter} onValueChange={(v: any) => setFilter(v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    <SelectItem value="Café da manhã">Café da manhã</SelectItem>
                    <SelectItem value="Almoço">Almoço</SelectItem>
                    <SelectItem value="Jantar">Jantar</SelectItem>
                    <SelectItem value="Lanche">Lanche</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Data</Label>
                <Input type="date" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} />
              </div>
            </div>
          </CardContent>
        </Card>

        {Object.keys(groupedMeals).length === 0 && (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-muted-foreground">Nenhuma refeição encontrada.</p>
              </CardContent>
            </Card>
        )}

        {Object.entries(groupedMeals).map(([dateKey, group]) => (
            <div key={dateKey} className="space-y-3">
              <h3 className="text-sm font-semibold">{formatDate(dateKey)}</h3>

              {group.map((meal) => {
                const totals = mealTotals[meal.id] ?? { calories: 0, protein: 0, carbs: 0, fat: 0 };

                return (
                    <Card key={meal.id}>
                      <CardHeader>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="flex items-center gap-3">
                            <Badge variant={getMealTypeBadgeVariant(meal.name)}>
                              {getMealTypeLabel(meal.name)}
                            </Badge>
                            {isToday(meal.date) && <Badge variant="outline">Hoje</Badge>}
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-muted-foreground" />
                            <span>{formatDate(meal.date)}</span>
                          </div>
                        </div>
                      </CardHeader>

                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-muted rounded-lg">
                          <div className="text-center">
                            <div className="text-xl">{Math.round(totals.calories)}</div>
                            <div className="text-sm text-muted-foreground">Calorias</div>
                          </div>
                          <div className="text-center">
                            <div className="text-xl">{Math.round(totals.protein)}g</div>
                            <div className="text-sm text-muted-foreground">Proteína</div>
                          </div>
                          <div className="text-center">
                            <div className="text-xl">{Math.round(totals.carbs)}g</div>
                            <div className="text-sm text-muted-foreground">Carboidratos</div>
                          </div>
                          <div className="text-center">
                            <div className="text-xl">{Math.round(totals.fat)}g</div>
                            <div className="text-sm text-muted-foreground">Gordura</div>
                          </div>
                        </div>

                        <div>
                          <h4 className="mb-2">Alimentos:</h4>
                          <div className="space-y-2">
                            {meal.foodItems.map((food) => (
                                <div key={food.id} className="flex justify-between p-2 border rounded">
                                  <span>{food.name}</span>
                                  <span className="text-sm text-muted-foreground">
                            {food.quantity}g ({Math.round((food.calories / 100) * food.quantity)} kcal)
                          </span>
                                </div>
                            ))}
                          </div>
                        </div>

                        <Separator />

                        <div className="flex justify-end gap-2">
                          <Button
                              variant="outline"
                              size="sm"
                              onClick={async () => {
                                await handleEditMeal(meal);
                                setOpenDialogId(meal.id);
                              }}
                          >
                            <Edit className="w-4 h-4 mr-2 text-amber-500" />
                            Editar
                          </Button>

                          <Dialog
                              open={openDialogId === meal.id}
                              onOpenChange={(open) => {
                                if (!open) {
                                  // ao fechar, limpa edição
                                  setOpenDialogId(null);
                                  setEditingMeal(null);
                                  setEditFormData(null);
                                }
                              }}
                          >
                            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>Editar Refeição</DialogTitle>
                                <DialogDescription>
                                  Altere o tipo da refeição. Os alimentos não serão alterados.
                                </DialogDescription>
                              </DialogHeader>

                              {editFormData && editingMeal?.id === meal.id && (
                                  <div className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                      <div>
                                        <Label>Tipo</Label>
                                        <Select
                                            value={editFormData.mealType}
                                            onValueChange={(v: any) => updateEditFormData('mealType', v)}
                                        >
                                          <SelectTrigger><SelectValue /></SelectTrigger>
                                          <SelectContent>
                                            <SelectItem value="breakfast">Café da manhã</SelectItem>
                                            <SelectItem value="lunch">Almoço</SelectItem>
                                            <SelectItem value="dinner">Jantar</SelectItem>
                                            <SelectItem value="snack">Lanche</SelectItem>
                                          </SelectContent>
                                        </Select>
                                      </div>


                                    </div>

                                    <div>
                                      <h4 className="mb-2">Alimentos (somente leitura)</h4>
                                      <div className="space-y-2">
                                        {editFormData.foodItems.map((food) => (
                                            <div key={food.id} className="flex gap-2 items-center">
                                              <div className="flex-1">
                                                <div className="font-medium">{food.name}</div>
                                                <div className="text-sm text-muted-foreground">
                                                  {(food.calories ? Math.round((food.calories / 100) * (food.quantity || 0)) : 0)} kcal
                                                </div>
                                              </div>
                                              {/* quantidade removida do formulário editável — mantida somente leitura */}
                                            </div>
                                        ))}
                                      </div>
                                    </div>

                                    <div className="flex justify-end gap-2">
                                      <Button
                                          variant="outline"
                                          onClick={() => {
                                            setOpenDialogId(null);
                                            setEditingMeal(null);
                                            setEditFormData(null);
                                          }}
                                      >
                                        Cancelar
                                      </Button>
                                      <Button onClick={handleSaveEdit} disabled={saving}>
                                        {saving ? 'Salvando...' : 'Salvar Alterações'}
                                      </Button>
                                    </div>
                                  </div>
                              )}
                            </DialogContent>
                          </Dialog>

                          <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeleteMeal(meal.id)}
                              disabled={deletingId === meal.id}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            {deletingId === meal.id ? 'Excluindo...' : 'Excluir'}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                );
              })}
            </div>
        ))}
      </div>
  );
}
