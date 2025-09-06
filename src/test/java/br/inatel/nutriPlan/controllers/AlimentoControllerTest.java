package br.inatel.nutriPlan.controllers;

import br.inatel.nutriPlan.dtos.AlimentoDto;
import br.inatel.nutriPlan.models.Alimento;
import br.inatel.nutriPlan.services.AlimentoService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

class AlimentoControllerTest {
    @Mock
    private AlimentoService service;  // aqui eu estou mockando o comportamento do service

    @InjectMocks
    private AlimentoController controller; // e injetando no controller

    @BeforeEach
    void setup() {
        MockitoAnnotations.openMocks(this); // inicializando o mockito
    }

    @Test
    void testSaveAlimento() {
        //FIXTURE DO TESTE
        AlimentoDto dto = new AlimentoDto(); //entrada do metodo
        dto.setNome("Feijão");

        Alimento model = new Alimento(); //saida esperada do teste
        model.setNome("Feijão");

        // configuração do mock
        when(service.save(any(Alimento.class))).thenReturn(model);

        // Chamada do Controller
        ResponseEntity<Object> response = controller.saveAlimento(dto);

        assertEquals(201, response.getStatusCodeValue()); //testando se foi criado

    }
}