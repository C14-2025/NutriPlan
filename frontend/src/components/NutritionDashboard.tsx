import React, { useState, useEffect } from "react";
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
        const usuarioId = 1;
        const today = new Date().toISOString().split('T')[0];

        const [macrosRes, semanalRes, distribRes] = await Promise.all([
          dashboardApi.getMacrosPorDia(usuarioId, today),
          dashboardApi.getRelatorioSemanal(usuarioId),
          dashboardApi.getDistribuicaoCalorica(usuarioId, today)
        ]);

        setMacrosToday(macrosRes);
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

  const calorieProgress = Math.min((todayTotals.calories / userGoals.dailyCalories) * 100, 100);
  const proteinProgress = Math.min((todayTotals.protein / userGoals.dailyProtein) * 100, 100);
  const carbsProgress = Math.min((todayTotals.carbs / userGoals.dailyCarbs) * 100, 100);
  const fatProgress = Math.min((todayTotals.fat / userGoals.dailyFat) * 100, 100);

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
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
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