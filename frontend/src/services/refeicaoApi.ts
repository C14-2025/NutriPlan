import { api } from "./api";

export const refeicaoApi = {
    listarTodas: () => api.get("/refeicao"),
    listarPorUsuario: (usuarioId: number) => api.get(`/refeicao/usuario/${usuarioId}`),
    buscarPorId: (id: number) => api.get(`/refeicao/${id}`),
    criar: (dados: any) => api.post("/refeicao", dados),
    atualizar: (id: number, dados: any) => api.put(`/refeicao/${id}`, dados),
    deletar: (id: number) => api.delete(`/refeicao/${id}`),
    listarAlimentos: (refeicaoId: number) => api.get(`/refeicao/${refeicaoId}/alimentos`),
    adicionarAlimento: (refeicaoId: number, alimentoId: number, quantidade: number) =>
        api.post(`/refeicao/${refeicaoId}/alimentos`, null, { params: { alimentoId, quantidade } }),
    removerAlimento: (refeicaoId: number, alimentoId: number) =>
        api.delete(`/refeicao/${refeicaoId}/alimentos/${alimentoId}`),
    calcularTotais: (refeicaoId: number) => api.get(`/refeicao/${refeicaoId}/totais`)
};
