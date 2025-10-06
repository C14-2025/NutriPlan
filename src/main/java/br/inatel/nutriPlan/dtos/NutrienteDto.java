package br.inatel.nutriPlan.dtos;

import br.inatel.nutriPlan.models.Alimento;
import br.inatel.nutriPlan.models.Refeicao;

import java.util.List;

public class NutrienteDto {
    private double quantidade;
    private List<Refeicao> refeicao;
    private List<Alimento> alimento;

    public double getQuantidade() {
        return quantidade;
    }

    public void setQuantidade(double quantidade) {
        this.quantidade = quantidade;
    }

    public List<Refeicao> getRefeicao() {
        return refeicao;
    }

    public void setRefeicao(List<Refeicao> refeicao) {
        this.refeicao = refeicao;
    }

    public List<Alimento> getAlimento() {
        return alimento;
    }

    public void setAlimento(List<Alimento> alimento) {
        this.alimento = alimento;
    }
}
