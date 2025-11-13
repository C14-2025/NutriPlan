import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Calculator, Save, Target, User, Activity } from 'lucide-react';
import type { UserGoals } from '../App';
import { getUsuario, updateUsuario, type UsuarioPayload } from '../services/usuarioApi';

interface UserProfileProps {
  userGoals: UserGoals;
  onUpdateGoals: (goals: UserGoals) => void;
  userId: number; // 🔥 ADICIONE ESTA PROP
}

export function UserProfile({ userGoals, onUpdateGoals, userId }: UserProfileProps) {
  const [formData, setFormData] = useState<UserGoals>(userGoals);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // 🔥 CARREGAR DADOS DO BACK-END AO INICIAR
  useEffect(() => {
    const loadUserData = async () => {
      if (!userId) return;

      try {
        setIsLoading(true);
        const userData = await getUsuario(userId);

        // 🔥 MAPEAR DADOS DO BACK-END PARA UserGoals
        setFormData(prev => ({
          ...prev,
          name: userData.nome || '',
          age: userData.idade || 0,
          weight: userData.peso || 0,
          height: userData.altura || 0,
          goal: userData.objetivo || ''
        }));
      } catch (error) {
        console.error("Erro ao carregar dados do usuário:", error);
        alert("Erro ao carregar perfil. Usando dados locais.");
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, [userId]);

  const updateFormData = (field: keyof UserGoals, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // 🔥 FUNÇÃO PARA MAPEAR UserGoals PARA UsuarioPayload
  const mapToBackendPayload = (): UsuarioPayload => {
    return {
      nome: formData.name || '', // 🔥 ajuste conforme sua estrutura real
      idade: formData.age,
      peso: formData.weight,
      altura: formData.height,
      objetivo: formData.goal || '' // 🔥 ajuste conforme sua estrutura real
    };
  };

  const calculateBMR = () => {
    const { sex, age, weight, height } = formData;

    if (sex === "female") {
      return Math.round(
          447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age)
      );
    }

    return Math.round(
        88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age)
    );
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

    const protein = Math.round((calories * 0.30) / 4);
    const carbs = Math.round((calories * 0.40) / 4);
    const fat = Math.round((calories * 0.30) / 9);

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

  // 🔥 CORRIGIR A FUNÇÃO handleSave
  const handleSave = async () => {
    if (!userId) {
      alert("ID do usuário não encontrado!");
      return;
    }

    try {
      setIsLoading(true);
      const payloadParaBackend = mapToBackendPayload();

      console.log("Enviando para back-end:", payloadParaBackend); // 🔥 DEBUG

      const updatedUser = await updateUsuario(userId, payloadParaBackend);

      // Atualizar estado local
      onUpdateGoals(formData);
      setIsEditing(false);

      alert("Perfil atualizado com sucesso!");
      console.log("Resposta do back-end:", updatedUser); // 🔥 DEBUG

    } catch (error: any) {
      console.error("Erro ao salvar perfil:", error);
      alert(`Erro ao atualizar perfil: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
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

  if (isLoading) {
    return <div className="flex justify-center p-8">Carregando perfil...</div>;
  }

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
                  disabled={isLoading}
              >
                {isEditing ? 'Cancelar' : 'Editar Perfil'}
              </Button>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* 🔥 ADICIONAR CAMPO NOME */}
            <div>
              <Label>Nome</Label>
              <Input
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) => updateFormData('name', e.target.value)}
                  disabled={!isEditing}
                  placeholder="Seu nome completo"
              />
            </div>

            {/* SEX & AGE */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Sexo</Label>
                <Select
                    value={formData.sex}
                    onValueChange={(value: string) => updateFormData('sex', value)}
                    disabled={!isEditing}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Homem</SelectItem>
                    <SelectItem value="female">Mulher</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Idade</Label>
                <Input
                    type="number"
                    value={formData.age}
                    onChange={(e) => updateFormData('age', Number(e.target.value))}
                    disabled={!isEditing}
                />
              </div>
            </div>

            {/* WEIGHT & HEIGHT */}
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

            {/* 🔥 ADICIONAR CAMPO OBJETIVO */}
            <div>
              <Label>Objetivo</Label>
              <Select
                  value={formData.goal}
                  onValueChange={(value: string) => updateFormData('goal', value)}
                  disabled={!isEditing}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione seu objetivo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="emagrecer">Emagrecer</SelectItem>
                  <SelectItem value="ganhar-massa">Ganhar Massa</SelectItem>
                  <SelectItem value="manter">Manter Peso</SelectItem>
                  <SelectItem value="definicao">Definição Muscular</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* ACTIVITY LEVEL */}
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
                  <Button variant="outline" onClick={handleCancel} disabled={isLoading}>
                    Cancelar
                  </Button>
                  <Button onClick={handleSave} disabled={isLoading}>
                    <Save className="w-4 h-4 mr-2" />
                    {isLoading ? 'Salvando...' : 'Salvar'}
                  </Button>
                </div>
            )}
          </CardContent>
        </Card>

        {/* ... (restante do código permanece igual) */}
      </div>
  );
}