import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { UserPlus } from 'lucide-react';
import { authApi, type AuthResponse } from '../services/authApi';

interface RegisterProps {
  onRegisterSuccess: (user: AuthResponse) => void;
  onSwitchToLogin: () => void;
}

export function Register({ onRegisterSuccess, onSwitchToLogin }: RegisterProps) {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    idade: '',
    peso: '',
    altura: '',
    objetivo: '',
    sexo: '',
    nivelAtividade: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const registerData = {
        nome: formData.nome,
        email: formData.email,
        senha: formData.senha,
        idade: formData.idade ? parseInt(formData.idade) : undefined,
        peso: formData.peso ? parseFloat(formData.peso) : undefined,
        altura: formData.altura ? parseFloat(formData.altura) : undefined,
        objetivo: formData.objetivo || undefined,
        sexo: formData.sexo || undefined,
        nivelAtividade: formData.nivelAtividade || undefined
      };

      const user = await authApi.register(registerData);
      localStorage.setItem('usuarioId', user.id.toString());
      localStorage.setItem('usuarioNome', user.nome);
      localStorage.setItem('usuarioEmail', user.email);
      if (user.idade) localStorage.setItem('usuarioIdade', user.idade.toString());
      if (user.peso) localStorage.setItem('usuarioPeso', user.peso.toString());
      if (user.altura) localStorage.setItem('usuarioAltura', user.altura.toString());
      if (user.objetivo) localStorage.setItem('usuarioObjetivo', user.objetivo);
      if (user.sexo) localStorage.setItem('usuarioSexo', user.sexo);
      if (user.nivelAtividade) localStorage.setItem('usuarioNivelAtividade', user.nivelAtividade);
      onRegisterSuccess(user);
    } catch (err: any) {
      const errorMessage = typeof err.response?.data === 'string' 
        ? err.response.data 
        : err.response?.data?.message || err.message || 'Erro ao criar conta';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-semibold text-gray-800">
            NutriPlan
          </CardTitle>
          <p className="text-gray-600 text-sm mt-2">Crie sua conta para começar</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="nome">Nome *</Label>
                <Input
                  id="nome"
                  type="text"
                  value={formData.nome}
                  onChange={(e) => handleInputChange('nome', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="senha">Senha *</Label>
              <Input
                id="senha"
                type="password"
                value={formData.senha}
                onChange={(e) => handleInputChange('senha', e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="sexo">Sexo</Label>
                <Select value={formData.sexo} onValueChange={(value) => handleInputChange('sexo', value)}>
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
                <Label htmlFor="idade">Idade</Label>
                <Input
                  id="idade"
                  type="number"
                  value={formData.idade}
                  onChange={(e) => handleInputChange('idade', e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="peso">Peso (kg)</Label>
                <Input
                  id="peso"
                  type="number"
                  step="0.1"
                  value={formData.peso}
                  onChange={(e) => handleInputChange('peso', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="altura">Altura (cm)</Label>
                <Input
                  id="altura"
                  type="number"
                  value={formData.altura}
                  onChange={(e) => handleInputChange('altura', e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="objetivo">Objetivo</Label>
              <Select value={formData.objetivo} onValueChange={(value) => handleInputChange('objetivo', value)}>
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
              <Label htmlFor="nivelAtividade">Nível de Atividade</Label>
              <Select value={formData.nivelAtividade} onValueChange={(value) => handleInputChange('nivelAtividade', value)}>
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

            {error && (
              <div className="text-red-500 text-sm">{error}</div>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Criando conta...' : 'Criar Conta'}
            </Button>
            <div className="text-center">
              <span className="text-gray-600 text-sm">Já possui uma conta? </span>
              <Button 
                type="button" 
                variant="link" 
                className="text-blue-600 hover:text-blue-700 p-0 h-auto font-medium"
                onClick={onSwitchToLogin}
              >
                Fazer Login
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}