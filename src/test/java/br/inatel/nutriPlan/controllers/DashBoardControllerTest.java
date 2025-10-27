package br.inatel.nutriPlan.controllers;

import br.inatel.nutriPlan.models.Alimento;
import br.inatel.nutriPlan.models.Refeicao;
import br.inatel.nutriPlan.repositories.RefeicaoRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.time.LocalDateTime;
import java.util.*;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;
import java.time.LocalDate;

class DashBoardControllerTest {

    @Mock
    private RefeicaoRepository refeicaoRepository;

    @InjectMocks
    private DashboardController controller;

    @BeforeEach
    void setup() {
        MockitoAnnotations.openMocks(this);
    }
    /*
    @Test
    void testCaloriasPorDia() {
        // Fixture
        Alimento arroz = new Alimento();
        arroz.setCalorias(130.0);

        Nutriente n = new Nutriente();
        n.setAlimento(arroz);
        n.setQuantidade(100.0);

        Refeicao refeicao = new Refeicao();
        refeicao.setDataHora(LocalDateTime.now());
        refeicao.setNutrientes(List.of(n));

        when(refeicaoRepository.findAll()).thenReturn(List.of(refeicao));

        // Chamada do método
        Map<?, ?> response = controller.getCaloriasPorDia();

        assertFalse(response.isEmpty());
        assertTrue(response.values().stream().anyMatch(v -> (Double) v == 130.0));
    }

    @Test
    void testMacrosPorDia() {
        LocalDateTime agora = LocalDateTime.now();

        Alimento ovo = new Alimento();
        ovo.setCarboidratos(1.0);
        ovo.setProteinas(13.0);
        ovo.setGorduras(11.0);

        Nutriente n = new Nutriente();
        n.setAlimento(ovo);
        n.setQuantidade(100.0);

        Refeicao refeicao = new Refeicao();
        refeicao.setDataHora(agora);
        refeicao.setNutrientes(List.of(n));

        when(refeicaoRepository.findAll()).thenReturn(List.of(refeicao));

        String hoje = agora.toLocalDate().toString();
        Map<String, Double> response = controller.getMacrosPorDia(hoje);

        assertEquals(1.0, response.get("carboidratos"));
        assertEquals(13.0, response.get("proteinas"));
        assertEquals(11.0, response.get("gorduras"));
    }

    @Test
    void testRelatorioSemanal() {
        when(refeicaoRepository.findAll()).thenReturn(Collections.emptyList());

        Map<String, Object> response = controller.getRelatorioSemanal();

        assertTrue(response.containsKey("periodo"));
        assertEquals(0.0, response.get("totalCalorias"));
    }

    @Test
    void testRelatorioSemanalComDadosNoPeriodo() {
        // Fixture: hoje e início da semana (7 dias atrás)
        LocalDate hoje = LocalDate.now();
        LocalDateTime dataDentroPeriodo = hoje.atStartOfDay();

        Alimento frango = new Alimento();
        frango.setCalorias(165.0);
        frango.setCarboidratos(0.0);
        frango.setProteinas(31.0);
        frango.setGorduras(3.6);

        Nutriente nutriente = new Nutriente();
        nutriente.setAlimento(frango);
        nutriente.setQuantidade(100.0); // 100g

        Refeicao refeicao = new Refeicao();
        refeicao.setDataHora(dataDentroPeriodo);
        refeicao.setNutrientes(List.of(nutriente));

        // Mock do repositório retornando a refeição dentro do período
        when(refeicaoRepository.findAll()).thenReturn(List.of(refeicao));

        // Chamada do método
        Map<String, Object> response = controller.getRelatorioSemanal();

        // Validações
        assertNotNull(response);
        assertEquals(165.0, response.get("totalCalorias"));
        assertEquals(165.0 / 7, response.get("mediaCaloriasDia"));
        assertEquals(0.0, response.get("totalCarboidratos"));
        assertEquals(31.0, response.get("totalProteinas"));
        assertEquals(3.6, response.get("totalGorduras"));

        String periodoEsperado = hoje.minusDays(6) + " até " + hoje;
        assertEquals(periodoEsperado, response.get("periodo"));
    }

     */
}