package br.inatel.nutriPlan.controllers;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

import br.inatel.nutriPlan.services.DashboardService;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

class DashBoardControllerTest {

  @Mock private DashboardService dashboardService;

  @InjectMocks private DashboardController controller;

  private final long userId = 1L;

  @BeforeEach
  void setup() {
    MockitoAnnotations.openMocks(this);
  }

  @Test
  void testGetMacrosPorDia() {
    Map<String, Double> fakeResponse =
        Map.of("proteinas", 120.0, "carboidratos", 200.0, "gorduras", 40.0, "calorias", 1800.0);

    when(dashboardService.calcularMacrosPorDia(userId, LocalDate.parse("2025-01-01")))
        .thenReturn(fakeResponse);

    Map<String, Double> response = controller.getMacrosPorDia(userId, "2025-01-01");

    assertEquals(120.0, response.get("proteinas"));
    assertEquals(200.0, response.get("carboidratos"));
    assertEquals(40.0, response.get("gorduras"));
    assertEquals(1800.0, response.get("calorias"));
  }

  @Test
  void testGetDistribuicaoCalorica() {
    Map<String, Double> fakeResponse =
        Map.of("caloriasProteina", 400.0, "caloriasCarboidrato", 600.0, "caloriasGordura", 900.0);

    when(dashboardService.calcularDistribuicaoCaloricaPorDia(userId, LocalDate.parse("2025-01-01")))
        .thenReturn(fakeResponse);

    Map<String, Double> response = controller.getDistribuicaoCalorica(userId, "2025-01-01");

    assertEquals(400.0, response.get("caloriasProteina"));
    assertEquals(600.0, response.get("caloriasCarboidrato"));
    assertEquals(900.0, response.get("caloriasGordura"));
  }

  @Test
  void testGetRelatorioSemanal() {

    List<Map<String, Object>> fakeResponse =
        List.of(
            Map.of(
                "day",
                "2025-11-06",
                "calories",
                2000.0,
                "protein",
                100.0,
                "carbs",
                200.0,
                "fat",
                50.0),
            Map.of(
                "day",
                "2025-11-07",
                "calories",
                2100.0,
                "protein",
                110.0,
                "carbs",
                220.0,
                "fat",
                55.0));

    when(dashboardService.gerarRelatorioSemanal(userId)).thenReturn(fakeResponse);

    List<Map<String, Object>> response = controller.getRelatorioSemanal(userId);

    assertEquals(2, response.size());
    assertEquals("2025-11-06", response.get(0).get("day"));
    assertEquals(2000.0, response.get(0).get("calories"));
  }
}
