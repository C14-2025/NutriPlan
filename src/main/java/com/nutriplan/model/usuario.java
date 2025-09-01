package com.nutriplan.model;

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
}
