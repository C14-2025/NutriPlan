import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { LogIn } from 'lucide-react';
import { authApi, type AuthResponse } from '../services/authApi';

interface LoginProps {
  onLoginSuccess: (user: AuthResponse) => void;
  onSwitchToRegister: () => void;
}

export function Login({ onLoginSuccess, onSwitchToRegister }: LoginProps) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const user = await authApi.login({ email, senha });
      localStorage.setItem('usuarioId', user.id.toString());
      localStorage.setItem('usuarioNome', user.nome);
      localStorage.setItem('usuarioEmail', user.email);
      if (user.idade) localStorage.setItem('usuarioIdade', user.idade.toString());
      if (user.peso) localStorage.setItem('usuarioPeso', user.peso.toString());
      if (user.altura) localStorage.setItem('usuarioAltura', user.altura.toString());
      if (user.objetivo) localStorage.setItem('usuarioObjetivo', user.objetivo);
      if (user.sexo) localStorage.setItem('usuarioSexo', user.sexo);
      if (user.nivelAtividade) localStorage.setItem('usuarioNivelAtividade', user.nivelAtividade);
      onLoginSuccess(user);
    } catch (err: any) {
      const errorMessage = typeof err.response?.data === 'string' 
        ? err.response.data 
        : err.response?.data?.message || err.message || 'Erro ao fazer login';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-semibold text-gray-800">
            NutriPlan
          </CardTitle>
          <p className="text-gray-600 text-sm mt-2">Acesse sua conta para continuar</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="senha">Senha</Label>
              <Input
                id="senha"
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
              />
            </div>
            {error && (
              <div className="text-red-500 text-sm">{error}</div>
            )}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Entrando...' : 'Entrar'}
            </Button>
            <div className="text-center">
              <span className="text-gray-600 text-sm">Não possui uma conta? </span>
              <Button 
                type="button" 
                variant="link" 
                className="text-blue-600 hover:text-blue-700 p-0 h-auto font-medium"
                onClick={onSwitchToRegister}
              >
                Cadastre-se
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}