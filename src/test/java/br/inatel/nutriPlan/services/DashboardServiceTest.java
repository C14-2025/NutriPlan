package br.inatel.nutriPlan.services;

import br.inatel.nutriPlan.models.Refeicao;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

public class DashboardServiceTest {

    @Mock
    private RefeicaoService refeicaoService;

    private DashboardService dashboardService;

    private final long userId = 1L;

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
    public void testCalcularMacrosPorDia() {
        LocalDate dia = LocalDate.of(2025, 1, 1);
        Refeicao r1 = criarRefeicao(1L, dia.atStartOfDay());

        when(refeicaoService.findByUsuarioId(userId)).thenReturn(List.of(r1));
        when(refeicaoService.calcularTotaisNutricionais(1L))
                .thenReturn(Map.of("Carboidratos", 100.0, "Proteinas", 50.0, "Gorduras", 20.0, "Calorias", 500.0));

        Map<String, Double> result = dashboardService.calcularMacrosPorDia(userId, dia);

        assertEquals(100.0, result.get("carboidratos")); // Chaves minúsculas, como no service
        assertEquals(50.0, result.get("proteinas"));
        assertEquals(20.0, result.get("gorduras"));
        assertEquals(500.0, result.get("calorias"));
    }

    @Test
    public void testGerarRelatorioSemanal() {
        LocalDate hoje = LocalDate.now();
        LocalDate dia1 = hoje.minusDays(2);
        LocalDate dia2 = hoje.minusDays(1);

        Refeicao r1 = criarRefeicao(1L, dia1.atTime(12, 0));
        Refeicao r2 = criarRefeicao(2L, dia2.atTime(12, 0));

        when(refeicaoService.findByUsuarioId(userId)).thenReturn(List.of(r1, r2));
        when(refeicaoService.calcularTotaisNutricionais(1L))
                .thenReturn(Map.of("Calorias", 400.0, "Carboidratos", 80.0, "Proteinas", 40.0, "Gorduras", 15.0));
        when(refeicaoService.calcularTotaisNutricionais(2L))
                .thenReturn(Map.of("Calorias", 600.0, "Carboidratos", 120.0, "Proteinas", 60.0, "Gorduras", 25.0));

        List<Map<String, Object>> result = dashboardService.gerarRelatorioSemanal(userId);
        assertEquals(7, result.size());

        Map<String, Object> dia1Result = result.stream()
                .filter(item -> item.get("day").equals(dia1.toString()))
                .findFirst()
                .orElse(null);

        Map<String, Object> dia2Result = result.stream()
                .filter(item -> item.get("day").equals(dia2.toString()))
                .findFirst()
                .orElse(null);

        assert dia1Result != null;
        assert dia2Result != null;

        assertEquals(400.0, (Double) dia1Result.get("calories"));
        assertEquals(80.0, (Double) dia1Result.get("carbs"));
        assertEquals(40.0, (Double) dia1Result.get("protein"));
        assertEquals(15.0, (Double) dia1Result.get("fat"));

        assertEquals(600.0, (Double) dia2Result.get("calories"));
        assertEquals(120.0, (Double) dia2Result.get("carbs"));
        assertEquals(60.0, (Double) dia2Result.get("protein"));
        assertEquals(25.0, (Double) dia2Result.get("fat"));

        double totalCalorias = result.stream().mapToDouble(r -> (Double) r.get("calories")).sum();
        double totalCarbs = result.stream().mapToDouble(r -> (Double) r.get("carbs")).sum();
        double totalProtein = result.stream().mapToDouble(r -> (Double) r.get("protein")).sum();
        double totalFat = result.stream().mapToDouble(r -> (Double) r.get("fat")).sum();

        assertEquals(1000.0, totalCalorias);
        assertEquals(200.0, totalCarbs);
        assertEquals(100.0, totalProtein);
        assertEquals(40.0, totalFat);

    }
}
