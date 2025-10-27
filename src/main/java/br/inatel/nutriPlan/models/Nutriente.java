package br.inatel.nutriPlan.models;

import jakarta.persistence.*;

@Entity
public class Nutriente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Double quantidade; // em gramas
    private Double calorias;
    private Double carboidratos;
    private Double proteinas;
    private Double gorduras;

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

    @ManyToOne
    @JoinColumn(name = "refeicao_id")
    private Refeicao refeicao;

    @ManyToOne
    @JoinColumn(name = "alimento_id")
    private Alimento alimento;

    // Getters e Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Double getQuantidade() { return quantidade; }
    public void setQuantidade(Double quantidade) { this.quantidade = quantidade; }

    public Refeicao getRefeicao() { return refeicao; }
    public void setRefeicao(Refeicao refeicao) { this.refeicao = refeicao; }

    public Alimento getAlimento() { return alimento; }
    public void setAlimento(Alimento alimento) { this.alimento = alimento; }


    public double getCaloriasCalculadas() {
        if (alimento == null || quantidade == null) return 0;
        return (alimento.getCalorias() * quantidade) / 100.0;
    }

    public double getProteinasCalculadas() {
        if (alimento == null || quantidade == null) return 0;
        return (alimento.getProteinas() * quantidade) / 100.0;
    }

    public double getCarboidratosCalculadas() {
        if (alimento == null || quantidade == null) return 0;
        return (alimento.getCarboidratos() * quantidade) / 100.0;
    }

    public double getGordurasCalculadas() {
        if (alimento == null || quantidade == null) return 0;
        return (alimento.getGorduras() * quantidade) / 100.0;
    }

}
