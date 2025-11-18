package br.inatel.nutriPlan.controllers;

import br.inatel.nutriPlan.dtos.*;
import br.inatel.nutriPlan.models.Alimento;
import br.inatel.nutriPlan.models.Refeicao;
import br.inatel.nutriPlan.models.Usuario;
import br.inatel.nutriPlan.services.RefeicaoService;
import br.inatel.nutriPlan.services.UsuarioService;
import jakarta.validation.Valid;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.*;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/refeicao")
public class RefeicaoController {

  @Autowired private RefeicaoService refeicaoService;

  @Autowired private UsuarioService usuarioService;

  @GetMapping
  public ResponseEntity<List<Refeicao>> getAllRefeicoes() {
    return ResponseEntity.status(HttpStatus.OK).body(refeicaoService.findAll());
  }

  @GetMapping("/{id}")
  public ResponseEntity<Refeicao> getOneRefeicao(@PathVariable(value = "id") long id) {
    Optional<Refeicao> refeicaoModeloptional = refeicaoService.findById(id);
    if (!refeicaoModeloptional.isPresent()) {
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
    }
    return ResponseEntity.status(HttpStatus.OK).body(refeicaoModeloptional.get());
  }

  @PostMapping
  public ResponseEntity<Object> saveRefeicao(@RequestBody @Valid RefeicaoDto refeicaoDto) {
    if (refeicaoDto.getUsuario() == null || refeicaoDto.getUsuario().getId() == null) {
      return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("O ID do usuário é obrigatório.");
    }

    var refeicaoModel = new Refeicao();
    BeanUtils.copyProperties(refeicaoDto, refeicaoModel); // converção de dto para model
    refeicaoModel.setDataHora(LocalDateTime.now(ZoneId.of("UTC")));

    Usuario usuario =
        usuarioService
            .findById(refeicaoDto.getUsuario().getId())
            .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
    refeicaoModel.setUsuario(usuario);

    return ResponseEntity.status(HttpStatus.CREATED).body(refeicaoService.save(refeicaoModel));
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Object> deleteRefeicao(@PathVariable(value = "id") long id) {
    Optional<Refeicao> refeicao0 = refeicaoService.findById(id);
    if (refeicao0.isEmpty()) {
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Refeicao nao encontrada.");
    }
    refeicaoService.delete(refeicao0.get());
    return ResponseEntity.status(HttpStatus.OK).body("Refeicao apagada com sucesso.");
  }

  @PutMapping("/{id}")
  public ResponseEntity<Object> updateRefeicao(
      @PathVariable(value = "id") long id, @RequestBody @Valid RefeicaoDto refeicaoDto) {
    Optional<Refeicao> refeicao0 = refeicaoService.findById(id);
    if (refeicao0.isEmpty()) {
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Refeicao nao encontrada.");
    }
    // iniciando um refeicao model para ser atualizado na base de dados
    var refeicaoModel = refeicao0.get();
    BeanUtils.copyProperties(
        refeicaoDto, refeicaoModel); // conversao dos campos atualizados de dto para model
    return ResponseEntity.status(HttpStatus.OK)
        .body(refeicaoService.save(refeicaoModel)); // salvando
  }

  @PostMapping("/{refeicaoId}/alimentos")
  public ResponseEntity<Refeicao> adicionarAlimento(
      @PathVariable long refeicaoId, @RequestParam long alimentoId, @RequestParam int quantidade) {
    Refeicao refeicao = refeicaoService.adicionarAlimento(refeicaoId, alimentoId, quantidade);
    return ResponseEntity.status(HttpStatus.CREATED).body(refeicao);
  }

  @DeleteMapping("/{refeicaoId}/alimentos/{alimentoId}")
  public ResponseEntity<Refeicao> removerAlimento(
      @PathVariable long refeicaoId, @PathVariable long alimentoId) {
    Refeicao refeicao = refeicaoService.removerAlimento(refeicaoId, alimentoId);
    return ResponseEntity.status(HttpStatus.OK).body(refeicao);
  }

  @GetMapping("/{id}/totais")
  public ResponseEntity<TotaisNutricionaisDto> getTotaisNutricionais(@PathVariable long id) {
    Map<String, Double> totaisMap = refeicaoService.calcularTotaisNutricionais(id);
    TotaisNutricionaisDto totaisDto =
        new TotaisNutricionaisDto(
            totaisMap.get("Calorias"),
            totaisMap.get("Proteinas"),
            totaisMap.get("Carboidratos"),
            totaisMap.get("Gorduras"));
    return ResponseEntity.status(HttpStatus.OK).body(totaisDto);
  }

  @GetMapping("/{id}/alimentos")
  public ResponseEntity<List<AlimentoQuantidadeDto>> getAlimentos(@PathVariable long id) {
    Optional<Refeicao> optRefeicao = refeicaoService.findById(id);
    if (optRefeicao.isEmpty()) {
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
    }
    Refeicao refeicao = optRefeicao.get();
    if (refeicao.getAlimentos().isEmpty() || refeicao.getQuantidadePorAlimento().isEmpty()) {
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
    }
    List<AlimentoQuantidadeDto> alimentosDto = new ArrayList<>();
    if (refeicao.getQuantidadePorAlimento() != null) {
      for (Map.Entry<Alimento, Double> entry : refeicao.getQuantidadePorAlimento().entrySet()) {
        Alimento alimento = entry.getKey();
        double quantidade = entry.getValue();
        alimentosDto.add(new AlimentoQuantidadeDto(alimento.getId(), quantidade));
      }
    }
    return ResponseEntity.ok(alimentosDto);
  }

  @GetMapping("/usuario/{usuarioId}")
  public ResponseEntity<List<Refeicao>> getRefeicoesPorUsuario(@PathVariable long usuarioId) {
    List<Refeicao> refeicoes = refeicaoService.findByUsuarioId(usuarioId);
    if (refeicoes.isEmpty()) {
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
    }
    return ResponseEntity.ok(refeicoes);
  }
}
