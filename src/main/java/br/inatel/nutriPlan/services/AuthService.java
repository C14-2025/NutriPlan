package br.inatel.nutriPlan.services;

import br.inatel.nutriPlan.dtos.LoginDto;
import br.inatel.nutriPlan.models.Usuario;
import br.inatel.nutriPlan.repositories.UsuarioRepository;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

  @Autowired private UsuarioRepository usuarioRepository;

  public ResponseEntity<Object> login(LoginDto loginDto) {
    Optional<Usuario> usuarioOpt = usuarioRepository.findByEmail(loginDto.getEmail());

    if (usuarioOpt.isEmpty()) {
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Email não encontrado");
    }

    Usuario usuario = usuarioOpt.get();
    if (!usuario.getSenha().equals(loginDto.getSenha())) {
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Senha incorreta");
    }

    Map<String, Object> response = new HashMap<>();
    response.put("id", usuario.getId());
    response.put("nome", usuario.getNome());
    response.put("email", usuario.getEmail());
    response.put("idade", usuario.getIdade());
    response.put("peso", usuario.getPeso());
    response.put("altura", usuario.getAltura());
    response.put("objetivo", usuario.getObjetivo());
    response.put("sexo", usuario.getSexo());
    response.put("nivelAtividade", usuario.getNivelAtividade());

    return ResponseEntity.ok(response);
  }

  public ResponseEntity<Object> register(LoginDto loginDto) {
    Optional<Usuario> usuarioExistente = usuarioRepository.findByEmail(loginDto.getEmail());

    if (usuarioExistente.isPresent()) {
      return ResponseEntity.status(HttpStatus.CONFLICT).body("Email já cadastrado");
    }

    Usuario novoUsuario = new Usuario();
    novoUsuario.setNome(loginDto.getNome());
    novoUsuario.setEmail(loginDto.getEmail());
    novoUsuario.setSenha(loginDto.getSenha());
    novoUsuario.setIdade(loginDto.getIdade());
    novoUsuario.setPeso(loginDto.getPeso());
    novoUsuario.setAltura(loginDto.getAltura());
    novoUsuario.setObjetivo(loginDto.getObjetivo());
    novoUsuario.setSexo(loginDto.getSexo());
    novoUsuario.setNivelAtividade(loginDto.getNivelAtividade());

    Usuario usuarioSalvo = usuarioRepository.save(novoUsuario);

    Map<String, Object> response = new HashMap<>();
    response.put("id", usuarioSalvo.getId());
    response.put("nome", usuarioSalvo.getNome());
    response.put("email", usuarioSalvo.getEmail());
    response.put("idade", usuarioSalvo.getIdade());
    response.put("peso", usuarioSalvo.getPeso());
    response.put("altura", usuarioSalvo.getAltura());
    response.put("objetivo", usuarioSalvo.getObjetivo());
    response.put("sexo", usuarioSalvo.getSexo());
    response.put("nivelAtividade", usuarioSalvo.getNivelAtividade());

    return ResponseEntity.status(HttpStatus.CREATED).body(response);
  }
}
