package br.inatel.nutriPlan.services;


import br.inatel.nutriPlan.models.Nutriente;
import br.inatel.nutriPlan.repositories.NutrienteRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

public class NutrienteServiceTest {

    @Mock
    private NutrienteRepository nutrienteRepository;

    @InjectMocks
    private NutrienteService nutrienteService;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
    }
    @Test
    public void testSaveNutriente() {
        Nutriente nutriente = new Nutriente();
        when(nutrienteRepository.save(nutriente)).thenReturn(nutriente);
        Nutriente nutrienteSaved = nutrienteService.save(nutriente);
        nutrienteSaved.setId(1L);

        assertEquals(1L, nutrienteSaved.getId());
    }
    @Test
    public void testFindAll() {
        Nutriente nutriente1 = new Nutriente();
        nutriente1.setId(1L);
        Nutriente nutriente2 = new Nutriente();
        nutriente2.setId(2L);

        List<Nutriente> nutrientes = Arrays.asList(nutriente1, nutriente2);

        when(nutrienteRepository.findAll()).thenReturn(nutrientes);

        List<Nutriente> result = nutrienteService.findAll();

        assertEquals(2, result.size());
        assertEquals(1L, result.get(0).getId());
        assertEquals(2L, result.get(1).getId());
        verify(nutrienteRepository, times(1)).findAll();
    }
    @Test
    public void testFindbyId() {
        Nutriente nutriente1 = new Nutriente();
        nutriente1.setId(3L);
        nutriente1.setQuantidade(10.0);

        when(nutrienteRepository.findById(3L)).thenReturn(Optional.of(nutriente1));

        Optional<Nutriente> result = nutrienteService.findById(3L);

        assertEquals(3L, result.get().getId());
        assertEquals(10.0, result.get().getQuantidade());
        verify(nutrienteRepository, times(1)).findById(3L);
    }

}
