package br.inatel.nutriPlan.controllers;

import br.inatel.nutriPlan.services.DashboardService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import java.util.*;
import static org.mockito.Mockito.when;
import java.time.LocalDate;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;

class DashBoardControllerTest {

    private MockMvc mockMvc;
    private DashboardService dashboardServiceMock;

    @BeforeEach
    void setup() {
        dashboardServiceMock = Mockito.mock(DashboardService.class);

        DashboardController controller = new DashboardController(dashboardServiceMock);
        mockMvc = MockMvcBuilders.standaloneSetup(controller).build();
    }

    @Test
    void testGetCaloriasPorDia() throws Exception {
        Map<LocalDate, Double> fakeResponse = Map.of(LocalDate.of(2025,1,1), 2000.0);

        when(dashboardServiceMock.calcularCaloriasPorDia()).thenReturn(fakeResponse);

        mockMvc.perform(get("/dashboard/calorias-por-dia"))
                .andExpect(status().isOk())
                .andExpect(content().json("{\"2025-01-01\":2000.0}"));
    }

    @Test
    void testGetMacrosPorDia() throws Exception {
        Map<String, Double> fakeResponse = Map.of("proteina", 150.0, "carboidrato", 250.0);

        when(dashboardServiceMock.calcularMacrosPorDia(LocalDate.parse("2025-01-01")))
                .thenReturn(fakeResponse);

        mockMvc.perform(get("/dashboard/macros-por-dia/2025-01-01"))
                .andExpect(status().isOk())
                .andExpect(content().json("{\"proteina\":150.0,\"carboidrato\":250.0}"));
    }

    @Test
    void testGetRelatorioSemanal() throws Exception {
        Map<String, Object> fakeResponse = Map.of("mediaCalorias", 1800.0);

        when(dashboardServiceMock.gerarRelatorioSemanal()).thenReturn(fakeResponse);

        mockMvc.perform(get("/dashboard/relatorio-semanal"))
                .andExpect(status().isOk())
                .andExpect(content().json("{\"mediaCalorias\":1800.0}"));
    }
}