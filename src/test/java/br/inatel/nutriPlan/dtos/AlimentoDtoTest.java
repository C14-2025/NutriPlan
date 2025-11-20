package br.inatel.nutriPlan.dtos;

import static org.junit.jupiter.api.Assertions.*;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import java.util.Set;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class AlimentoDtoTest {

  private Validator validator;

  @BeforeEach
  void setup() {
    ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
    validator = factory.getValidator();
  }

  @Test
  void testAlimentoValidoSemErros() {
    AlimentoDto dto = new AlimentoDto();
    dto.setNome("Arroz");
    dto.setCalorias(130.0);
    dto.setCarboidratos(28.0);
    dto.setProteinas(2.7);
    dto.setGorduras(0.3);

    Set<ConstraintViolation<AlimentoDto>> violations = validator.validate(dto);

    assertTrue(violations.isEmpty());
  }

  @Test
  void testAlimentoComNomeVazio() {
    AlimentoDto dto = new AlimentoDto();
    dto.setNome("");
    dto.setCalorias(130.0);
    dto.setCarboidratos(28.0);
    dto.setProteinas(2.7);
    dto.setGorduras(0.3);

    Set<ConstraintViolation<AlimentoDto>> violations = validator.validate(dto);

    assertFalse(violations.isEmpty());
    assertTrue(violations.stream().anyMatch(v -> v.getMessage().contains("obrigatório")));
  }

  @Test
  void testAlimentoComCaloriasNegativas() {
    AlimentoDto dto = new AlimentoDto();
    dto.setNome("Teste");
    dto.setCalorias(-10.0);
    dto.setCarboidratos(28.0);
    dto.setProteinas(2.7);
    dto.setGorduras(0.3);

    Set<ConstraintViolation<AlimentoDto>> violations = validator.validate(dto);

    assertFalse(violations.isEmpty());
    assertTrue(violations.stream().anyMatch(v -> v.getMessage().contains("positivo")));
  }
}
