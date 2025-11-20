package br.inatel.nutriPlan.services;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

import br.inatel.nutriPlan.models.Alimento;
import br.inatel.nutriPlan.repositories.AlimentoRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

class AlimentoServiceTest {

  @Mock private AlimentoRepository alimentoRepository;

  @InjectMocks private AlimentoService service; // injetando o mock no service

  @BeforeEach
  void setup() {
    MockitoAnnotations.openMocks(this); // inicializando o mockito
  }

  @Test
  void testsaveNotNull() {
    Alimento alimento = new Alimento();
    alimento.setNome("Arroz");

    when(alimentoRepository.save(alimento)).thenReturn(alimento);

    Alimento result = service.save(alimento);

    assertNotNull(result);
  }

  @Test
  void testsaveIsCorrect() {
    Alimento alimento = new Alimento();
    alimento.setNome("Arroz");

    when(alimentoRepository.save(alimento)).thenReturn(alimento);

    Alimento result = service.save(alimento);

    assertEquals("Arroz", result.getNome());
  }
}
