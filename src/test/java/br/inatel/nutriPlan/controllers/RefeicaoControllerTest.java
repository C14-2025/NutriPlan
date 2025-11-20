package br.inatel.nutriPlan.controllers;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

import br.inatel.nutriPlan.models.Refeicao;
import br.inatel.nutriPlan.services.RefeicaoService;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;

class RefeicaoControllerTest {

  @Mock private RefeicaoService refeicaoService;

  @InjectMocks private RefeicaoController refeicaoController;

  @BeforeEach
  void setup() {
    MockitoAnnotations.openMocks(this);
  }

  @Test
  void testGetOneRefeicaoEncontrada() {
    Refeicao refeicao = new Refeicao();
    refeicao.setId(1L);
    refeicao.setTipo("Café da manhã");

    when(refeicaoService.findById(1L)).thenReturn(Optional.of(refeicao));

    ResponseEntity<Refeicao> response = refeicaoController.getOneRefeicao(1L);

    assertEquals(200, response.getStatusCodeValue());
    assertEquals("Café da manhã", response.getBody().getTipo());
  }

  @Test
  void testGetOneRefeicaoNaoEncontrada() {
    when(refeicaoService.findById(999L)).thenReturn(Optional.empty());

    ResponseEntity<Refeicao> response = refeicaoController.getOneRefeicao(999L);

    assertEquals(404, response.getStatusCodeValue());
    assertNull(response.getBody());
  }
}
