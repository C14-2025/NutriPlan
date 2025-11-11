import { api } from "./api";

export const dashboardApi = {
    getCaloriasPorDia: async () => {
        const response = await api.get("/dashboard/calorias-por-dia");
        return response.data;
    },

    getMacrosPorDia: async (dia: string) => {
        const response = await api.get(`/dashboard/macros-por-dia/${dia}`);
        return response.data;
    },

    getRelatorioSemanal: async () => {
        const response = await api.get("/dashboard/relatorio-semanal");
        return response.data;
    },
};
