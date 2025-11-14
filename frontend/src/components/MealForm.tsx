import React, { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Separator } from "./ui/separator";
import { Plus, Trash2, Calculator } from "lucide-react";
import type { Meal, FoodItem } from "../App";
import { refeicaoApi } from "../services/refeicaoApi";
import { alimentoApi } from "../services/alimentoApi";

interface MealFormProps {
  // chamado quando a refeição for salva com sucesso (para recarregar lista)
  onSuccess?: () => void;
}

// Common foods database for quick selection
const commonFoods = [
  { name: "Arroz branco", calories: 130, protein: 2.7, carbs: 28, fat: 0.3, unit: "xícara" },
  { name: "Arroz integral", calories: 108, protein: 2.5, carbs: 22, fat: 0.9, unit: "xícara" },
  { name: "Feijão preto", calories: 227, protein: 15, carbs: 41, fat: 0.9, unit: "xícara" },
  { name: "Peito de frango grelhado", calories: 154, protein: 29, carbs: 0, fat: 3.3, unit: "100g" },
  { name: "Ovo inteiro", calories: 68, protein: 6, carbs: 0.4, fat: 4.8, unit: "unidade" },
  { name: "Banana", calories: 105, protein: 1.3, carbs: 27, fat: 0.4, unit: "média" },
  { name: "Maçã", calories: 95, protein: 0.5, carbs: 25, fat: 0.3, unit: "média" },
  { name: "Aveia", calories: 154, protein: 6, carbs: 28, fat: 3, unit: "xícara" },
  { name: "Leite integral", calories: 149, protein: 8, carbs: 12, fat: 8, unit: "xícara" },
  { name: "Pão integral", calories: 81, protein: 4, carbs: 14, fat: 1.1, unit: "fatia" },
];

export function MealForm({ onSuccess }: MealFormProps) {
  const [mealName, setMealName] = useState("");
  const [mealType, setMealType] = useState<"breakfast" | "lunch" | "dinner" | "snack">("breakfast");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [loading, setLoading] = useState(false);
  const [foodItems, setFoodItems] = useState<FoodItem[]>([
    {
      id: "1",
      name: "",
      quantity: 0,
      unit: "",
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
    },
  ]);

  const addFoodItem = () => {
    const newId = (foodItems.length + 1).toString();
    setFoodItems([
      ...foodItems,
      {
        id: newId,
        name: "",
        quantity: 0,
        unit: "",
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
      },
    ]);
  };

  const removeFoodItem = (id: string) => {
    if (foodItems.length > 1) {
      setFoodItems(foodItems.filter((item) => item.id !== id));
    }
  };

  const updateFoodItem = (id: string, field: keyof FoodItem, value: string | number) => {
    setFoodItems((prev) => prev.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
  };

  const selectCommonFood = (id: string, foodName: string) => {
    const food = commonFoods.find((f) => f.name === foodName);
    if (food) {
      updateFoodItem(id, "name", food.name);
      updateFoodItem(id, "unit", food.unit);
      updateFoodItem(id, "quantity", 1);
      updateFoodItem(id, "calories", food.calories);
      updateFoodItem(id, "protein", food.protein);
      updateFoodItem(id, "carbs", food.carbs);
      updateFoodItem(id, "fat", food.fat);
    }
  };

  const calculateTotals = () =>
      foodItems.reduce(
          (acc, item) => {
            const multiplier = item.quantity || 0;
            return {
              calories: acc.calories + item.calories * multiplier,
              protein: acc.protein + item.protein * multiplier,
              carbs: acc.carbs + item.carbs * multiplier,
              fat: acc.fat + item.fat * multiplier,
            };
          },
          { calories: 0, protein: 0, carbs: 0, fat: 0 }
      );

  const resetForm = () => {
    setMealName("");
    setMealType("breakfast");
    setDate(new Date().toISOString().split("T")[0]);
    setFoodItems([
      {
        id: "1",
        name: "",
        quantity: 0,
        unit: "",
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
      },
    ]);
  };

  // Map your frontend mealType to backend Portuguese 'tipo'
  const tipoMap: Record<string, string> = {
    breakfast: "Café da manhã",
    lunch: "Almoço",
    dinner: "Jantar",
    snack: "Lanche",
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validFoodItems = foodItems.filter((item) => item.name && item.quantity > 0);

    if (!mealName || validFoodItems.length === 0) {
      alert("Por favor, preencha o nome da refeição e adicione pelo menos um alimento.");
      return;
    }

    setLoading(true);
    try {
      const usuarioId = Number(localStorage.getItem("usuarioId")) || 1; // ajuste conforme seu fluxo
      // 1) criar refeição (apenas com tipo e usuario)
      const refeicaoPayload = {
        tipo: tipoMap[mealType],
        usuario: { id: usuarioId },
      };
      const refeicaoRes = await refeicaoApi.criar(refeicaoPayload);
      const refeicaoId: number = refeicaoRes.data.id;

      // 2) para cada alimento: criar alimento e associar à refeição
      for (const item of validFoodItems) {
        // criar alimento no backend
        const alimentoPayload = {
          nome: item.name,
          calorias: item.calories,
          proteinas: item.protein,
          carboidratos: item.carbs,
          gorduras: item.fat,
        };
        const alimentoRes = await alimentoApi.criar(alimentoPayload);
        const alimentoId: number = alimentoRes.data.id;

        // associar
        await refeicaoApi.adicionarAlimento(refeicaoId, alimentoId, item.quantity);
      }

      // 3) opcional: buscar totais do servidor (se quiser exibir)
      const totaisRes = await refeicaoApi.calcularTotais(refeicaoId);
      // totaisRes.data tem os totais (Calorias, Proteinas, Carboidratos, Gorduras)

      alert("Refeição salva com sucesso!");
      resetForm();
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error(error);
      alert("Erro ao salvar a refeição. Verifique o servidor.");
    } finally {
      setLoading(false);
    }
  };

  const totals = calculateTotals();

  return (
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Meal Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="meal-type" className="mb-2 block">Tipo de Refeição</Label>
            <Select value={mealType} onValueChange={(value: any) => setMealType(value)}>
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

          <div>
            <Label htmlFor="meal-date" className="mb-2 block">Data</Label>
            <Input
                id="meal-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full"
                required
            />
          </div>
        </div>

        <Separator />

        {/* Food Items */}
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
                        <Button type="button" onClick={() => removeFoodItem(item.id)} variant="outline" size="sm">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Quick Select */}
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

                  {/* Campos do alimento */}
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
                      <Label className="mb-2 block">Quantidade</Label>
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
                          placeholder="0"
                          min="0"
                      />
                    </div>

                    <div>
                      <Label className="mb-2 block">Proteína (base 100g)</Label>
                      <Input
                          type="number"
                          value={item.protein || ""}
                          onChange={(e) => updateFoodItem(item.id, "protein", Number(e.target.value))}
                          placeholder="0"
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
                          placeholder="0"
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
                          placeholder="0"
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

        {/* Totals */}
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
                <div className="text-2xl">{Math.round(totals.protein)}g</div>
                <div className="text-sm text-muted-foreground">Proteína</div>
              </div>
              <div>
                <div className="text-2xl">{Math.round(totals.carbs)}g</div>
                <div className="text-sm text-muted-foreground">Carboidratos</div>
              </div>
              <div>
                <div className="text-2xl">{Math.round(totals.fat)}g</div>
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
