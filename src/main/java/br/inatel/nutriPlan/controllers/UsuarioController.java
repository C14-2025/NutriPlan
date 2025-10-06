package br.inatel.nutriPlan.controllers;

import br.inatel.nutriPlan.dtos.UsuarioDto;
import br.inatel.nutriPlan.models.Usuario;
import br.inatel.nutriPlan.services.UsuarioService;
import jakarta.validation.Valid;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/usuario")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    @GetMapping
    public ResponseEntity<List<Usuario>> getAllUsuarios() {
        return ResponseEntity.status(HttpStatus.OK).body(usuarioService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Usuario> getOneUsuario(@PathVariable(value = "id") long id) {
        Optional<Usuario> usuarioModeloptional = usuarioService.findById(id);
        if(!usuarioModeloptional.isPresent()){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
        return ResponseEntity.status(HttpStatus.OK).body(usuarioModeloptional.get());
    }

    @PostMapping
    public ResponseEntity<Object> saveUsuario(@RequestBody @Valid UsuarioDto usuarioDto) {
        var usuarioModel = new Usuario();
        BeanUtils.copyProperties(usuarioDto, usuarioModel); //converção de dto para model
        return ResponseEntity.status(HttpStatus.CREATED).body(usuarioService.save(usuarioModel));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Object> deleteUsuario(@PathVariable(value="id") long id){
        Optional<Usuario> usuario0 = usuarioService.findById(id);
        if(usuario0.isEmpty()){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Usuario nao encontrado.");
        }
        usuarioService.delete(usuario0.get());
        return ResponseEntity.status(HttpStatus.OK).body("Usuario apagado com sucesso.");
    }

    @PutMapping("/{id}")
    public ResponseEntity<Object> updateUsuario(@PathVariable(value="id") long id,
                                                 @RequestBody @Valid UsuarioDto usuarioDto) {
        Optional<Usuario> usuario0 = usuarioService.findById(id);
        if(usuario0.isEmpty()){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Usuario nao encontrado.");
        }
        //iniciando um usuario model para ser atualizado na base de dados
        var usuarioModel = usuario0.get();
        BeanUtils.copyProperties(usuarioDto, usuarioModel); //conversao dos campos atualizados de dto para model
        return ResponseEntity.status(HttpStatus.OK).body(usuarioService.save(usuarioModel)); //salvando
    }
}
