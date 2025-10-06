package br.inatel.nutriPlan.controllers;


import br.inatel.nutriPlan.dtos.NutrienteDto;
import br.inatel.nutriPlan.models.Nutriente;
import br.inatel.nutriPlan.services.NutrienteService;
import jakarta.validation.Valid;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/nutriente")
public class NutrienteController {

    @Autowired
    private NutrienteService nutrienteService;

    @GetMapping
    public ResponseEntity<List<Nutriente>> getAllNutrientes() {
        return ResponseEntity.status(HttpStatus.OK).body(nutrienteService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Nutriente> getOneNutriente(@PathVariable(value = "id") long id) {
        Optional<Nutriente> nutrienteModelOptional = nutrienteService.findById(id);
        if(!nutrienteModelOptional.isPresent()){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
        return ResponseEntity.status(HttpStatus.OK).body(nutrienteModelOptional.get());
    }
    @PostMapping
    public ResponseEntity<Object> saveNutriente(@RequestBody @Valid NutrienteDto refeicaoDto) {
        var nutrienteModel = new Nutriente();
        BeanUtils.copyProperties(refeicaoDto, nutrienteModel); //converção de dto para model
        return ResponseEntity.status(HttpStatus.CREATED).body(nutrienteService.save(nutrienteModel));
    }


}
