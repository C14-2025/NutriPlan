package br.inatel.nutriPlan.services;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

import br.inatel.nutriPlan.models.Refeicao;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

public class DashboardServiceTest {

  @Mock private RefeicaoService refeicaoService;

  private DashboardService dashboardService;

  private final long userId = 1L;

  @BeforeEach
  void setup() {
    MockitoAnnotations.openMocks(this);
    dashboardService = new DashboardService(refeicaoService);
  }

  private Refeicao criarRefeicao(long id, LocalDateTime dataHora) {
    Refeicao r = new Refeicao();
    r.setId(id);
    r.setDataHora(dataHora);
    return r;
  }

  @Test
  void testCalcularMacrosPorDia_SomaCorreta() {
    LocalDate dia = LocalDate.of(2025, 1, 10);

    Refeicao r1 = criarRefeicao(1L, dia.atTime(12, 0));
    Refeicao r2 = criarRefeicao(2L, dia.atTime(19, 0));

    when(refeicaoService.findByUsuarioId(userId)).thenReturn(Arrays.asList(r1, r2));

    when(refeicaoService.calcularTotaisNutricionais(1L))
        .thenReturn(
            Map.of("Calorias", 500.0, "Carboidratos", 60.0, "Proteinas", 30.0, "Gorduras", 20.0));

    when(refeicaoService.calcularTotaisNutricionais(2L))
        .thenReturn(
            Map.of("Calorias", 700.0, "Carboidratos", 90.0, "Proteinas", 40.0, "Gorduras", 30.0));

    Map<String, Double> result = dashboardService.calcularMacrosPorDia(userId, dia);

    assertEquals(1200.0, result.get("calorias"));
    assertEquals(150.0, result.get("carboidratos"));
    assertEquals(70.0, result.get("proteinas"));
    assertEquals(50.0, result.get("gorduras"));
  }

  @Test
  void testCalcularDistribuicaoCaloricaPorDia() {
    LocalDate dia = LocalDate.of(2025, 1, 10);
    Refeicao r1 = criarRefeicao(1L, dia.atTime(12, 0));

    when(refeicaoService.findByUsuarioId(userId)).thenReturn(List.of(r1));
    when(refeicaoService.calcularTotaisNutricionais(1L))
        .thenReturn(
            Map.of("Calorias", 800.0, "Carboidratos", 100.0, "Proteinas", 50.0, "Gorduras", 30.0));

    Map<String, Double> result = dashboardService.calcularDistribuicaoCaloricaPorDia(userId, dia);

    assertEquals(50.0 * 4, result.get("caloriasProteina"));
    assertEquals(100.0 * 4, result.get("caloriasCarboidrato"));
    assertEquals(30.0 * 9, result.get("caloriasGordura"));
  }

  @Test
  void testGerarRelatorioSemanal() {

    LocalDate hoje = LocalDate.now();
    LocalDate dia1 = hoje.minusDays(2);
    LocalDate dia2 = hoje.minusDays(1);

    Refeicao r1 = criarRefeicao(1L, dia1.atTime(12, 0));
    Refeicao r2 = criarRefeicao(2L, dia2.atTime(12, 0));

    when(refeicaoService.findByUsuarioId(userId)).thenReturn(List.of(r1, r2));
    when(refeicaoService.calcularTotaisNutricionais(1L))
        .thenReturn(
            Map.of("Calorias", 400.0, "Carboidratos", 80.0, "Proteinas", 40.0, "Gorduras", 15.0));
    when(refeicaoService.calcularTotaisNutricionais(2L))
        .thenReturn(
            Map.of("Calorias", 600.0, "Carboidratos", 120.0, "Proteinas", 60.0, "Gorduras", 25.0));

    List<Map<String, Object>> result = dashboardService.gerarRelatorioSemanal(userId);

    assertEquals(7, result.size());

    Map<String, Object> resDia1 =
        result.stream().filter(r -> r.get("day").equals(dia1.toString())).findFirst().orElse(null);
    Map<String, Object> resDia2 =
        result.stream().filter(r -> r.get("day").equals(dia2.toString())).findFirst().orElse(null);

    assert resDia1 != null;
    assert resDia2 != null;

    assertEquals(400.0, (double) resDia1.get("calories"));
    assertEquals(80.0, (double) resDia1.get("carbs"));
    assertEquals(40.0, (double) resDia1.get("protein"));
    assertEquals(15.0, (double) resDia1.get("fat"));

    assertEquals(600.0, (double) resDia2.get("calories"));
    assertEquals(120.0, (double) resDia2.get("carbs"));
    assertEquals(60.0, (double) resDia2.get("protein"));
    assertEquals(25.0, (double) resDia2.get("fat"));
  }
}
