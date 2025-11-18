package br.inatel.nutriPlan.controllers;

import br.inatel.nutriPlan.services.DashboardService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class DashBoardControllerTest {

    private MockMvc mockMvc;
    private DashboardService dashboardServiceMock;
    private final long userId = 1L;

    @BeforeEach
    void setup() {
        dashboardServiceMock = Mockito.mock(DashboardService.class);
        DashboardController controller = new DashboardController(dashboardServiceMock);
        mockMvc = MockMvcBuilders.standaloneSetup(controller).build();
    }


    @Test
    void testGetMacrosPorDia() throws Exception {
        Map<String, Double> fakeResponse = Map.of("proteinas", 150.0, "carboidratos", 250.0, "gorduras", 20.0, "calorias", 1500.0);

        when(dashboardServiceMock.calcularMacrosPorDia(userId, LocalDate.parse("2025-01-01")))
                .thenReturn(fakeResponse);

        mockMvc.perform(get("/dashboard/macros-por-dia/{usuarioId}/{dia}", userId, "2025-01-01"))
                .andExpect(status().isOk())
                .andExpect(content().json("{\"proteinas\":150.0,\"carboidratos\":250.0,\"gorduras\":20.0,\"calorias\":1500.0}"));
    }

    @Test
    void testGetRelatorioSemanal() throws Exception {
        List<Map<String, Object>> fakeResponse = List.of(
                Map.of("day", "2025-11-06", "calories", 2000.0, "protein", 100.0, "carbs", 200.0, "fat", 50.0),
                Map.of("day", "2025-11-07", "calories", 2100.0, "protein", 110.0, "carbs", 220.0, "fat", 55.0)
        );

        when(dashboardServiceMock.gerarRelatorioSemanal(userId)).thenReturn(fakeResponse);

        mockMvc.perform(get("/dashboard/relatorio-semanal/{usuarioId}", userId))
                .andExpect(status().isOk())
                .andExpect(content().json("[{\"day\":\"2025-11-06\",\"calories\":2000.0,\"protein\":100.0,\"carbs\":200.0,\"fat\":50.0},{\"day\":\"2025-11-07\",\"calories\":2100.0,\"protein\":110.0,\"carbs\":220.0,\"fat\":55.0}]")); // Corresponde ao formato da lista
    }
}