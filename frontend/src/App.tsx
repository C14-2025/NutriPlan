import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { NutritionDashboard } from './components/NutritionDashboard';
import { MealForm } from './components/MealForm';
import { MealHistory } from './components/MealHistory';
import { UserProfile } from './components/UserProfile';
import { Calculator, History, Home, User } from 'lucide-react';

export interface Meal {
  id: string;
  name: string;
  foodItems: FoodItem[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  date: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
}

export interface FoodItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface UserGoals {
  name: string;
  age: number;
  weight: number;
  height: number;
  goal: string;
  sex: string;
  activityLevel: string;
  dailyCalories: number;
  dailyProtein: number;
  dailyCarbs: number;
  dailyFat: number;
}

function App() {

  const handleUpdateGoals = (updatedGoals: UserGoals) => {
    setUserGoals(updatedGoals);
  };

  const [meals, setMeals] = useState<Meal[]>([
    {
      id: '1',
      name: 'Breakfast',
      foodItems: [
        {
          id: '1',
          name: 'Oatmeal',
          quantity: 1,
          unit: 'cup',
          calories: 154,
          protein: 6,
          carbs: 28,
          fat: 3
        },
        {
          id: '2',
          name: 'Banana',
          quantity: 1,
          unit: 'medium',
          calories: 105,
          protein: 1,
          carbs: 27,
          fat: 0.4
        }
      ],
      totalCalories: 259,
      totalProtein: 7,
      totalCarbs: 55,
      totalFat: 3.4,
      date: new Date().toISOString().split('T')[0],
      mealType: 'breakfast'
    },
    {
      id: '2',
      name: 'Lunch',
      foodItems: [
        {
          id: '3',
          name: 'Grilled Chicken Breast',
          quantity: 150,
          unit: 'g',
          calories: 231,
          protein: 43.5,
          carbs: 0,
          fat: 5
        },
        {
          id: '4',
          name: 'Brown Rice',
          quantity: 0.5,
          unit: 'cup',
          calories: 108,
          protein: 2.5,
          carbs: 22,
          fat: 0.9
        }
      ],
      totalCalories: 339,
      totalProtein: 46,
      totalCarbs: 22,
      totalFat: 5.9,
      date: new Date().toISOString().split('T')[0],
      mealType: 'lunch'
    }
  ]);

  const [userGoals, setUserGoals] = useState<UserGoals>({
    sex: "male",
    age: 25,
    dailyCalories: 2000,
    dailyProtein: 150,
    dailyCarbs: 250,
    dailyFat: 67,
    weight: 70,
    height: 175,
    activityLevel: 'moderate'
  });

  const addMeal = (meal: Omit<Meal, 'id'>) => {
    const newMeal: Meal = {
      ...meal,
      id: Date.now().toString()
    };
    setMeals(prev => [...prev, newMeal]);
  };

  const updateMeal = (id: string, updatedMeal: Omit<Meal, 'id'>) => {
    setMeals(prev => prev.map(meal =>
      meal.id === id ? { ...updatedMeal, id } : meal
    ));
  };

  const deleteMeal = (id: string) => {
    setMeals(prev => prev.filter(meal => meal.id !== id));
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
                <CardDescription>
                  Registre os alimentos consumidos e calcule os macronutrientes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MealForm onAddMeal={addMeal} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="mt-6">
            <MealHistory
              meals={meals}
              onUpdateMeal={updateMeal}
              onDeleteMeal={deleteMeal}
            />
          </TabsContent>

          <TabsContent value="profile" className="mt-6">
            <UserProfile
                userGoals={userGoals}
                onUpdateGoals={handleUpdateGoals}
                userId={1}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default App;