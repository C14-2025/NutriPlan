package br.inatel.nutriPlan.controllers;

import br.inatel.nutriPlan.models.Refeicao;
import br.inatel.nutriPlan.repositories.RefeicaoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.*;

@RestController
@RequestMapping("/dashboard")
@CrossOrigin(origins = "*")
public class DashboardController {
    /*
    @Autowired
    private RefeicaoRepository refeicaoRepository;

    //Calorias por dia
    @GetMapping("/calorias-por-dia")
    public Map<LocalDate, Double> getCaloriasPorDia() {
        List<Refeicao> refeicoes = refeicaoRepository.findAll();
        Map<LocalDate, Double> caloriasPorDia = new TreeMap<>();

        for (Refeicao refeicao : refeicoes) {
            LocalDate dia = refeicao.getDataHora().toLocalDate();
            double total = refeicao.getNutrientes().stream()
                    .mapToDouble(n -> (n.getQuantidade() / 100) * n.getAlimento().getCalorias())
                    .sum();
            caloriasPorDia.merge(dia, total, Double::sum);
        }

        return caloriasPorDia;
    }

    // Macronutrientes por dia (carboidratos, proteínas, gorduras)
    @GetMapping("/macros-por-dia/{dia}")
    public Map<String, Double> getMacrosPorDia(@PathVariable String dia) {
        LocalDate data = LocalDate.parse(dia);
        List<Refeicao> refeicoes = refeicaoRepository.findAll();
        Map<String, Double> macros = new HashMap<>();
        macros.put("carboidratos", 0.0);
        macros.put("proteinas", 0.0);
        macros.put("gorduras", 0.0);

        for (Refeicao refeicao : refeicoes) {
            if (refeicao.getDataHora().toLocalDate().equals(data)) {
                refeicao.getNutrientes().forEach(n -> {
                    double fator = n.getQuantidade() / 100;
                    macros.merge("carboidratos", fator * n.getAlimento().getCarboidratos(), Double::sum);
                    macros.merge("proteinas", fator * n.getAlimento().getProteinas(), Double::sum);
                    macros.merge("gorduras", fator * n.getAlimento().getGorduras(), Double::sum);
                });
            }
        }

        return macros;
    }

    //Relatório semanal (últimos 7 dias)
    @GetMapping("/relatorio-semanal")
    public Map<String, Object> getRelatorioSemanal() {
        LocalDate hoje = LocalDate.now();
        LocalDate inicio = hoje.minusDays(6);

        List<Refeicao> refeicoes = refeicaoRepository.findAll();

        double totalCalorias = 0.0;
        double totalCarbs = 0.0, totalProteinas = 0.0, totalGorduras = 0.0;

        for (Refeicao refeicao : refeicoes) {
            LocalDate dia = refeicao.getDataHora().toLocalDate();
            if (!dia.isBefore(inicio) && !dia.isAfter(hoje)) {
                for (var n : refeicao.getNutrientes()) {
                    double fator = n.getQuantidade() / 100;
                    totalCalorias += fator * n.getAlimento().getCalorias();
                    totalCarbs += fator * n.getAlimento().getCarboidratos();
                    totalProteinas += fator * n.getAlimento().getProteinas();
                    totalGorduras += fator * n.getAlimento().getGorduras();
                }
            }
        }

        Map<String, Object> relatorio = new HashMap<>();
        relatorio.put("periodo", inicio + " até " + hoje);
        relatorio.put("totalCalorias", totalCalorias);
        relatorio.put("mediaCaloriasDia", totalCalorias / 7);
        relatorio.put("totalCarboidratos", totalCarbs);
        relatorio.put("totalProteinas", totalProteinas);
        relatorio.put("totalGorduras", totalGorduras);

        return relatorio;
    }

     */
}
