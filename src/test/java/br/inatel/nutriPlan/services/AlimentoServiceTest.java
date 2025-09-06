package br.inatel.nutriPlan.services;

import br.inatel.nutriPlan.models.Alimento;
import br.inatel.nutriPlan.repositories.AlimentoRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class AlimentoServiceTest {

    @Mock
    private AlimentoRepository alimentoRepository;

    @InjectMocks
    private AlimentoService service; // injetando o mock no service

    @BeforeEach
    void setup() {
        MockitoAnnotations.openMocks(this); // inicializando o mockito
    }


    @Test
    void save() {
        Alimento alimento = new Alimento();
        alimento.setNome("Arroz");

        when(alimentoRepository.save(alimento)).thenReturn(alimento);

        Alimento result = service.save(alimento);

        assertNotNull(result);
        //assertEquals("Arroz", result.getNome());

    }
}