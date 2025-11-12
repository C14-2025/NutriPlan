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

    // Mantém o original, talvez seja útil para outras funcionalidades
    public Map<LocalDate, Double> calcularCaloriasPorDia(long usuarioId) {
        List<Refeicao> refeicoes = refeicaoService.findByUsuarioId(usuarioId);
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

    // ALTERADO: Agora retorna os totais completos (calorias, proteinas, etc.) para o dia
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

        // Retorna o objeto completo, como o TotaisNutricionaisDto, mas como Map
        Map<String, Double> resultado = new HashMap<>();
        resultado.put("calorias", calorias);
        resultado.put("carboidratos", carb);
        resultado.put("proteinas", prot);
        resultado.put("gorduras", gord);

        return resultado;
    }

    // ALTERADO: Agora retorna uma lista com os totais diários para os últimos 7 dias
    // Corrigido para evitar o erro de variável não-final no lambda
    public List<Map<String, Object>> gerarRelatorioSemanal(long usuarioId) {
        LocalDate hoje = LocalDate.now();
        LocalDate inicioDaSemana = hoje.minusDays(6); // Últimos 7 dias

        List<Map<String, Object>> relatorio = new ArrayList<>();

        // Busca todas as refeições do usuário
        List<Refeicao> todasAsRefeicoes = refeicaoService.findByUsuarioId(usuarioId);

        // Filtra e agrupa as refeições por dia dentro do intervalo
        Map<LocalDate, List<Refeicao>> refeicoesPorDia = todasAsRefeicoes.stream()
                .filter(r -> r.getDataHora() != null)
                .map(r -> r.getDataHora().toLocalDate()) // Extrai a data
                .filter(dia -> !dia.isBefore(inicioDaSemana) && !dia.isAfter(hoje)) // Filtra o intervalo
                .distinct() // Obtém dias únicos
                .sorted() // Ordena cronologicamente
                .collect(Collectors.toMap(
                        date -> date, // Chave é a própria data
                        date -> todasAsRefeicoes.stream() // Valor é a lista de refeições daquele dia
                                .filter(r -> r.getDataHora().toLocalDate().equals(date))
                                .collect(Collectors.toList()),
                        (a, b) -> b, // Se houver conflito de chave (não deve), usa a segunda
                        LinkedHashMap::new // Mantém a ordem de inserção
                ));

        // Itera sobre os dias dentro do intervalo (mesmo que não tenha refeição)
        for (LocalDate dia = inicioDaSemana; !dia.isAfter(hoje); dia = dia.plusDays(1)) {
            // Busca as refeições para o dia específico
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
            diaRelatorio.put("day", dia.format(DateTimeFormatter.ISO_LOCAL_DATE)); // Formato "2025-11-12"
            diaRelatorio.put("calories", totalCalorias);
            diaRelatorio.put("protein", totalProteinas);
            diaRelatorio.put("carbs", totalCarboidratos);
            diaRelatorio.put("fat", totalGorduras);

            relatorio.add(diaRelatorio);
        }

        return relatorio; // Retorna uma lista de mapas, um para cada dia
    }
}