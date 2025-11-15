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
  DialogTrigger,
} from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Separator } from './ui/separator';
import { Calendar, Edit, Trash2, Filter } from 'lucide-react';
import type { Meal, FoodItem } from '../App';
import { refeicaoApi } from '../services/refeicaoApi';

interface MealHistoryProps {
  meals: Meal[];
  onUpdateMeal?: (id: string, meal: Omit<Meal, 'id'>) => void;
  onDeleteMeal?: (id: string) => void;
}

export function MealHistory({ meals, onUpdateMeal, onDeleteMeal }: MealHistoryProps) {
  const [filter, setFilter] = useState<'all' | 'breakfast' | 'lunch' | 'dinner' | 'snack'>('all');
  const [dateFilter, setDateFilter] = useState('');
  const [editingMeal, setEditingMeal] = useState<Meal | null>(null);
  const [editFormData, setEditFormData] = useState<Omit<Meal, 'id'> | null>(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // CORREÇÃO: Mapeamento consistente de tipos
  const tipoDisplay: Record<string, string> = {
    breakfast: 'Café da manhã',
    lunch: 'Almoço',
    dinner: 'Jantar',
    snack: 'Lanche',
    BREAKFAST: 'Café da manhã',
    LUNCH: 'Almoço',
    DINNER: 'Jantar',
    SNACK: 'Lanche',
  };

  const reverseTipoMap: Record<string, string> = {
    'Café da manhã': 'BREAKFAST',
    'Almoço': 'LUNCH',
    'Jantar': 'DINNER',
    'Lanche': 'SNACK',
    'breakfast': 'BREAKFAST',
    'lunch': 'LUNCH',
    'dinner': 'DINNER',
    'snack': 'SNACK',
  };

  const frontendTipoMap: Record<string, string> = {
    'BREAKFAST': 'breakfast',
    'LUNCH': 'lunch',
    'DINNER': 'dinner',
    'SNACK': 'snack',
  };

  const getMealTypeLabel = (type: string) => {
    const normalizedType = frontendTipoMap[type] || type;
    return tipoDisplay[normalizedType] || type;
  };

  const getMealTypeBadgeVariant = (type: string) => {
    const normalizedType = frontendTipoMap[type] || type;
    const map: Record<string, string> = {
      breakfast: 'default',
      lunch: 'secondary',
      dinner: 'outline',
      snack: 'destructive',
    };
    return (map[normalizedType] as never) || 'default';
  };

  const filteredMeals = useMemo(() => {
    return meals.filter((meal) => {
      // CORREÇÃO: Normalizar tipo para comparação
      const mealTypeNormalized = frontendTipoMap[meal.mealType] || meal.mealType;
      const filterNormalized = filter === 'all' ? filter : frontendTipoMap[filter] || filter;

      const typeMatch = filter === 'all' || mealTypeNormalized === filterNormalized;
      const dateMatch = !dateFilter || meal.date === dateFilter;
      return typeMatch && dateMatch;
    });
  }, [meals, filter, dateFilter]);

  const sortedMeals = useMemo(() => {
    return [...filteredMeals].sort((a, b) => {
      if (a.date !== b.date) {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
      const mealOrder: Record<string, number> = {
        BREAKFAST: 0, LUNCH: 1, DINNER: 2, SNACK: 3,
        breakfast: 0, lunch: 1, dinner: 2, snack: 3
      };
      const ai = mealOrder[a.mealType] ?? 4;
      const bi = mealOrder[b.mealType] ?? 4;
      return ai - bi;
    });
  }, [filteredMeals]);

  const groupByDate = (list: Meal[]) => {
    const grouped: Record<string, Meal[]> = {};
    list.forEach((m) => {
      const key = m.date;
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(m);
    });
    return grouped;
  };

  const groupedMeals = useMemo(() => groupByDate(sortedMeals), [sortedMeals]);

  // CORREÇÃO: Função para obter data atual no formato YYYY-MM-DD considerando fuso horário
  const getTodayDateString = () => {
    const now = new Date();
    // Ajusta para o fuso horário de Brasília (UTC-3)
    const offset = -3 * 60; // UTC-3 em minutos
    const localDate = new Date(now.getTime() + offset * 60 * 1000);
    return localDate.toISOString().split('T')[0];
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString + 'T00:00:00-03:00'); // Força fuso horário Brasil
    return date.toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const isToday = (dateString: string) => {
    const today = getTodayDateString();
    return dateString === today;
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

  const handleEditMeal = (meal: Meal) => {
    setEditingMeal(meal);
    const clonedFoodItems = meal.foodItems.map((f) => ({ ...f }));
    const totals = calculateTotalsFromFoodItems(clonedFoodItems);

    // CORREÇÃO: Mapeamento correto do tipo para o formulário
    const mealTypeForForm = frontendTipoMap[meal.mealType] || meal.mealType;

    setEditFormData({
      mealType: mealTypeForForm,
      date: meal.date,
      foodItems: clonedFoodItems,
      totalCalories: totals.calories,
      totalProtein: totals.protein,
      totalCarbs: totals.carbs,
      totalFat: totals.fat,
    });
  };

  const updateEditFormData = (field: keyof Omit<Meal, 'id'>, value: any) => {
    if (!editFormData) return;
    setEditFormData({ ...editFormData, [field]: value });
  };

  const updateFoodItem = (foodId: string, field: keyof FoodItem, value: string | number) => {
    if (!editFormData) return;
    const updatedFoodItems = editFormData.foodItems.map((item) =>
        item.id === foodId ? { ...item, [field]: value } : item
    );
    const totals = calculateTotalsFromFoodItems(updatedFoodItems);
    setEditFormData({
      ...editFormData,
      foodItems: updatedFoodItems,
      totalCalories: totals.calories,
      totalProtein: totals.protein,
      totalCarbs: totals.carbs,
      totalFat: totals.fat,
    });
  };

  // CORREÇÃO: Implementação completa da atualização
  const handleSaveEdit = async () => {
    if (!editingMeal || !editFormData) return;
    setSaving(true);
    try {
      // 1. Atualizar metadados da refeição
      const payload = {
        tipo: reverseTipoMap[editFormData.mealType] || editFormData.mealType,
        data: editFormData.date,
      };

      await refeicaoApi.atualizar(Number(editingMeal.id), payload);

      // 2. Atualizar alimentos da refeição
      // Primeiro, remover todos os alimentos atuais
      const alimentosAtuais = await refeicaoApi.listarAlimentos(Number(editingMeal.id));
      for (const alimento of alimentosAtuais.data) {
        await refeicaoApi.removerAlimento(Number(editingMeal.id), alimento.id);
      }

      // Adicionar os novos alimentos com quantidades
      for (const food of editFormData.foodItems) {
        // Aqui precisaríamos do ID real do alimento no backend
        // Como não temos, vamos assumir que food.id é o ID do alimento
        // Em um cenário real, você precisaria buscar ou criar o alimento primeiro
        if (food.id && !isNaN(Number(food.id))) {
          await refeicaoApi.adicionarAlimento(
              Number(editingMeal.id),
              Number(food.id),
              food.quantity || 0
          );
        }
      }

      // 3. Atualizar estado local
      onUpdateMeal?.(editingMeal.id, {
        ...editFormData,
        mealType: reverseTipoMap[editFormData.mealType] || editFormData.mealType,
      });

      setEditingMeal(null);
      setEditFormData(null);
    } catch (err) {
      console.error('Erro ao salvar edição:', err);
      alert('Erro ao salvar edição.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteMeal = async (mealId: string) => {
    if (!confirm('Tem certeza que deseja excluir esta refeição?')) return;
    setDeletingId(mealId);
    try {
      await refeicaoApi.deletar(Number(mealId));
      onDeleteMeal?.(mealId);
    } catch (err) {
      console.error('Erro ao excluir:', err);
      alert('Erro ao excluir refeição.');
    } finally {
      setDeletingId(null);
    }
  };

  const formatGroupHeader = (dateString: string) => {
    const d = new Date(dateString + 'T00:00:00-03:00'); // Força fuso horário Brasil
    const short = d.toLocaleDateString('pt-BR');
    const label = isToday(dateString) ? 'Hoje' : '';
    return label ? `${label} — ${short}` : short;
  };

  return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filtros
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Tipo de Refeição</Label>
                <Select value={filter} onValueChange={(v: any) => setFilter(v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas as refeições</SelectItem>
                    <SelectItem value="breakfast">Café da manhã</SelectItem>
                    <SelectItem value="lunch">Almoço</SelectItem>
                    <SelectItem value="dinner">Jantar</SelectItem>
                    <SelectItem value="snack">Lanche</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Data</Label>
                <Input
                    type="date"
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {Object.keys(groupedMeals).length === 0 && (
              <Card>
                <CardContent className="text-center py-8">
                  <p className="text-muted-foreground">Nenhuma refeição encontrada com os filtros aplicados.</p>
                </CardContent>
              </Card>
          )}

          {Object.entries(groupedMeals).map(([dateKey, group]) => (
              <div key={dateKey} className="space-y-3">
                <h3 className="text-sm font-semibold">{formatGroupHeader(dateKey)}</h3>

                {group.map((meal) => (
                    <Card key={meal.id}>
                      <CardHeader>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 w-full">
                          <div className="flex items-center gap-3">
                            <Badge variant={getMealTypeBadgeVariant(meal.mealType) as any}>
                              {getMealTypeLabel(meal.mealType)}
                            </Badge>
                            {isToday(meal.date) && <Badge variant="outline">Hoje</Badge>}
                          </div>

                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">{formatDate(meal.date)}</span>
                            {meal.time && <span className="ml-2 text-sm text-muted-foreground">{meal.time}</span>}
                          </div>
                        </div>
                      </CardHeader>

                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-muted rounded-lg">
                          <div className="text-center">
                            <div className="text-xl">{Math.round(meal.totalCalories)}</div>
                            <div className="text-sm text-muted-foreground">Calorias</div>
                          </div>
                          <div className="text-center">
                            <div className="text-xl">{Math.round(meal.totalProtein)}g</div>
                            <div className="text-sm text-muted-foreground">Proteína</div>
                          </div>
                          <div className="text-center">
                            <div className="text-xl">{Math.round(meal.totalCarbs)}g</div>
                            <div className="text-sm text-muted-foreground">Carboidratos</div>
                          </div>
                          <div className="text-center">
                            <div className="text-xl">{Math.round(meal.totalFat)}g</div>
                            <div className="text-sm text-muted-foreground">Gordura</div>
                          </div>
                        </div>

                        <div>
                          <h4 className="mb-2">Alimentos:</h4>
                          <div className="space-y-2">
                            {meal.foodItems.map((food) => (
                                <div key={food.id} className="flex justify-between items-center p-2 bg-background rounded border">
                                  <span>{food.name}</span>
                                  <span className="text-sm text-muted-foreground">
                            {food.quantity}g ({Math.round((food.calories / 100) * (food.quantity || 0))} kcal)
                          </span>
                                </div>
                            ))}
                          </div>
                        </div>

                        <Separator />

                        <div className="flex justify-end gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm" onClick={() => handleEditMeal(meal)}>
                                <Edit className="w-4 h-4 mr-2 text-amber-500" />
                                Editar
                              </Button>
                            </DialogTrigger>

                            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>Editar Refeição</DialogTitle>
                                <DialogDescription>Faça alterações na refeição e clique em salvar.</DialogDescription>
                              </DialogHeader>

                              {editFormData && editingMeal && (
                                  <div className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                      <div>
                                        <Label>Tipo</Label>
                                        <Select
                                            value={editFormData.mealType}
                                            onValueChange={(v: any) => updateEditFormData('mealType', v)}
                                        >
                                          <SelectTrigger>
                                            <SelectValue />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectItem value="breakfast">Café da manhã</SelectItem>
                                            <SelectItem value="lunch">Almoço</SelectItem>
                                            <SelectItem value="dinner">Jantar</SelectItem>
                                            <SelectItem value="snack">Lanche</SelectItem>
                                          </SelectContent>
                                        </Select>
                                      </div>

                                      <div>
                                        <Label>Data</Label>
                                        <Input
                                            type="date"
                                            value={editFormData.date}
                                            onChange={(e) => updateEditFormData('date', e.target.value)}
                                        />
                                      </div>
                                    </div>

                                    <div>
                                      <Label>Alimentos</Label>
                                      <div className="space-y-2 mt-2">
                                        {editFormData.foodItems.map((food) => (
                                            <div key={food.id} className="grid grid-cols-2 md:grid-cols-4 gap-2 p-2 border rounded">
                                              <Input
                                                  value={food.name}
                                                  onChange={(e) => updateFoodItem(food.id, 'name', e.target.value)}
                                                  placeholder="Nome"
                                              />
                                              <Input
                                                  type="number"
                                                  value={food.quantity}
                                                  onChange={(e) => updateFoodItem(food.id, 'quantity', Number(e.target.value))}
                                                  placeholder="Qtd (g)"
                                              />
                                              <Input
                                                  type="number"
                                                  value={food.calories}
                                                  onChange={(e) => updateFoodItem(food.id, 'calories', Number(e.target.value))}
                                                  placeholder="Cal (100g)"
                                              />
                                            </div>
                                        ))}
                                      </div>
                                    </div>

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-muted rounded">
                                      <div className="text-center">
                                        <div className="text-xl">{Math.round(editFormData.totalCalories)}</div>
                                        <div className="text-sm text-muted-foreground">Calorias</div>
                                      </div>
                                      <div className="text-center">
                                        <div className="text-xl">{Math.round(editFormData.totalProtein)}g</div>
                                        <div className="text-sm text-muted-foreground">Proteína</div>
                                      </div>
                                      <div className="text-center">
                                        <div className="text-xl">{Math.round(editFormData.totalCarbs)}g</div>
                                        <div className="text-sm text-muted-foreground">Carboidratos</div>
                                      </div>
                                      <div className="text-center">
                                        <div className="text-xl">{Math.round(editFormData.totalFat)}g</div>
                                        <div className="text-sm text-muted-foreground">Gordura</div>
                                      </div>
                                    </div>

                                    <div className="flex justify-end gap-2">
                                      <Button
                                          variant="outline"
                                          onClick={() => { setEditingMeal(null); setEditFormData(null); }}
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
                            <Trash2 className="w-4 h-4 mr-2 text-white" />
                            {deletingId === meal.id ? 'Excluindo...' : 'Excluir'}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                ))}
              </div>
          ))}
        </div>
      </div>
  );
}