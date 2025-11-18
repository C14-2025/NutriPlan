import { api } from "./api";

export const dashboardApi = {
    getMacrosPorDia: async (usuarioId: number, dia: string) => {
        const response = await api.get(`/dashboard/macros-por-dia/${usuarioId}/${dia}`);
        return response.data;
    },

    getRelatorioSemanal: async (usuarioId: number) => {
        const response = await api.get(`/dashboard/relatorio-semanal/${usuarioId}`);
        return response.data;
    },
};
