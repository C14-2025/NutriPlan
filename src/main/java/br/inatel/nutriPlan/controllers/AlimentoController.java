package br.inatel.nutriPlan.controllers;

import br.inatel.nutriPlan.dtos.AlimentoDto;
import br.inatel.nutriPlan.models.Alimento;
import br.inatel.nutriPlan.services.AlimentoService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "*", maxAge = 3600)
@RequestMapping("/alimento")
public class AlimentoController {

  @Autowired private AlimentoService alimentoService;

  @PostMapping
  public ResponseEntity<Object> saveAlimento(@Valid @RequestBody AlimentoDto alimentoDto) {
    var alimentoModel = new Alimento();
    BeanUtils.copyProperties(alimentoDto, alimentoModel); // converção de dto para model
    return ResponseEntity.status(HttpStatus.CREATED).body(alimentoService.save(alimentoModel));
  }

  @GetMapping
  public ResponseEntity<List<Alimento>> getAllAlimentos() {
    return ResponseEntity.status(HttpStatus.OK).body(alimentoService.findAll());
  }
}
