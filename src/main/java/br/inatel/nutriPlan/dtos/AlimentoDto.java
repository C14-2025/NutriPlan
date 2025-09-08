package br.inatel.nutriPlan.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

public class AlimentoDto {
    @NotBlank(message = "Nome é obrigatório")
    private String nome;
    
    @NotNull(message = "Calorias é obrigatório")
    @PositiveOrZero(message = "Calorias deve ser positivo")
    private Double calorias;
    
    @NotNull(message = "Carboidratos é obrigatório")
    @PositiveOrZero(message = "Carboidratos deve ser positivo")
    private Double carboidratos;
    
    @NotNull(message = "Proteínas é obrigatório")
    @PositiveOrZero(message = "Proteínas deve ser positivo")
    private Double proteinas;
    
    @NotNull(message = "Gorduras é obrigatório")
    @PositiveOrZero(message = "Gorduras deve ser positivo")
    private Double gorduras;

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public Double getCalorias() {
        return calorias;
    }

    public void setCalorias(Double calorias) {
        this.calorias = calorias;
    }

    public Double getCarboidratos() {
        return carboidratos;
    }

    public void setCarboidratos(Double carboidratos) {
        this.carboidratos = carboidratos;
    }

    public Double getProteinas() {
        return proteinas;
    }

    public void setProteinas(Double proteinas) {
        this.proteinas = proteinas;
    }

    public Double getGorduras() {
        return gorduras;
    }

    public void setGorduras(Double gorduras) {
        this.gorduras = gorduras;
    }
}
