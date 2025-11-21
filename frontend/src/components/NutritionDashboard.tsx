import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import {
  PieChart, Pie, Cell, ResponsiveContainer,
  LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend
} from 'recharts';
import type { UserGoals } from '../App';
import { Calendar, Target, TrendingUp } from 'lucide-react';
import { dashboardApi } from "../services/dashboardApi.ts";

interface NutritionDashboardProps {
  userGoals: UserGoals;
}

interface MacrosDiarios {
  calorias: number;
  proteinas: number;
  carboidratos: number;
  gorduras: number;
}

interface DistribuicaoCalorica {
  caloriasProteina: number;
  caloriasCarboidrato: number;
  caloriasGordura: number;
}

interface RelatorioSemanalDiario {
  day: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export function NutritionDashboard({ userGoals }: NutritionDashboardProps) {

  const [weeklyData, setWeeklyData] = useState<RelatorioSemanalDiario[]>([]);
  const [macrosToday, setMacrosToday] = useState<MacrosDiarios | null>(null);
  const [macroDistribution, setMacroDistribution] = useState<DistribuicaoCalorica | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const usuarioId = Number(localStorage.getItem("usuarioId")) || 1;
        const today = new Date().toLocaleDateString("en-CA", { timeZone: "America/Sao_Paulo" });

        const [macrosRes, semanalRes, distribRes] = await Promise.all([
          dashboardApi.getMacrosPorDia(usuarioId, today),
          dashboardApi.getRelatorioSemanal(usuarioId),
          dashboardApi.getDistribuicaoCalorica(usuarioId, today)
        ]);

        setMacrosToday(macrosRes);

        // Add today's data to weekly data if not present
        const todayExists = semanalRes.some((day: RelatorioSemanalDiario) => day.day === today);
        if (!todayExists && macrosRes) {
          const todayData = {
            day: today,
            calories: macrosRes.calorias || 0,
            protein: macrosRes.proteinas || 0,
            carbs: macrosRes.carboidratos || 0,
            fat: macrosRes.gorduras || 0
          };
          semanalRes.push(todayData);
        }

        setWeeklyData(semanalRes);
        setMacroDistribution(distribRes);

      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    }

    fetchData();
  }, []);

  const todayTotals = {
    calories: macrosToday?.calorias || 0,
    protein: macrosToday?.proteinas || 0,
    carbs: macrosToday?.carboidratos || 0,
    fat: macrosToday?.gorduras || 0
  };

  const calorieProgress = Math.min((todayTotals.calories / (userGoals.dailyCalories || 1)) * 100, 100);
  const proteinProgress = Math.min((todayTotals.protein / (userGoals.dailyProtein || 1)) * 100, 100);
  const carbsProgress = Math.min((todayTotals.carbs / (userGoals.dailyCarbs || 1)) * 100, 100);
  const fatProgress = Math.min((todayTotals.fat / (userGoals.dailyFat || 1)) * 100, 100);

  const macroData = [
    { name: 'Proteína', value: macroDistribution?.caloriasProteina || 0, color: '#8884d8' },
    { name: 'Carboidratos', value: macroDistribution?.caloriasCarboidrato || 0, color: '#82ca9d' },
    { name: 'Gordura', value: macroDistribution?.caloriasGordura || 0, color: '#ffc658' }
  ];

  return (
    <div className="space-y-6">
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
              {Math.round((userGoals.dailyCalories || 0) - todayTotals.calories)} restantes de {userGoals.dailyCalories || 0}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Proteína</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl mb-2">{todayTotals.protein.toFixed(1)}g</div>
            <Progress value={proteinProgress} className="mb-2" />
            <p className="text-xs text-muted-foreground">
              {((userGoals.dailyProtein || 0) - todayTotals.protein).toFixed(1)}g restantes de {userGoals.dailyProtein || 0}g
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Carboidratos</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl mb-2">{todayTotals.carbs.toFixed(1)}g</div>
            <Progress value={carbsProgress} className="mb-2" />
            <p className="text-xs text-muted-foreground">
              {((userGoals.dailyCarbs || 0) - todayTotals.carbs).toFixed(1)}g restantes de {userGoals.dailyCarbs || 0}g
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Gordura</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl mb-2">{todayTotals.fat.toFixed(1)}g</div>
            <Progress value={fatProgress} className="mb-2" />
            <p className="text-xs text-muted-foreground">
              {((userGoals.dailyFat || 0) - todayTotals.fat).toFixed(1)}g restantes de {userGoals.dailyFat || 0}g
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6">
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
                  label={(props: any) => {
                    const total = macroData.reduce((sum, entry) => sum + entry.value, 0);
                    const percent = total > 0 ? (props.value / total) * 100 : 0;
                    return `${props.name} ${percent.toFixed(0)}%`;
                  }}
                  outerRadius={80}
                  dataKey="value"
                >
                  {macroData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>


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