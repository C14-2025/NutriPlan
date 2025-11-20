package br.inatel.nutriPlan.dtos;

import br.inatel.nutriPlan.models.Usuario;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public class RefeicaoDto {
  @NotBlank(message = "O tipo da refeição não pode ser vazio")
  private String tipo;

  private List<AlimentoQuantidadeDto> alimentos; // nao é indicado usar map aqui

  @NotNull(message = "O usuário deve ser informado")
  private Usuario usuario;

  public Usuario getUsuario() {
    return usuario;
  }

  public void setUsuario(Usuario usuario) {
    this.usuario = usuario;
  }

  public String getTipo() {
    return tipo;
  }

  public void setTipo(String tipo) {
    this.tipo = tipo;
  }

  public List<AlimentoQuantidadeDto> getAlimentos() {
    return alimentos;
  }

  public void setAlimentos(List<AlimentoQuantidadeDto> alimentos) {
    this.alimentos = alimentos;
  }
}
