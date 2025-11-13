const API_BASE_URL = 'http://localhost:8080/usuario';

export interface UsuarioPayload {
    nome: string;
    idade: number;
    peso: number;
    altura: number;
    objetivo: string;
}

export async function getUsuario(userId: number) {
    const response = await fetch(`${API_BASE_URL}/${userId}`);

    if (!response.ok) {
        throw new Error(`Erro ${response.status}: Não foi possível carregar o perfil do usuário.`);
    }
    return response.json();
}

export async function updateUsuario(userId: number, payload: UsuarioPayload) {
    const response = await fetch(`${API_BASE_URL}/${userId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {

        const errorBody = await response.json().catch(() => ({}));
        throw new Error(`Erro ao atualizar usuário: ${response.statusText}. Detalhes: ${JSON.stringify(errorBody)}`);
    }

    return response.json();
}