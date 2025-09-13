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

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

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
    void testSaveAlimentoRespostaHTTP() {
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

    @Test
    void testSaveAlimentoValorCorreto() {

        AlimentoDto dto = new AlimentoDto();
        dto.setNome("Frango");

        Alimento model = new Alimento();
        model.setNome("Frango");

        when(service.save(any(Alimento.class))).thenReturn(model);

        ResponseEntity<Object> response = controller.saveAlimento(dto);

        assertEquals("Frango", ((Alimento) response.getBody()).getNome());

    }

    @Test
    void testBuscarPorIdEncontrado() {
        Alimento alimento = new Alimento();
        alimento.setId(1L);
        alimento.setNome("Peixe");

        when(service.findById(1L)).thenReturn(Optional.of(alimento));

        ResponseEntity<Object> response = controller.buscarAlimento(1L);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals("Peixe", ((Alimento) response.getBody()).getNome());
    }

    @Test
    void testListarAlimentos() {
        Alimento a1 = new Alimento();
        a1.setNome("Arroz");
        Alimento a2 = new Alimento();
        a2.setNome("Batata");

        when(service.findAll()).thenReturn(Arrays.asList(a1, a2));

        ResponseEntity<List<Alimento>> response = controller.listarAlimentos();

        assertEquals(200, response.getStatusCodeValue());
        assertEquals(2, response.getBody().size());
        assertEquals("Arroz", response.getBody().get(0).getNome());
    }

}