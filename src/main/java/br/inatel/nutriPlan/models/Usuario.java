package br.inatel.nutriPlan.models;

import jakarta.persistence.*;
import java.util.List;

@Entity
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;
    private String email;
    private String senha;

    private Integer idade;
    private Double peso;
    private Double altura;
    private String objetivo;

    @OneToMany(mappedBy = "usuario", cascade = CascadeType.ALL)
    private List<Refeicao> refeicoes;

    // Getters e Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getSenha() { return senha; }
    public void setSenha(String senha) { this.senha = senha; }

    public Integer getIdade() { return idade; }
    public void setIdade(Integer idade) { this.idade = idade; }

    public Double getPeso() { return peso; }
    public void setPeso(Double peso) { this.peso = peso; }

    public Double getAltura() { return altura; }
    public void setAltura(Double altura) { this.altura = altura; }

    public String getObjetivo() { return objetivo; }
    public void setObjetivo(String objetivo) { this.objetivo = objetivo; }

    public List<Refeicao> getRefeicoes() { return refeicoes; }
    public void setRefeicoes(List<Refeicao> refeicoes) { this.refeicoes = refeicoes; }
}
