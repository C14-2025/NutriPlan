import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./components/ui/card";
import { NutritionDashboard } from "./components/NutritionDashboard";
import { MealForm } from "./components/MealForm";
import { MealHistory } from "./components/MealHistory";
import { UserProfile } from "./components/UserProfile";
import { Calculator, History, Home, User } from "lucide-react";
import { refeicaoApi } from "./services/refeicaoApi";

export interface Meal {
  id: string;
  name: string;
  foodItems: any[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  date: string;
  mealType: "breakfast" | "lunch" | "dinner" | "snack";
}

export interface FoodItem {
  id: string;
  name: string;
  quantity: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface UserGoals {
  name?: string;
  age: number;
  weight: number;
  height: number;
  goal?: string;
  sex: string;
  activityLevel: string;
  dailyCalories: number;
  dailyProtein: number;
  dailyCarbs: number;
  dailyFat: number;
}

function App() {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [userGoals, setUserGoals] = useState<UserGoals>({
    sex: "male",
    age: 25,
    dailyCalories: 2000,
    dailyProtein: 150,
    dailyCarbs: 250,
    dailyFat: 67,
    weight: 70,
    height: 175,
    activityLevel: "moderate",
  });

  const handleUpdateGoals = (updatedGoals: UserGoals) => {
    setUserGoals(updatedGoals);
  };

  const reloadMeals = async () => {
    try {
      const usuarioId = Number(localStorage.getItem("usuarioId")) || 1;
      const res = await refeicaoApi.listarPorUsuario(usuarioId);
      // backend retorna Refeicao model; adapte campos se necessário
      const data = res.data || [];
      // mapear para a interface Meal esperada pelo front (se necessário)
      const mapped = data.map((r: any) => ({
        id: String(r.id),
        name: r.tipo || "Refeição",
        foodItems: Array.isArray(r.alimentos) ? r.alimentos.map((a: any) => ({
          id: String(a.id),
          name: a.nome,
          quantity: r.quantidadePorAlimento && r.quantidadePorAlimento[a.id] ? r.quantidadePorAlimento[a.id] : 1,
          unit: "",
          calories: a.calorias,
          protein: a.proteinas,
          carbs: a.carboidratos,
          fat: a.gorduras
        })) : [],
        totalCalories: 0,
        totalProtein: 0,
        totalCarbs: 0,
        totalFat: 0,
        date: r.dataHora ? r.dataHora.split("T")[0] : new Date().toISOString().split("T")[0],
        mealType: "lunch" // fallback — você pode mapear tipo textual pra enum se quiser
      }));
      setMeals(mapped);
    } catch (err) {
      console.error("Erro ao carregar refeições:", err);
    }
  };

  useEffect(() => {
    reloadMeals();
  }, []);

  const updateMeal = (id: string, updatedMeal: Omit<Meal, "id">) => {
    setMeals((prev) => prev.map((meal) => (meal.id === id ? { ...updatedMeal, id } : meal)));
  };

  const deleteMeal = (id: string) => {
    setMeals((prev) => prev.filter((meal) => meal.id !== id));
  };

  return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl mb-2">NutriPlan</h1>
            <p className="text-gray-600">Acompanhe sua alimentação e atinja suas metas nutricionais</p>
          </div>

          <Tabs defaultValue="dashboard" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="dashboard" className="flex items-center gap-2 cursor-pointer">
                <Home className="w-4 h-4" />
                Dashboard
              </TabsTrigger>
              <TabsTrigger value="add-meal" className="flex items-center gap-2 cursor-pointer">
                <Calculator className="w-4 h-4" />
                Adicionar Refeição
              </TabsTrigger>
              <TabsTrigger value="history" className="flex items-center gap-2 cursor-pointer">
                <History className="w-4 h-4" />
                Histórico
              </TabsTrigger>
              <TabsTrigger value="profile" className="flex items-center gap-2 cursor-pointer">
                <User className="w-4 h-4" />
                Perfil
              </TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard" className="mt-6">
              <NutritionDashboard meals={meals} userGoals={userGoals} />
            </TabsContent>

            <TabsContent value="add-meal" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Adicionar Nova Refeição</CardTitle>
                  <CardDescription>Registre os alimentos consumidos e calcule os macronutrientes</CardDescription>
                </CardHeader>
                <CardContent>
                  <MealForm onSuccess={reloadMeals} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="history" className="mt-6">
              <MealHistory meals={meals} onUpdateMeal={updateMeal} onDeleteMeal={deleteMeal} />
            </TabsContent>

            <TabsContent value="profile" className="mt-6">
              <UserProfile userGoals={userGoals} onUpdateGoals={handleUpdateGoals} userId={1} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
  );
}

export default App;
