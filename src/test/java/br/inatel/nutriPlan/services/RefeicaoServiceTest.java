package br.inatel.nutriPlan.services;

import br.inatel.nutriPlan.models.Alimento;
import br.inatel.nutriPlan.models.Refeicao;
import br.inatel.nutriPlan.repositories.AlimentoRepository;
import br.inatel.nutriPlan.repositories.RefeicaoRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class RefeicaoServiceTest {
    @Mock
    private RefeicaoRepository refeicaoRepository;

    @Mock
    private AlimentoRepository alimentoRepository;

    @InjectMocks
    private RefeicaoService refeicaoService; //indicando onde o mock deve ser injetado

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testSave() {
        Refeicao refeicao = new Refeicao();
        refeicao.setTipo("Almoço");

        when(refeicaoRepository.save(refeicao)).thenReturn(refeicao);

        Refeicao refeicaoSaved = refeicaoService.save(refeicao);

        assertNotNull(refeicaoSaved);
    }
    
    @Test
    public void testFindById() {
        Refeicao refeicao = new Refeicao();
        refeicao.setTipo("Almoço");
        when(refeicaoRepository.save(refeicao)).thenReturn(refeicao);
        Refeicao refeicaoSaved = refeicaoService.save(refeicao);
        refeicaoSaved.setId(1L);

        assertEquals(1L, refeicaoSaved.getId());
    }

    @Test
    public void testDelete() {
        Refeicao refeicao = new Refeicao();
        refeicao.setTipo("Almoço");
        when(refeicaoRepository.save(refeicao)).thenReturn(refeicao);
        Refeicao refeicaoSaved = refeicaoService.save(refeicao);
        refeicaoService.delete(refeicaoSaved);

        verify(refeicaoRepository, times(1)).delete(refeicaoSaved); //verificando se delete foi chamado uma vez
    }

    @Test
    public void testAdicionarAlimento(){
        Alimento arroz;
        arroz = new Alimento();
        arroz.setId(1L);
        arroz.setNome("Arroz");
        arroz.setCalorias(130.0);
        arroz.setProteinas(2.7);
        arroz.setCarboidratos(28.0);
        arroz.setGorduras(0.3);

        Refeicao refeicao;
        refeicao = new Refeicao();
        refeicao.setId(100L);
        refeicao.setQuantidadePorAlimento(new HashMap<>());

        when(refeicaoRepository.findById(100L)).thenReturn(Optional.of(refeicao));
        when(alimentoRepository.findById(1L)).thenReturn(Optional.of(arroz));
        when(refeicaoRepository.save(Mockito.any())).thenAnswer(i -> i.getArgument(0));

        Refeicao resultado = refeicaoService.adicionarAlimento(100L, 1, 150.0);
        assertEquals(1, resultado.getQuantidadePorAlimento().size());
        assertEquals(150.0, resultado.getQuantidadePorAlimento().get(arroz));
    }

    @Test
    public void testRemoverAlimento(){
        Alimento arroz;
        arroz = new Alimento();
        arroz.setId(1L);
        arroz.setNome("Arroz");
        arroz.setCalorias(130.0);
        arroz.setProteinas(2.7);
        arroz.setCarboidratos(28.0);
        arroz.setGorduras(0.3);

        Refeicao refeicao;
        refeicao = new Refeicao();
        refeicao.setId(100L);
        refeicao.setQuantidadePorAlimento(new HashMap<>());

        refeicao.getQuantidadePorAlimento().put(arroz, 150.0);

        when(refeicaoRepository.findById(100L)).thenReturn(Optional.of(refeicao));
        when(alimentoRepository.findById(1L)).thenReturn(Optional.of(arroz));
        when(refeicaoRepository.save(Mockito.any())).thenAnswer(i -> i.getArgument(0));

        Refeicao resultado = refeicaoService.removerAlimento(100L, 1);
        assertTrue(resultado.getQuantidadePorAlimento().isEmpty());
    }

    @Test
    public void testCalularTotaisNutricionais(){
        Alimento arroz = new Alimento();
        arroz.setId(1L);
        arroz.setNome("Arroz");
        arroz.setCalorias(130.0);
        arroz.setProteinas(2.7);
        arroz.setCarboidratos(28.0);
        arroz.setGorduras(0.3);

        Alimento feijao = new Alimento();
        feijao.setId(2L);
        feijao.setNome("Feijão");
        feijao.setCalorias(127.0);
        feijao.setProteinas(8.0);
        feijao.setCarboidratos(22.0);
        feijao.setGorduras(0.5);

        Refeicao refeicao = new Refeicao();
        refeicao.setId(100L);

        Map<Alimento, Double> quantidades = new HashMap<>();
        quantidades.put(arroz, 150.0);
        quantidades.put(feijao, 100.0);
        refeicao.setQuantidadePorAlimento(quantidades);

        when(refeicaoRepository.findById(100L)).thenReturn(Optional.of(refeicao));

        Map<String, Double> totais = refeicaoService.calcularTotaisNutricionais(100L);
        double caloriasEsperadas =322;
        double proteinasEsperadas = 12.05;
        double carboEsperados = 64;
        double gordurasEsperadas = 0.95;

        assertEquals(caloriasEsperadas, totais.get("Calorias"));
        assertEquals(proteinasEsperadas, totais.get("Proteinas"));
        assertEquals(carboEsperados, totais.get("Carboidratos"));
        assertEquals(gordurasEsperadas, totais.get("Gorduras"));
    }

}
