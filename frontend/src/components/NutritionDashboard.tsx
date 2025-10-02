import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line } from 'recharts';
import type { Meal, UserGoals } from '../App';
import { Calendar, Target, TrendingUp } from 'lucide-react';

interface NutritionDashboardProps {
  meals: Meal[];
  userGoals: UserGoals;
}

export function NutritionDashboard({ meals, userGoals }: NutritionDashboardProps) {
  // Calculate today's totals
  const today = new Date().toISOString().split('T')[0];
  const todayMeals = meals.filter(meal => meal.date === today);

  const todayTotals = todayMeals.reduce(
    (acc, meal) => ({
      calories: acc.calories + meal.totalCalories,
      protein: acc.protein + meal.totalProtein,
      carbs: acc.carbs + meal.totalCarbs,
      fat: acc.fat + meal.totalFat
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  // Calculate progress percentages
  const calorieProgress = Math.min((todayTotals.calories / userGoals.dailyCalories) * 100, 100);
  const proteinProgress = Math.min((todayTotals.protein / userGoals.dailyProtein) * 100, 100);
  const carbsProgress = Math.min((todayTotals.carbs / userGoals.dailyCarbs) * 100, 100);
  const fatProgress = Math.min((todayTotals.fat / userGoals.dailyFat) * 100, 100);

  // Pie chart data for macros
  const macroData = [
    { name: 'Proteína', value: todayTotals.protein * 4, color: '#8884d8' },
    { name: 'Carboidratos', value: todayTotals.carbs * 4, color: '#82ca9d' },
    { name: 'Gordura', value: todayTotals.fat * 9, color: '#ffc658' }
  ];

  // Weekly data (mock data for demonstration)
  const weeklyData = [
    { day: 'Seg', calories: 1850, protein: 145, carbs: 220, fat: 62 },
    { day: 'Ter', calories: 2100, protein: 155, carbs: 245, fat: 70 },
    { day: 'Qua', calories: 1950, protein: 148, carbs: 230, fat: 65 },
    { day: 'Qui', calories: 2200, protein: 165, carbs: 250, fat: 75 },
    { day: 'Sex', calories: 1800, protein: 140, carbs: 210, fat: 58 },
    { day: 'Sáb', calories: 2300, protein: 170, carbs: 260, fat: 80 },
    { day: 'Dom', calories: todayTotals.calories, protein: todayTotals.protein, carbs: todayTotals.carbs, fat: todayTotals.fat }
  ];

  // Meal distribution data
  const mealDistribution = todayMeals.map(meal => ({
    name: meal.name,
    calories: meal.totalCalories,
    protein: meal.totalProtein,
    carbs: meal.totalCarbs,
    fat: meal.totalFat
  }));

  return (
    <div className="space-y-6">
      {/* Daily Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Calorias</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl mb-2">{Math.round(todayTotals.calories)}</div>
            <Progress value={calorieProgress} className="mb-2" />
            <p className="text-xs text-muted-foreground">
              {Math.round(userGoals.dailyCalories - todayTotals.calories)} restantes de {userGoals.dailyCalories}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Proteína</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl mb-2">{Math.round(todayTotals.protein)}g</div>
            <Progress value={proteinProgress} className="mb-2" />
            <p className="text-xs text-muted-foreground">
              {Math.round(userGoals.dailyProtein - todayTotals.protein)}g restantes de {userGoals.dailyProtein}g
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Carboidratos</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl mb-2">{Math.round(todayTotals.carbs)}g</div>
            <Progress value={carbsProgress} className="mb-2" />
            <p className="text-xs text-muted-foreground">
              {Math.round(userGoals.dailyCarbs - todayTotals.carbs)}g restantes de {userGoals.dailyCarbs}g
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Gordura</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl mb-2">{Math.round(todayTotals.fat)}g</div>
            <Progress value={fatProgress} className="mb-2" />
            <p className="text-xs text-muted-foreground">
              {Math.round(userGoals.dailyFat - todayTotals.fat)}g restantes de {userGoals.dailyFat}g
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Macro Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Distribuição de Macronutrientes</CardTitle>
            <CardDescription>Distribuição calórica por macronutriente hoje</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={macroData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${((percent as number) * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {macroData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Meal Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Distribuição por Refeição</CardTitle>
            <CardDescription>Calorias consumidas por refeição hoje</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={mealDistribution}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="calories" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Trends */}
      <Card>
        <CardHeader>
          <CardTitle>Tendência Semanal</CardTitle>
          <CardDescription>Progresso dos últimos 7 dias</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="calories" stroke="#8884d8" name="Calorias" />
              <Line type="monotone" dataKey="protein" stroke="#82ca9d" name="Proteína (g)" />
              <Line type="monotone" dataKey="carbs" stroke="#ffc658" name="Carboidratos (g)" />
              <Line type="monotone" dataKey="fat" stroke="#ff7300" name="Gordura (g)" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}