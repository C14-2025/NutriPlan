import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Separator } from './ui/separator';
import { Calendar, Edit, Trash2, Filter } from 'lucide-react';
import type { Meal, FoodItem } from '../App';

interface MealHistoryProps {
  meals: Meal[];
  onUpdateMeal: (id: string, meal: Omit<Meal, 'id'>) => void;
  onDeleteMeal: (id: string) => void;
}

export function MealHistory({ meals, onUpdateMeal, onDeleteMeal }: MealHistoryProps) {
  const [filter, setFilter] = useState<'all' | 'breakfast' | 'lunch' | 'dinner' | 'snack'>('all');
  const [dateFilter, setDateFilter] = useState('');
  const [editingMeal, setEditingMeal] = useState<Meal | null>(null);
  const [editFormData, setEditFormData] = useState<Omit<Meal, 'id'> | null>(null);

  // Filter meals based on type and date
  const filteredMeals = meals.filter(meal => {
    const typeMatch = filter === 'all' || meal.mealType === filter;
    const dateMatch = !dateFilter || meal.date === dateFilter;
    return typeMatch && dateMatch;
  });

  // Sort meals by date (newest first) and then by meal type order
  const sortedMeals = [...filteredMeals].sort((a, b) => {
    if (a.date !== b.date) {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    }

    const mealOrder = { breakfast: 0, lunch: 1, dinner: 2, snack: 3 };
    return mealOrder[a.mealType] - mealOrder[b.mealType];
  });

  const getMealTypeLabel = (type: string) => {
    const labels = {
      breakfast: 'Café da manhã',
      lunch: 'Almoço',
      dinner: 'Jantar',
      snack: 'Lanche'
    };
    return labels[type as keyof typeof labels] || type;
  };

  const getMealTypeBadgeVariant = (type: string) => {
    const variants = {
      breakfast: 'default',
      lunch: 'secondary',
      dinner: 'outline',
      snack: 'destructive'
    };
    return variants[type as keyof typeof variants] || 'default';
  };

  const handleEditMeal = (meal: Meal) => {
    setEditingMeal(meal);
    setEditFormData({
      name: meal.name,
      mealType: meal.mealType,
      date: meal.date,
      foodItems: [...meal.foodItems],
      totalCalories: meal.totalCalories,
      totalProtein: meal.totalProtein,
      totalCarbs: meal.totalCarbs,
      totalFat: meal.totalFat
    });
  };

  const handleSaveEdit = () => {
    if (editingMeal && editFormData) {
      onUpdateMeal(editingMeal.id, editFormData);
      setEditingMeal(null);
      setEditFormData(null);
    }
  };

  const handleDeleteMeal = (mealId: string) => {
    if (confirm('Tem certeza que deseja excluir esta refeição?')) {
      onDeleteMeal(mealId);
    }
  };

  const updateEditFormData = (field: keyof Omit<Meal, 'id'>, value: any) => {
    if (editFormData) {
      setEditFormData({ ...editFormData, [field]: value });
    }
  };

  const updateFoodItem = (foodId: string, field: keyof FoodItem, value: string | number) => {
    if (editFormData) {
      const updatedFoodItems = editFormData.foodItems.map(item =>
        item.id === foodId ? { ...item, [field]: value } : item
      );

      // Recalculate totals
      const totals = updatedFoodItems.reduce(
        (acc, item) => {
          const multiplier = item.quantity || 0;
          return {
            calories: acc.calories + (item.calories * multiplier),
            protein: acc.protein + (item.protein * multiplier),
            carbs: acc.carbs + (item.carbs * multiplier),
            fat: acc.fat + (item.fat * multiplier)
          };
        },
        { calories: 0, protein: 0, carbs: 0, fat: 0 }
      );

      setEditFormData({
        ...editFormData,
        foodItems: updatedFoodItems,
        totalCalories: totals.calories,
        totalProtein: totals.protein,
        totalCarbs: totals.carbs,
        totalFat: totals.fat
      });
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const isToday = (dateString: string) => {
    const today = new Date().toISOString().split('T')[0];
    return dateString === today;
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
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
              <Select value={filter} onValueChange={(value: any) => setFilter(value)}>
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
                placeholder="Filtrar por data"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Meals List */}
      <div className="space-y-4">
        {sortedMeals.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-muted-foreground">Nenhuma refeição encontrada com os filtros aplicados.</p>
            </CardContent>
          </Card>
        ) : (
          sortedMeals.map((meal) => (
            <Card key={meal.id}>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <CardTitle className="text-lg">{meal.name}</CardTitle>
                    <Badge variant={getMealTypeBadgeVariant(meal.mealType) as any}>
                      {getMealTypeLabel(meal.mealType)}
                    </Badge>
                    {isToday(meal.date) && (
                      <Badge variant="outline">Hoje</Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {formatDate(meal.date)}
                    </span>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Nutrition Summary */}
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

                {/* Food Items */}
                <div>
                  <h4 className="mb-2">Alimentos:</h4>
                  <div className="space-y-2">
                    {meal.foodItems.map((food) => (
                      <div key={food.id} className="flex justify-between items-center p-2 bg-background rounded border">
                        <span>{food.name}</span>
                        <span className="text-sm text-muted-foreground">
                          {food.quantity} {food.unit} ({Math.round(food.calories * food.quantity)} cal)
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Actions */}
                <div className="flex justify-end gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" onClick={() => handleEditMeal(meal)}>
                        <Edit className="w-4 h-4 mr-2" />
                        Editar
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Editar Refeição</DialogTitle>
                        <DialogDescription>
                          Faça alterações na refeição e clique em salvar.
                        </DialogDescription>
                      </DialogHeader>

                      {editFormData && (
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label>Nome da Refeição</Label>
                              <Input
                                value={editFormData.name}
                                onChange={(e) => updateEditFormData('name', e.target.value)}
                              />
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
                                    placeholder="Qtd"
                                  />
                                  <Input
                                    value={food.unit}
                                    onChange={(e) => updateFoodItem(food.id, 'unit', e.target.value)}
                                    placeholder="Unidade"
                                  />
                                  <Input
                                    type="number"
                                    value={food.calories}
                                    onChange={(e) => updateFoodItem(food.id, 'calories', Number(e.target.value))}
                                    placeholder="Cal"
                                  />
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="flex justify-end gap-2">
                            <Button variant="outline" onClick={() => setEditingMeal(null)}>
                              Cancelar
                            </Button>
                            <Button onClick={handleSaveEdit}>
                              Salvar Alterações
                            </Button>
                          </div>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteMeal(meal.id)}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Excluir
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}