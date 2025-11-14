import { api } from "./api";

export const alimentoApi = {
    listar: () => api.get("/alimento"),
    criar: (dados: any) => api.post("/alimento", dados)
};
