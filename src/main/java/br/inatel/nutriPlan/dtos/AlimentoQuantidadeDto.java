package br.inatel.nutriPlan.dtos;

public class AlimentoQuantidadeDto {
    private Long alimentoId;
    private Double quantidade;

    public AlimentoQuantidadeDto(Long alimentoId, Double quantidade) {
        this.alimentoId = alimentoId;
        this.quantidade = quantidade;
    }

    public Long getAlimentoId() {
        return alimentoId;
    }

    public void setAlimentoId(Long alimentoId) {
        this.alimentoId = alimentoId;
    }

    public Double getQuantidade() {
        return quantidade;
    }

    public void setQuantidade(Double quantidade) {
        this.quantidade = quantidade;
    }
}
