import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';
import { Calculator, Save, Target, User, Activity } from 'lucide-react';
import type { UserGoals } from '../App';

interface UserProfileProps {
  userGoals: UserGoals;
  onUpdateGoals: (goals: UserGoals) => void;
}

export function UserProfile({ userGoals, onUpdateGoals }: UserProfileProps) {
  const [formData, setFormData] = useState<UserGoals>(userGoals);
  const [isEditing, setIsEditing] = useState(false);

  const updateFormData = (field: keyof UserGoals, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const calculateBMR = () => {
    // Fórmula de Harris-Benedict para homens (simplificada)
    // BMR = 88.362 + (13.397 × peso) + (4.799 × altura) - (5.677 × idade)
    // Para demonstração, assumindo idade média de 30 anos
    const age = 30;
    const bmr = 88.362 + (13.397 * formData.weight) + (4.799 * formData.height) - (5.677 * age);
    return Math.round(bmr);
  };

  const calculateCalorieNeeds = () => {
    const bmr = calculateBMR();
    const activityMultipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      'very-active': 1.9
    };

    const multiplier = activityMultipliers[formData.activityLevel as keyof typeof activityMultipliers] || 1.55;
    return Math.round(bmr * multiplier);
  };

  const calculateMacroGoals = () => {
    const calories = calculateCalorieNeeds();

    // Distribuição padrão: 30% proteína, 40% carboidratos, 30% gordura
    const protein = Math.round((calories * 0.30) / 4); // 4 cal/g
    const carbs = Math.round((calories * 0.40) / 4); // 4 cal/g
    const fat = Math.round((calories * 0.30) / 9); // 9 cal/g

    return { calories, protein, carbs, fat };
  };

  const handleAutoCalculate = () => {
    const calculated = calculateMacroGoals();
    setFormData(prev => ({
      ...prev,
      dailyCalories: calculated.calories,
      dailyProtein: calculated.protein,
      dailyCarbs: calculated.carbs,
      dailyFat: calculated.fat
    }));
  };

  const handleSave = () => {
    onUpdateGoals(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData(userGoals);
    setIsEditing(false);
  };

  const getBMI = () => {
    const heightInMeters = formData.height / 100;
    const bmi = formData.weight / (heightInMeters * heightInMeters);
    return bmi.toFixed(1);
  };

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { category: 'Abaixo do peso', variant: 'secondary' };
    if (bmi < 25) return { category: 'Peso normal', variant: 'default' };
    if (bmi < 30) return { category: 'Sobrepeso', variant: 'outline' };
    return { category: 'Obesidade', variant: 'destructive' };
  };

  const getActivityLabel = (level: string) => {
    const labels = {
      sedentary: 'Sedentário (pouco ou nenhum exercício)',
      light: 'Levemente ativo (exercício leve 1-3 dias/semana)',
      moderate: 'Moderadamente ativo (exercício moderado 3-5 dias/semana)',
      active: 'Muito ativo (exercício intenso 6-7 dias/semana)',
      'very-active': 'Extremamente ativo (exercício muito intenso, trabalho físico)'
    };
    return labels[level as keyof typeof labels] || level;
  };

  const bmi = parseFloat(getBMI());
  const bmiCategory = getBMICategory(bmi);

  return (
    <div className="space-y-6">
      {/* Profile Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <User className="w-5 h-5" />
              <CardTitle>Perfil do Usuário</CardTitle>
            </div>
            <Button
              variant={isEditing ? "outline" : "default"}
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? 'Cancelar' : 'Editar Perfil'}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Peso (kg)</Label>
              <Input
                type="number"
                value={formData.weight}
                onChange={(e) => updateFormData('weight', Number(e.target.value))}
                disabled={!isEditing}
              />
            </div>

            <div>
              <Label>Altura (cm)</Label>
              <Input
                type="number"
                value={formData.height}
                onChange={(e) => updateFormData('height', Number(e.target.value))}
                disabled={!isEditing}
              />
            </div>
          </div>

          <div>
            <Label>Nível de Atividade</Label>
            <Select
              value={formData.activityLevel}
              onValueChange={(value: string) => updateFormData('activityLevel', value)}
              disabled={!isEditing}
            >
              <SelectTrigger>
              <SelectValue />
              </SelectTrigger>
              <SelectContent>
              <SelectItem value="sedentary">Sedentário</SelectItem>
              <SelectItem value="light">Levemente ativo</SelectItem>
              <SelectItem value="moderate">Moderadamente ativo</SelectItem>
              <SelectItem value="active">Muito ativo</SelectItem>
              <SelectItem value="very-active">Extremamente ativo</SelectItem>
              </SelectContent>
            </Select>
            {!isEditing && (
              <p className="text-sm text-muted-foreground mt-1">
                {getActivityLabel(formData.activityLevel)}
              </p>
            )}
          </div>

          {isEditing && (
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={handleCancel}>
                Cancelar
              </Button>
              <Button onClick={handleSave}>
                <Save className="w-4 h-4 mr-2" />
                Salvar
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Health Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Métricas de Saúde
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl mb-1">{getBMI()}</div>
              <div className="text-sm text-muted-foreground mb-2">IMC</div>
              <Badge variant={bmiCategory.variant as any}>
                {bmiCategory.category}
              </Badge>
            </div>

            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl mb-1">{calculateBMR()}</div>
              <div className="text-sm text-muted-foreground">TMB (cal/dia)</div>
              <div className="text-xs text-muted-foreground mt-1">Taxa Metabólica Basal</div>
            </div>

            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl mb-1">{calculateCalorieNeeds()}</div>
              <div className="text-sm text-muted-foreground">Calorias/dia</div>
              <div className="text-xs text-muted-foreground mt-1">Com atividade física</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Nutrition Goals */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              <CardTitle>Metas Nutricionais</CardTitle>
            </div>
            <Button
              variant="outline"
              onClick={handleAutoCalculate}
              disabled={!isEditing}
            >
              <Calculator className="w-4 h-4 mr-2" />
              Calcular Automaticamente
            </Button>
          </div>
          <CardDescription>
            Defina suas metas diárias de consumo de macronutrientes
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Calorias Diárias</Label>
              <Input
                type="number"
                value={formData.dailyCalories}
                onChange={(e) => updateFormData('dailyCalories', Number(e.target.value))}
                disabled={!isEditing}
              />
            </div>

            <div>
              <Label>Proteína (g)</Label>
              <Input
                type="number"
                value={formData.dailyProtein}
                onChange={(e) => updateFormData('dailyProtein', Number(e.target.value))}
                disabled={!isEditing}
              />
            </div>

            <div>
              <Label>Carboidratos (g)</Label>
              <Input
                type="number"
                value={formData.dailyCarbs}
                onChange={(e) => updateFormData('dailyCarbs', Number(e.target.value))}
                disabled={!isEditing}
              />
            </div>

            <div>
              <Label>Gordura (g)</Label>
              <Input
                type="number"
                value={formData.dailyFat}
                onChange={(e) => updateFormData('dailyFat', Number(e.target.value))}
                disabled={!isEditing}
              />
            </div>
          </div>

          {/* Macro Distribution */}
          <div>
            <h4 className="mb-3">Distribuição de Macronutrientes</h4>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-lg">
                  {Math.round((formData.dailyProtein * 4 / formData.dailyCalories) * 100)}%
                </div>
                <div className="text-sm text-muted-foreground">Proteína</div>
              </div>

              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-lg">
                  {Math.round((formData.dailyCarbs * 4 / formData.dailyCalories) * 100)}%
                </div>
                <div className="text-sm text-muted-foreground">Carboidratos</div>
              </div>

              <div className="text-center p-3 bg-yellow-50 rounded-lg">
                <div className="text-lg">
                  {Math.round((formData.dailyFat * 9 / formData.dailyCalories) * 100)}%
                </div>
                <div className="text-sm text-muted-foreground">Gordura</div>
              </div>
            </div>
          </div>

          {isEditing && (
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={handleCancel}>
                Cancelar
              </Button>
              <Button onClick={handleSave}>
                <Save className="w-4 h-4 mr-2" />
                Salvar Metas
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}