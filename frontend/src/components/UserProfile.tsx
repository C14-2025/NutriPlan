import React, { useState, useEffect } from 'react';
import { Card, CardContent,CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Save, User} from 'lucide-react';
import type { UserGoals } from '../App';
import { getUsuario, updateUsuario, type UsuarioPayload } from '../services/usuarioApi';

interface UserProfileProps {
  userGoals: UserGoals;
  onUpdateGoals: (goals: UserGoals) => void;
  userId: number;
}

export function UserProfile({ userGoals, onUpdateGoals, userId }: UserProfileProps) {
  const [formData, setFormData] = useState<UserGoals>(userGoals);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadUserData = async () => {
      if (!userId) return;

      try {
        setIsLoading(true);
        const userData = await getUsuario(userId);

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

  const mapToBackendPayload = (): UsuarioPayload => {
    return {
      nome: formData.name || '',
      idade: formData.age,
      peso: formData.weight,
      altura: formData.height,
      objetivo: formData.goal || ''
    };
  };

  const handleSave = async () => {
    if (!userId) {
      alert("ID do usuário não encontrado!");
      return;
    }

    try {
      setIsLoading(true);
      const payloadParaBackend = mapToBackendPayload();

      console.log("Enviando para back-end:", payloadParaBackend);

      const updatedUser = await updateUsuario(userId, payloadParaBackend);

      onUpdateGoals(formData);
      setIsEditing(false);

      alert("Perfil atualizado com sucesso!");
      console.log("Resposta do back-end:", updatedUser);

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

  if (isLoading) {
    return <div className="flex justify-center p-8">Carregando perfil...</div>;
  }

  return (
      <div className="space-y-6">
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
            <div>
              <Label className="mb-2">Nome</Label>
              <Input
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) => updateFormData('name', e.target.value)}
                  disabled={!isEditing}
                  placeholder="Seu nome completo"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="mb-2">Sexo</Label>
                <Select
                    value={formData.gender}
                    onValueChange={(value: string) => updateFormData('gender', value)}
                    disabled={!isEditing}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="masculino">Masculino</SelectItem>
                    <SelectItem value="feminino">Feminino</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="mb-2">Idade</Label>
                <Input
                    type="number"
                    value={formData.age}
                    onChange={(e) => updateFormData('age', Number(e.target.value))}
                    disabled={!isEditing}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="mb-2">Peso (kg)</Label>
                <Input
                    type="number"
                    value={formData.weight}
                    onChange={(e) => updateFormData('weight', Number(e.target.value))}
                    disabled={!isEditing}
                />
              </div>

              <div>
                <Label className="mb-2">Altura (cm)</Label>
                <Input
                    type="number"
                    value={formData.height}
                    onChange={(e) => updateFormData('height', Number(e.target.value))}
                    disabled={!isEditing}
                />
              </div>
            </div>

            <div>
              <Label className="mb-2">Objetivo</Label>
              <Select
                  value={formData.goal}
                  onValueChange={(value: string) => updateFormData('goal', value)}
                  disabled={!isEditing}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione seu objetivo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="perder_peso">Perder peso</SelectItem>
                  <SelectItem value="manter_peso">Manter peso</SelectItem>
                  <SelectItem value="ganhar_peso">Ganhar peso</SelectItem>
                  <SelectItem value="ganhar_massa">Ganhar massa muscular</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="mb-2">Nível de Atividade</Label>
              <Select
                  value={formData.activityLevel}
                  onValueChange={(value: string) => updateFormData('activityLevel', value)}
                  disabled={!isEditing}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione seu nível de atividade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sedentario">Sedentário</SelectItem>
                  <SelectItem value="leve">Levemente ativo</SelectItem>
                  <SelectItem value="moderado">Moderadamente ativo</SelectItem>
                  <SelectItem value="intenso">Muito ativo</SelectItem>
                  <SelectItem value="extremo">Extremamente ativo</SelectItem>
                </SelectContent>
              </Select>
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

      </div>
  );
}