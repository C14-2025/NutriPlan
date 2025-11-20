package br.inatel.nutriPlan.services;

import br.inatel.nutriPlan.models.Refeicao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    @Autowired
    private RefeicaoService refeicaoService;

    public DashboardService(RefeicaoService refeicaoService) {
        this.refeicaoService = refeicaoService;
    }

    public Map<String, Double> calcularMacrosPorDia(long usuarioId, LocalDate dia) {
        List<Refeicao> refeicoes = refeicaoService.findByUsuarioId(usuarioId)
                .stream()
                .filter(r -> r.getDataHora() != null && r.getDataHora().toLocalDate().equals(dia))
                .toList();

        double calorias = 0, carb = 0, prot = 0, gord = 0;

        for (Refeicao refeicao : refeicoes) {
            Map<String, Double> totais = refeicaoService.calcularTotaisNutricionais(refeicao.getId());
            calorias += totais.getOrDefault("Calorias", 0.0);
            carb += totais.getOrDefault("Carboidratos", 0.0);
            prot += totais.getOrDefault("Proteinas", 0.0);
            gord += totais.getOrDefault("Gorduras", 0.0);
        }

        Map<String, Double> resultado = new HashMap<>();
        resultado.put("calorias", calorias);
        resultado.put("carboidratos", carb);
        resultado.put("proteinas", prot);
        resultado.put("gorduras", gord);

        return resultado;
    }

    public Map<String, Double> calcularDistribuicaoCaloricaPorDia(long usuarioId, LocalDate dia) {
        Map<String, Double> macros = calcularMacrosPorDia(usuarioId, dia);

        double prot = macros.getOrDefault("proteinas", 0.0);
        double carb = macros.getOrDefault("carboidratos", 0.0);
        double gord = macros.getOrDefault("gorduras", 0.0);

        Map<String, Double> distribuicao = new HashMap<>();
        distribuicao.put("caloriasProteina", prot * 4);
        distribuicao.put("caloriasCarboidrato", carb * 4);
        distribuicao.put("caloriasGordura", gord * 9);

        return distribuicao;
    }


    public List<Map<String, Object>> gerarRelatorioSemanal(long usuarioId) {
        LocalDate hoje = LocalDate.now();
        LocalDate inicioDaSemana = hoje.minusDays(6);

        List<Map<String, Object>> relatorio = new ArrayList<>();

        List<Refeicao> todasAsRefeicoes = refeicaoService.findByUsuarioId(usuarioId);

        Map<LocalDate, List<Refeicao>> refeicoesPorDia = todasAsRefeicoes.stream()
                .filter(r -> r.getDataHora() != null)
                .map(r -> r.getDataHora().toLocalDate())
                .filter(dia -> !dia.isBefore(inicioDaSemana) && !dia.isAfter(hoje))
                .distinct()
                .sorted()
                .collect(Collectors.toMap(
                        date -> date,
                        date -> todasAsRefeicoes.stream()
                                .filter(r -> r.getDataHora().toLocalDate().equals(date))
                                .collect(Collectors.toList()),
                        (a, b) -> b,
                        LinkedHashMap::new
                ));


        for (LocalDate dia = inicioDaSemana; !dia.isAfter(hoje); dia = dia.plusDays(1)) {

            List<Refeicao> refeicoesDoDia = refeicoesPorDia.getOrDefault(dia, Collections.emptyList());

            double totalCalorias = 0, totalCarboidratos = 0, totalProteinas = 0, totalGorduras = 0;

            for (Refeicao refeicao : refeicoesDoDia) {
                Map<String, Double> totais = refeicaoService.calcularTotaisNutricionais(refeicao.getId());
                totalCalorias += totais.getOrDefault("Calorias", 0.0);
                totalCarboidratos += totais.getOrDefault("Carboidratos", 0.0);
                totalProteinas += totais.getOrDefault("Proteinas", 0.0);
                totalGorduras += totais.getOrDefault("Gorduras", 0.0);
            }

            Map<String, Object> diaRelatorio = new HashMap<>();
            diaRelatorio.put("day", dia.format(DateTimeFormatter.ISO_LOCAL_DATE));
            diaRelatorio.put("calories", totalCalorias);
            diaRelatorio.put("protein", totalProteinas);
            diaRelatorio.put("carbs", totalCarboidratos);
            diaRelatorio.put("fat", totalGorduras);

            relatorio.add(diaRelatorio);
        }

        return relatorio; // Retorna uma lista de mapas, um para cada dia
    }
}