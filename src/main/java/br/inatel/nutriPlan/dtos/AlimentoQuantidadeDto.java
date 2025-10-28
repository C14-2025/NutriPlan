package br.inatel.nutriPlan.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public class AlimentoQuantidadeDto {
    private Long alimentoId;

    @NotBlank(message = "A quantidade deve ser informada")
    @Positive(message = "A quantidade deve ser maior que zero")
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
