package br.inatel.nutriPlan.controllers;
import br.inatel.nutriPlan.services.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Map;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/dashboard")
public class DashboardController {

    @Autowired
    private DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/calorias-por-dia")
    public Map<LocalDate, Double> getCaloriasPorDia() {
        return dashboardService.calcularCaloriasPorDia();
    }

    @GetMapping("/macros-por-dia/{dia}")
    public Map<String, Double> getMacrosPorDia(@PathVariable String dia) {
        return dashboardService.calcularMacrosPorDia(LocalDate.parse(dia));
    }

    @GetMapping("/relatorio-semanal")
    public Map<String, Object> getRelatorioSemanal() {
        return dashboardService.gerarRelatorioSemanal();
    }
}
