package br.inatel.nutriPlan.services;

import br.inatel.nutriPlan.models.Refeicao;
import br.inatel.nutriPlan.repositories.RefeicaoRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class RefeicaoServiceTest {
    @Mock
    private RefeicaoRepository refeicaoRepository;

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

}
