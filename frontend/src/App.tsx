import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./components/ui/card";
import { NutritionDashboard } from "./components/NutritionDashboard";
import { MealForm } from "./components/MealForm";
import { MealHistory } from "./components/MealHistory";
import { UserProfile } from "./components/UserProfile";
import { Login } from "./components/Login";
import { Register } from "./components/Register";
import { Calculator, History, Home, User, LogOut } from "lucide-react";
import { refeicaoApi } from "./services/refeicaoApi";
import { Button } from "./components/ui/button";

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
  usuario: {
    id: number;
  };
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
  gender?: string;
  activityLevel?: string;
  dailyCalories: number;
  dailyProtein: number;
  dailyCarbs: number;
  dailyFat: number;
}

function App() {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [userGoals, setUserGoals] = useState<UserGoals>({
    age: 25,
    dailyCalories: 2000,
    dailyProtein: 150,
    dailyCarbs: 250,
    dailyFat: 67,
    weight: 70,
    height: 175,
    gender: '',
    activityLevel: ''
  });

  useEffect(() => {
    const usuarioId = localStorage.getItem('usuarioId');
    const usuarioNome = localStorage.getItem('usuarioNome');
    if (usuarioId && usuarioNome) {
      setIsAuthenticated(true);
      setCurrentUser({ 
        id: usuarioId, 
        nome: usuarioNome,
        email: localStorage.getItem('usuarioEmail'),
        idade: localStorage.getItem('usuarioIdade'),
        peso: localStorage.getItem('usuarioPeso'),
        altura: localStorage.getItem('usuarioAltura'),
        objetivo: localStorage.getItem('usuarioObjetivo'),
        sexo: localStorage.getItem('usuarioSexo'),
        nivelAtividade: localStorage.getItem('usuarioNivelAtividade')
      });
    }
  }, []);

  const handleUpdateGoals = (updatedGoals: UserGoals) => {
    setUserGoals(updatedGoals);
  };

  const reloadMeals = async () => {
    try {
      const usuarioId = Number(localStorage.getItem("usuarioId"));
      if (!usuarioId) {
        console.log("Usuário não encontrado");
        return;
      }
      
      const res = await refeicaoApi.listarPorUsuario(usuarioId);
      const data = res.data || [];
      
      if (data.length === 0) {
        console.log("Nenhuma refeição encontrada para o usuário");
        setMeals([]);
        return;
      }
      
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
        mealType: "lunch"
      }));
      setMeals(mapped);
    } catch (err: any) {
      console.error("Erro ao carregar refeições:", err);
      setMeals([]);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      reloadMeals();
    }
  }, [isAuthenticated]);

  const updateMeal = (id: string, updatedMeal: Omit<Meal, "id">) => {
    setMeals((prev) => prev.map((meal) => (meal.id === id ? { ...updatedMeal, id } : meal)));
  };

  const deleteMeal = (id: string) => {
    setMeals((prev) => prev.filter((meal) => meal.id !== id));
  };

  const handleLoginSuccess = (usuario: any) => {
    setCurrentUser(usuario);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('usuarioId');
    localStorage.removeItem('usuarioNome');
    localStorage.removeItem('usuarioEmail');
    localStorage.removeItem('usuarioIdade');
    localStorage.removeItem('usuarioPeso');
    localStorage.removeItem('usuarioAltura');
    localStorage.removeItem('usuarioObjetivo');
    localStorage.removeItem('usuarioSexo');
    localStorage.removeItem('usuarioNivelAtividade');
    setIsAuthenticated(false);
    setCurrentUser(null);
    setMeals([]);
  };

  if (!isAuthenticated) {
    return showRegister ? (
      <Register 
        onRegisterSuccess={handleLoginSuccess}
        onSwitchToLogin={() => setShowRegister(false)}
      />
    ) : (
      <Login 
        onLoginSuccess={handleLoginSuccess}
        onSwitchToRegister={() => setShowRegister(true)}
      />
    );
  }



  return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-3xl mb-2">NutriPlan</h1>
              <p className="text-gray-600">Bem-vindo, {currentUser?.nome}!</p>
            </div>
            <Button onClick={handleLogout} variant="outline">
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
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
              <NutritionDashboard userGoals={userGoals} />
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
              <UserProfile userGoals={userGoals} onUpdateGoals={handleUpdateGoals} userId={Number(currentUser?.id)} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
  );
}

export default App;
