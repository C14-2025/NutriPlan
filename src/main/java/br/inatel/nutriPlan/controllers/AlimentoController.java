package br.inatel.nutriPlan.controllers;

import br.inatel.nutriPlan.models.Alimento;
import br.inatel.nutriPlan.services.AlimentoService;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.ZoneId;

@RestController
@CrossOrigin(origins = "*", maxAge = 3600)
@RequestMapping("/alimento")
public class AlimentoController {

    @Autowired
    private AlimentoService alimentoService;

    @PostMapping
    public ResponseEntity<Object> saveAlimento(@RequestBody AlimentoDto alimentoDto) {
        var alimentoModel = new Alimento();
        BeanUtils.copyProperties(alimentoDto, alimentoModel); //converção de dto para model
        return ResponseEntity.status(HttpStatus.CREATED).body(alimentoService.save(alimentoModel));


    }
}
