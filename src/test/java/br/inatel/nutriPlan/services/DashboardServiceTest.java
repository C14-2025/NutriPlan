package br.inatel.nutriPlan.services;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

import br.inatel.nutriPlan.models.Refeicao;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

public class DashboardServiceTest {

  @Mock private RefeicaoService refeicaoService;

  private DashboardService dashboardService;

  @BeforeEach
  public void setup() {
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
  public void testCalcularCaloriasPorDia() {
    Refeicao r1 = criarRefeicao(1L, LocalDateTime.of(2025, 1, 1, 12, 0));
    Refeicao r2 = criarRefeicao(2L, LocalDateTime.of(2025, 1, 1, 18, 0));

    when(refeicaoService.findAll()).thenReturn(List.of(r1, r2));
    when(refeicaoService.calcularTotaisNutricionais(1L)).thenReturn(Map.of("Calorias", 500.0));
    when(refeicaoService.calcularTotaisNutricionais(2L)).thenReturn(Map.of("Calorias", 300.0));

    Map<LocalDate, Double> result = dashboardService.calcularCaloriasPorDia();

    assertEquals(800.0, result.get(LocalDate.of(2025, 1, 1)));
    assertEquals(1, result.size());
  }

  @Test
  public void testCalcularMacrosPorDia() {
    LocalDate dia = LocalDate.of(2025, 1, 1);

    Refeicao r1 = criarRefeicao(1L, dia.atStartOfDay());
    when(refeicaoService.findAll()).thenReturn(List.of(r1));
    when(refeicaoService.calcularTotaisNutricionais(1L))
        .thenReturn(
            Map.of(
                "Carboidratos", 100.0,
                "Proteinas", 50.0,
                "Gorduras", 20.0));

    Map<String, Double> result = dashboardService.calcularMacrosPorDia(dia);

    assertEquals(100.0, result.get("Carboidratos"));
    assertEquals(50.0, result.get("Proteinas"));
    assertEquals(20.0, result.get("Gorduras"));
  }

  @Test
  public void testGerarRelatorioSemanal() {
    LocalDate hoje = LocalDate.now();
    Refeicao r1 = criarRefeicao(1L, hoje.minusDays(2).atTime(12, 0));
    Refeicao r2 = criarRefeicao(2L, hoje.minusDays(1).atTime(12, 0));

    when(refeicaoService.findAll()).thenReturn(List.of(r1, r2));
    when(refeicaoService.calcularTotaisNutricionais(1L))
        .thenReturn(
            Map.of("Calorias", 400.0, "Carboidratos", 80.0, "Proteinas", 40.0, "Gorduras", 15.0));
    when(refeicaoService.calcularTotaisNutricionais(2L))
        .thenReturn(
            Map.of("Calorias", 600.0, "Carboidratos", 120.0, "Proteinas", 60.0, "Gorduras", 25.0));

    Map<String, Object> result = dashboardService.gerarRelatorioSemanal();

    assertEquals(1000.0, result.get("totalCalorias"));
    assertEquals(200.0, result.get("totalCarboidratos"));
    assertEquals(100.0, result.get("totalProteinas"));
    assertEquals(40.0, result.get("totalGorduras"));
    assertEquals(500.0, (double) result.get("mediaCaloriasDia")); // 1000/2
  }
}
