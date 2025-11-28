import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Separator } from "./ui/separator";
import { Plus, Trash2, Calculator } from "lucide-react";
import type { FoodItem } from "../App";
import { refeicaoApi } from "../services/refeicaoApi";
import { alimentoApi } from "../services/alimentoApi";

interface MealFormProps {
  onSuccess?: () => void;
}

const commonFoods = [
  { name: "Arroz branco cozido", calories: 130, protein: 2.4, carbs: 28.2, fat: 0.3 },
  { name: "Arroz integral cozido", calories: 112, protein: 2.3, carbs: 23.5, fat: 0.8 },
  { name: "Feijão preto cozido", calories: 132, protein: 8.9, carbs: 23.7, fat: 0.5 },
  { name: "Peito de frango grelhado", calories: 165, protein: 31, carbs: 0, fat: 3.6 },
  { name: "Ovo inteiro", calories: 143, protein: 13, carbs: 1.1, fat: 9.5 },
  { name: "Banana", calories: 89, protein: 1.1, carbs: 22.8, fat: 0.3 },
  { name: "Maçã", calories: 52, protein: 0.3, carbs: 14, fat: 0.2 },
  { name: "Aveia", calories: 389, protein: 17, carbs: 66, fat: 7 },
  { name: "Pão integral", calories: 247, protein: 13, carbs: 41, fat: 4.2 },
];

export function MealForm({ onSuccess }: MealFormProps) {
  const [mealType, setMealType] = useState<"breakfast" | "lunch" | "dinner" | "snack">("breakfast");
  const [loading, setLoading] = useState(false);

  const [foodItems, setFoodItems] = useState<FoodItem[]>([
    { id: "1", name: "", quantity: 0, calories: 0, protein: 0, carbs: 0, fat: 0 },
  ]);

  const [totals, setTotals] = useState({
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
  });

  const calculateTotals = (items: FoodItem[]) => {
    return items.reduce(
        (acc, item) => {
          const qty = item.quantity || 0;
          const calories = item.calories || 0;
          const protein = item.protein || 0;
          const carbs = item.carbs || 0;
          const fat = item.fat || 0;
          
          return {
            calories: acc.calories + (calories / 100) * qty,
            protein: acc.protein + (protein / 100) * qty,
            carbs: acc.carbs + (carbs / 100) * qty,
            fat: acc.fat + (fat / 100) * qty,
          };
        },
        { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );
  };

  useEffect(() => {
    setTotals(calculateTotals(foodItems));
  }, [foodItems]);

  const addFoodItem = () => {
    const newId = (foodItems.length + 1).toString();
    setFoodItems([
      ...foodItems,
      { id: newId, name: "", quantity: 0, calories: 0, protein: 0, carbs: 0, fat: 0 },
    ]);
  };

  const removeFoodItem = (id: string) => {
    if (foodItems.length > 1) {
      setFoodItems(foodItems.filter((item) => item.id !== id));
    }
  };

  const updateFoodItem = (id: string, field: keyof FoodItem, value: string | number) => {
    setFoodItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const selectCommonFood = (id: string, foodName: string) => {
    const food = commonFoods.find((f) => f.name === foodName);
    if (food) {
      updateFoodItem(id, "name", food.name);
      updateFoodItem(id, "quantity", 1);
      updateFoodItem(id, "calories", food.calories);
      updateFoodItem(id, "protein", food.protein);
      updateFoodItem(id, "carbs", food.carbs);
      updateFoodItem(id, "fat", food.fat);
    }
  };

  const resetForm = () => {
    setMealType("breakfast");
    setFoodItems([{ id: "1", name: "", quantity: 0, calories: 0, protein: 0, carbs: 0, fat: 0 }]);
  };

  const tipoMap: Record<string, string> = {
    breakfast: "Café da manhã",
    lunch: "Almoço",
    dinner: "Jantar",
    snack: "Lanche",
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validFoodItems = foodItems.filter((item) => item.name && item.quantity > 0);

    if (validFoodItems.length === 0) {
      alert("Adicione pelo menos um alimento antes de salvar a refeição!");
      return;
    }

    setLoading(true);

    try {
      const usuarioId = Number(localStorage.getItem("usuarioId")) || 1;

      // ➜ sem enviar data
      const refeicaoPayload = {
        tipo: tipoMap[mealType],
        usuario: { id: usuarioId },
      };

      const refeicaoRes = await refeicaoApi.criar(refeicaoPayload);
      const refeicaoId: number = refeicaoRes.data.id;

      for (const item of validFoodItems) {
        const alimentoPayload = {
          nome: item.name,
          calorias: item.calories,
          proteinas: item.protein,
          carboidratos: item.carbs,
          gorduras: item.fat,
        };

        const alimentoRes = await alimentoApi.criar(alimentoPayload);
        const alimentoId: number = alimentoRes.data.id;

        await refeicaoApi.adicionarAlimento(refeicaoId, alimentoId, item.quantity);
      }

      const totaisRes = await refeicaoApi.calcularTotais(refeicaoId);
      setTotals(totaisRes.data);

      alert("Refeição salva com sucesso!");
      resetForm();
      onSuccess?.();
    } catch (error) {
      console.error(error);
      alert("Erro ao salvar a refeição. Verifique o servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
      <form onSubmit={handleSubmit} className="space-y-6">

        <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
          <div>
            <Label className="mb-2 block">Tipo de Refeição</Label>
            <Select value={mealType} onValueChange={(value: never) => setMealType(value)}>
              <SelectTrigger className="w-full">
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
        </div>

        <Separator />

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg">Alimentos</h3>
            <Button type="button" onClick={addFoodItem} variant="outline" size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Alimento
            </Button>
          </div>

          {foodItems.map((item, index) => (
              <Card key={item.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">Alimento {index + 1}</CardTitle>
                    {foodItems.length > 1 && (
                        <Button
                            type="button"
                            onClick={() => removeFoodItem(item.id)}
                            variant="outline"
                            size="sm"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="w-full">
                    <Label className="mb-2 block">Selecionar Alimento Comum</Label>
                    <Select onValueChange={(value) => selectCommonFood(item.id, value)}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Escolha um alimento comum..." />
                      </SelectTrigger>
                      <SelectContent>
                        {commonFoods.map((food) => (
                            <SelectItem key={food.name} value={food.name}>
                              {food.name}
                            </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                    <div className="w-full">
                      <Label className="mb-2 block">Nome do Alimento</Label>
                      <Input
                          value={item.name}
                          onChange={(e) => updateFoodItem(item.id, "name", e.target.value)}
                          placeholder="Ex: Arroz branco"
                          className="w-full"
                      />
                    </div>

                    <div className="w-full">
                      <Label className="mb-2 block">Quantidade (g)</Label>
                      <Input
                          type="number"
                          value={item.quantity || ""}
                          onChange={(e) => updateFoodItem(item.id, "quantity", Number(e.target.value))}
                          placeholder="1"
                          min="0"
                          step="0.1"
                          className="w-full"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <Label className="mb-2 block">Calorias (base 100g)</Label>
                      <Input
                          type="number"
                          value={item.calories || ""}
                          onChange={(e) => updateFoodItem(item.id, "calories", Number(e.target.value))}
                          min="0"
                      />
                    </div>

                    <div>
                      <Label className="mb-2 block">Proteína (base 100g)</Label>
                      <Input
                          type="number"
                          value={item.protein || ""}
                          onChange={(e) => updateFoodItem(item.id, "protein", Number(e.target.value))}
                          min="0"
                          step="0.1"
                      />
                    </div>

                    <div>
                      <Label className="mb-2 block">Carboidratos (base 100g)</Label>
                      <Input
                          type="number"
                          value={item.carbs || ""}
                          onChange={(e) => updateFoodItem(item.id, "carbs", Number(e.target.value))}
                          min="0"
                          step="0.1"
                      />
                    </div>

                    <div>
                      <Label className="mb-2 block">Gordura (base 100g)</Label>
                      <Input
                          type="number"
                          value={item.fat || ""}
                          onChange={(e) => updateFoodItem(item.id, "fat", Number(e.target.value))}
                          min="0"
                          step="0.1"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
          ))}
        </div>

        <Separator />

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="w-5 h-5" />
              Totais da Refeição
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl">{Math.round(totals.calories)}</div>
                <div className="text-sm text-muted-foreground">Calorias</div>
              </div>
              <div>
                <div className="text-2xl">{(totals.protein || 0).toFixed(1)}g</div>
                <div className="text-sm text-muted-foreground">Proteína</div>
              </div>
              <div>
                <div className="text-2xl">{(totals.carbs || 0).toFixed(1)}g</div>
                <div className="text-sm text-muted-foreground">Carboidratos</div>
              </div>
              <div>
                <div className="text-2xl">{(totals.fat || 0).toFixed(1)}g</div>
                <div className="text-sm text-muted-foreground">Gordura</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Salvando..." : "Adicionar Refeição"}
        </Button>
      </form>
  );
}
