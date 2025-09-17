package br.inatel.nutriPlan.dtos;

import br.inatel.nutriPlan.models.Nutriente;
import br.inatel.nutriPlan.models.Usuario;

import java.time.LocalDateTime;
import java.util.List;

public class RefeicaoDto {
    private String tipo;
    private Usuario usuario;
    private List<Nutriente> nutrientes;

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

    public List<Nutriente> getNutrientes() {
        return nutrientes;
    }

    public void setNutrientes(List<Nutriente> nutrientes) {
        this.nutrientes = nutrientes;
    }
}
