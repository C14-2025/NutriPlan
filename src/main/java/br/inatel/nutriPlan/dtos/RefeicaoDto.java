package br.inatel.nutriPlan.dtos;

import br.inatel.nutriPlan.models.Usuario;

import java.util.List;

public class RefeicaoDto {
    private String tipo;
    private Usuario usuario;
    private List<AlimentoQuantidadeDto> alimentos; //nao é indicado usar map aqui

    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }


    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }


}
