package br.inatel.nutriPlan.services;

import br.inatel.nutriPlan.models.Refeicao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    @Autowired
    private RefeicaoService refeicaoService;

    public DashboardService(RefeicaoService refeicaoService) {
        this.refeicaoService = refeicaoService;
    }

    public Map<LocalDate, Double> calcularCaloriasPorDia() {
        List<Refeicao> refeicoes = refeicaoService.findAll();
        Map<LocalDate, Double> caloriasPorDia = new HashMap<>();

        for (Refeicao refeicao : refeicoes) {
            if (refeicao.getDataHora() == null) continue;

            LocalDate dia = refeicao.getDataHora().toLocalDate();
            Map<String, Double> totais = refeicaoService.calcularTotaisNutricionais(refeicao.getId());
            double calorias = totais.getOrDefault("Calorias", 0.0);

            caloriasPorDia.merge(dia, calorias, Double::sum);
        }

        return caloriasPorDia.entrySet()
                .stream()
                .sorted(Map.Entry.comparingByKey())
                .collect(Collectors.toMap(
                        Map.Entry::getKey,
                        Map.Entry::getValue,
                        (a, b) -> b,
                        LinkedHashMap::new
                ));
    }

    public Map<String, Double> calcularMacrosPorDia(LocalDate dia) {
        List<Refeicao> refeicoes = refeicaoService.findAll()
                .stream()
                .filter(r -> r.getDataHora() != null && r.getDataHora().toLocalDate().equals(dia))
                .toList();

        double carb = 0, prot = 0, gord = 0;

        for (Refeicao refeicao : refeicoes) {
            Map<String, Double> totais = refeicaoService.calcularTotaisNutricionais(refeicao.getId());
            carb += totais.getOrDefault("Carboidratos", 0.0);
            prot += totais.getOrDefault("Proteinas", 0.0);
            gord += totais.getOrDefault("Gorduras", 0.0);
        }

        Map<String, Double> resultado = new HashMap<>();
        resultado.put("Carboidratos", carb);
        resultado.put("Proteinas", prot);
        resultado.put("Gorduras", gord);

        return resultado;
    }

    public Map<String, Object> gerarRelatorioSemanal() {
        LocalDate fim = LocalDate.now();
        LocalDate inicio = fim.minusDays(6);

        List<Refeicao> refeicoes = refeicaoService.findAll()
                .stream()
                .filter(r -> r.getDataHora() != null &&
                        !r.getDataHora().toLocalDate().isBefore(inicio) &&
                        !r.getDataHora().toLocalDate().isAfter(fim))
                .toList();

        double totalCalorias = 0, totalCarboidratos = 0, totalProteinas = 0, totalGorduras = 0;

        for (Refeicao refeicao : refeicoes) {
            Map<String, Double> totais = refeicaoService.calcularTotaisNutricionais(refeicao.getId());
            totalCalorias += totais.getOrDefault("Calorias", 0.0);
            totalCarboidratos += totais.getOrDefault("Carboidratos", 0.0);
            totalProteinas += totais.getOrDefault("Proteinas", 0.0);
            totalGorduras += totais.getOrDefault("Gorduras", 0.0);
        }

        long diasComDados = refeicoes.stream()
                .map(r -> r.getDataHora().toLocalDate())
                .distinct()
                .count();

        Map<String, Object> relatorio = new HashMap<>();
        relatorio.put("periodo", inicio + " até " + fim);
        relatorio.put("totalCalorias", totalCalorias);
        relatorio.put("mediaCaloriasDia", diasComDados > 0 ? totalCalorias / diasComDados : 0);
        relatorio.put("totalCarboidratos", totalCarboidratos);
        relatorio.put("totalProteinas", totalProteinas);
        relatorio.put("totalGorduras", totalGorduras);

        return relatorio;
    }
}
