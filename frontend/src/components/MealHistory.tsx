import React, { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,} from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Separator } from './ui/separator';
import { Calendar, Edit, Trash2, Filter } from 'lucide-react';
import type { Meal, FoodItem } from '../App';
import { refeicaoApi } from '../services/refeicaoApi';
import { alimentoApi } from '../services/alimentoApi';

interface AlimentoQuantidadeDto {
  alimentoId: number;
  quantidade: number;
}

interface AlimentoDetalhe {
  id: number;
  nome: string;
  calorias: number;
  proteinas: number;
  carboidratos: number;
  gorduras: number;
}

interface ExtendedMeal extends Omit<Meal, 'foodItems'> {
  foodItems: {
    alimento: AlimentoDetalhe;
    quantidade: number;
  }[];
}

interface MealHistoryProps {
  meals: Meal[];
  onUpdateMeal?: (id: string, meal: Omit<Meal, 'id'>) => void;
  onDeleteMeal?: (id: string) => void;
}

export function MealHistory({ meals, onUpdateMeal, onDeleteMeal }: MealHistoryProps) {
  const [extendedMeals, setExtendedMeals] = useState<ExtendedMeal[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'Café da manhã' | 'Almoço' | 'Jantar' | 'Lanche'>('all');
  const [dateFilter, setDateFilter] = useState('');
  const [editingMeal, setEditingMeal] = useState<ExtendedMeal | null>(null);
  const [editFormData, setEditFormData] = useState<Omit<ExtendedMeal, 'id'> | null>(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [openDialogId, setOpenDialogId] = useState<string | null>(null);

  const getMealTypeLabel = (type: string) => type;

  const getMealTypeBadgeClassName = (type: string) => {
    const map: Record<string, string> = {
      'Café da manhã': 'bg-blue-50 text-blue-800 border-blue-100',
      'Almoço': 'bg-green-50 text-green-800 border-green-100',
      'Jantar': 'bg-indigo-50 text-indigo-800 border-indigo-100',
      'Lanche': 'bg-amber-50 text-amber-800 border-amber-100',
    };
    return map[type] || 'bg-gray-50 text-gray-700 border-gray-200';
  };

  useEffect(() => {
    const loadExtendedMeals = async () => {
      setLoading(true);
      try {
        const allAlimentosResponse = await alimentoApi.listar();
        const allAlimentosMap = new Map<number, AlimentoDetalhe>();
        allAlimentosResponse.data.forEach((a: any) => {
          allAlimentosMap.set(a.id, {
            id: a.id,
            nome: a.nome || a.name || 'Nome não encontrado',
            calorias: a.calorias || 0,
            proteinas: a.proteinas || 0,
            carboidratos: a.carboidratos || 0,
            gorduras: a.gorduras || 0,
          });
        });

        const extendedMealsData = await Promise.all(
            meals.map(async (meal) => {
              const alimentosResponse = await refeicaoApi.listarAlimentos(Number(meal.id));
              const alimentosQuantidade: AlimentoQuantidadeDto[] = alimentosResponse.data || [];
              const foodItemsDetalhados = alimentosQuantidade
                  .map((aq) => {
                    const alimentoDetalhe = allAlimentosMap.get(aq.alimentoId);
                    if (alimentoDetalhe) {
                      return {
                        alimento: alimentoDetalhe,
                        quantidade: aq.quantidade,
                      };
                    }
                    console.error(`Alimento com ID ${aq.alimentoId} não encontrado no mapa.`);
                    return null;
                  })
                  .filter((item): item is NonNullable<typeof item> => item !== null);

              const totals = foodItemsDetalhados.reduce(
                  (acc, item) => {
                    const qty = item.quantidade;
                    const factor = qty / 100;
                    return {
                      calories: acc.calories + item.alimento.calorias * factor,
                      protein: acc.protein + item.alimento.proteinas * factor,
                      carbs: acc.carbs + item.alimento.carboidratos * factor,
                      fat: acc.fat + item.alimento.gorduras * factor,
                    };
                  },
                  { calories: 0, protein: 0, carbs: 0, fat: 0 }
              );
              return {
                ...meal,
                foodItems: foodItemsDetalhados,
                totalCalories: totals.calories,
                totalProtein: totals.protein,
                totalCarbs: totals.carbs,
                totalFat: totals.fat,
              };
            })
        );

        setExtendedMeals(extendedMealsData);
      } catch (err) {
        console.error("Erro ao carregar dados detalhados das refeições:", err);
      } finally {
        setLoading(false);
      }
    };

    if (meals.length > 0) {
      loadExtendedMeals();
    } else {
      setExtendedMeals([]);
      setLoading(false);
    }
  }, [meals]);

  const filteredMeals = useMemo(() => {
    return extendedMeals.filter((meal) => {
      const typeMatch = filter === 'all' || meal.name === filter;
      const dateMatch = !dateFilter || meal.date === dateFilter;
      return typeMatch && dateMatch;
    });
  }, [extendedMeals, filter, dateFilter]);

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

  const groupByDate = (list: ExtendedMeal[]) => {
    const grouped: Record<string, ExtendedMeal[]> = {};
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

  const handleEditMeal = async (meal: ExtendedMeal) => {
    setEditingMeal(meal);
    try {
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
        foodItems: meal.foodItems,
        totalCalories: meal.totalCalories,
        totalProtein: meal.totalProtein,
        totalCarbs: meal.totalCarbs,
        totalFat: meal.totalFat,
        name: meal.name,
        usuario: meal.usuario,
      });
    } catch (err) {
      console.error("Erro ao preparar edição:", err);
      setEditingMeal(null);
      setEditFormData(null);
    }
  };

  const updateEditFormData = (field: keyof Omit<ExtendedMeal, 'id'>, value: any) => {
    if (!editFormData) return;
    setEditFormData({ ...editFormData, [field]: value });
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
      const convertedFoodItems: FoodItem[] = editingMeal.foodItems.map(item => ({
        id: item.alimento.id.toString(),
        name: item.alimento.nome,
        quantity: item.quantidade,
        calories: item.alimento.calorias,
        protein: item.alimento.proteinas,
        carbs: item.alimento.carboidratos,
        fat: item.alimento.gorduras,
      }));

      const updatedMealForState: Omit<Meal, "id"> = {
        name: backendTipo,
        foodItems: convertedFoodItems,
        totalCalories: editingMeal.totalCalories,
        totalProtein: editingMeal.totalProtein,
        totalCarbs: editingMeal.totalCarbs,
        totalFat: editingMeal.totalFat,
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

  if (loading) {
    return <div>Carregando refeições...</div>;
  }

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
                <Label className="mb-2">Tipo de Refeição</Label>
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
                <Label className="mb-2">Data</Label>
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
                const totals = {
                  calories: meal.totalCalories,
                  protein: meal.totalProtein,
                  carbs: meal.totalCarbs,
                  fat: meal.totalFat,
                };

                return (
                    <Card key={meal.id}>
                      <CardHeader>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="flex items-center gap-3">
                            <Badge className={getMealTypeBadgeClassName(meal.name)}>
                              {getMealTypeLabel(meal.name)}
                            </Badge>
                            {isToday(meal.date) ? (
                                <Badge variant="outline">Hoje</Badge>
                            ) : (
                                <span className="text-sm text-muted-foreground">{formatDate(meal.date)}</span>
                            )}
                          </div>
                          {!isToday(meal.date) && (
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-muted-foreground" />
                                <span>{formatDate(meal.date)}</span>
                              </div>
                          )}
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
                            {meal.foodItems.map((item, index) => {
                              const { alimento, quantidade } = item;
                              const factor = quantidade / 100;
                              const caloriasCalculadas = alimento.calorias * factor;
                              return (
                                  <div key={`${alimento.id}-${index}`} className="flex justify-between p-2 border rounded">
                                    <span>{alimento.nome} ({quantidade}g)</span>
                                    <span className="text-sm text-muted-foreground">
                                        {Math.round(caloriasCalculadas)} kcal
                                      </span>
                                  </div>
                              );
                            })}
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
                                    <div className="space-y-4">
                                      <div>
                                        <Label className="mb-2">Tipo</Label>
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
                                        {editFormData.foodItems.map((item, idx) => (
                                            <div key={`${item.alimento.id}-${idx}`} className="flex gap-2 items-center">
                                              <div className="flex-1">
                                                <div className="font-medium">{item.alimento.nome}</div>
                                                <div className="text-sm text-muted-foreground">
                                                  {item.quantidade}g ({Math.round(item.alimento.calorias * (item.quantidade / 100))} kcal)
                                                </div>
                                              </div>
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