package br.inatel.nutriPlan.controllers;

import br.inatel.nutriPlan.services.DashboardService;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/dashboard")
public class DashboardController {

  @Autowired private DashboardService dashboardService;

  public DashboardController(DashboardService dashboardService) {
    this.dashboardService = dashboardService;
  }

  @GetMapping("/macros-por-dia/{usuarioId}/{dia}")
  public Map<String, Double> getMacrosPorDia(
      @PathVariable long usuarioId, @PathVariable String dia) {
    return dashboardService.calcularMacrosPorDia(usuarioId, LocalDate.parse(dia));
  }

  @GetMapping("/distribuicao-calorica/{usuarioId}/{dia}")
  public Map<String, Double> getDistribuicaoCalorica(
      @PathVariable long usuarioId, @PathVariable String dia) {

    return dashboardService.calcularDistribuicaoCaloricaPorDia(usuarioId, LocalDate.parse(dia));
  }

  @GetMapping("/relatorio-semanal/{usuarioId}")
  public List<Map<String, Object>> getRelatorioSemanal(@PathVariable long usuarioId) {
    return dashboardService.gerarRelatorioSemanal(usuarioId);
  }
}
