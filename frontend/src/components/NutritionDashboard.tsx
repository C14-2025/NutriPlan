import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import {
  PieChart, Pie, Cell, ResponsiveContainer,
  LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend
} from 'recharts';
import type { UserGoals } from '../App';
import { Calendar, Target, TrendingUp } from 'lucide-react';
import { api } from '../services/api';

interface NutritionDashboardProps {
  userGoals: UserGoals;
}

export function NutritionDashboard({ userGoals }: NutritionDashboardProps) {
  const [weeklyData, setWeeklyData] = useState<any[]>([]);
  const [macrosToday, setMacrosToday] = useState<{ protein: number, carbs: number, fat: number } | null>(null);
  const [caloriasPorDia, setCaloriasPorDia] = useState<Record<string, number>>({});
  const [todayTotals, setTodayTotals] = useState({
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0
  });

  const today = new Date().toISOString().split('T')[0];

  // Buscar dados do backend
  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const [calRes, macrosRes, semanalRes] = await Promise.all([
          api.get("/dashboard/calorias-por-dia"),
          api.get(`/dashboard/macros-por-dia/${today}`),
          api.get("/dashboard/relatorio-semanal")
        ]);

        setCaloriasPorDia(calRes.data);
        setMacrosToday(macrosRes.data);
        setWeeklyData(semanalRes.data?.semanal || []);

        // Atualizar todayTotals com dados do backend
        const calories = calRes.data[today] || 0;
        const macros = macrosRes.data || { protein: 0, carbs: 0, fat: 0 };
        setTodayTotals({
          calories,
          protein: macros.protein,
          carbs: macros.carbs,
          fat: macros.fat
        });
      } catch (error) {
        console.error("Erro ao buscar dados do dashboard:", error);
      }
    }

    fetchDashboardData();
  }, [today]);

  // Calcular progresso
  const calorieProgress = Math.min((todayTotals.calories / userGoals.dailyCalories) * 100, 100);
  const proteinProgress = Math.min((todayTotals.protein / userGoals.dailyProtein) * 100, 100);
  const carbsProgress = Math.min((todayTotals.carbs / userGoals.dailyCarbs) * 100, 100);
  const fatProgress = Math.min((todayTotals.fat / userGoals.dailyFat) * 100, 100);

  // Dados do gráfico de macros (usando macrosToday)
  const macroData = [
    { name: 'Proteína', value: (macrosToday?.protein || 0) * 4, color: '#8884d8' },
    { name: 'Carboidratos', value: (macrosToday?.carbs || 0) * 4, color: '#82ca9d' },
    { name: 'Gordura', value: (macrosToday?.fat || 0) * 9, color: '#ffc658' }
  ];

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
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
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

          {/* Removemos o gráfico de distribuição por refeição */}
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