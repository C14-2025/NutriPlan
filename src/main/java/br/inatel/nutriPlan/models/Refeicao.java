package br.inatel.nutriPlan.models;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Entity
public class Refeicao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String tipo; // Café da manhã, Almoço, Jantar, Lanche
    private LocalDateTime dataHora;

    @ManyToOne
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;


    @ManyToMany
    @JoinTable(
            name = "refeicao_alimento",
            joinColumns = @JoinColumn(name = "refeicao_id"),
            inverseJoinColumns = @JoinColumn(name = "alimento_id")
    )
    private List<Alimento> alimentos;

    @ElementCollection
    @CollectionTable(name = "refeicao_quantidade", joinColumns = @JoinColumn(name = "refeicao_id"))
    @MapKeyJoinColumn(name = "alimento_id")
    @Column(name = "quantidade")
    private Map<Alimento, Double> quantidadePorAlimento = new HashMap<>();


    // Getters e Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTipo() { return tipo; }
    public void setTipo(String tipo) { this.tipo = tipo; }

    public LocalDateTime getDataHora() { return dataHora; }
    public void setDataHora(LocalDateTime dataHora) { this.dataHora = dataHora; }

    public Usuario getUsuario() { return usuario; }
    public void setUsuario(Usuario usuario) { this.usuario = usuario; }


    public List<Alimento> getAlimentos() {
        return alimentos;
    }

    public void setAlimentos(List<Alimento> alimentos) {
        this.alimentos = alimentos;
    }


    public Map<Alimento, Double> getQuantidadePorAlimento() {
        return quantidadePorAlimento;
    }

    public void setQuantidadePorAlimento(Map<Alimento, Double> quantidadePorAlimento) {
        this.quantidadePorAlimento = quantidadePorAlimento;
    }
}

