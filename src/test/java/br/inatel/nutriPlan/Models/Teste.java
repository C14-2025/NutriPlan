package br.inatel.nutriPlan.Models;

import br.inatel.nutriPlan.models.Alimento;
import br.inatel.nutriPlan.models.Refeicao;
import br.inatel.nutriPlan.models.Usuario;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;
import java.util.ArrayList;

import static org.junit.jupiter.api.Assertions.assertEquals;

public class Teste {

    private Usuario usuario;
    private Refeicao refeicao;
    private Alimento alimento;
    //private Nutriente nutriente;

    @BeforeEach
    public void setup() {
        // Criar usuário
        usuario = new Usuario();
        usuario.setNome("Sabrina");
        usuario.setEmail("sabrina@email.com");
        usuario.setIdade(25);
        usuario.setPeso(60.0);
        usuario.setAltura(1.65);
        usuario.setObjetivo("Emagrecer");
        usuario.setRefeicoes(new ArrayList<>());

        // Criar refeição
        refeicao = new Refeicao();
        refeicao.setTipo("Almoço");
        refeicao.setDataHora(LocalDateTime.now());
        refeicao.setUsuario(usuario);
        //refeicao.setNutrientes(new ArrayList<>());

        // Criar alimento
        alimento = new Alimento();
        alimento.setNome("Ovo");
        alimento.setCalorias(155.0);
        alimento.setCarboidratos(1.1);
        alimento.setProteinas(13.0);
        alimento.setGorduras(11.0);

        // Criar nutriente
        /*
        nutriente = new Nutriente();
        nutriente.setQuantidade(50.0);
        nutriente.setAlimento(alimento);
        nutriente.setRefeicao(refeicao);
        */
    }


     
    @Test
    public void usuarioTest() {
        assertEquals("Sabrina", usuario.getNome());
        assertEquals("sabrina@email.com", usuario.getEmail());
        assertEquals(25, usuario.getIdade());
        assertEquals(60.0, usuario.getPeso());
        assertEquals(1.65, usuario.getAltura());
        assertEquals("Emagrecer", usuario.getObjetivo());
    }

    @Test
    public void refeicaoTest() {
        // Adiciona a refeição ao usuário
        usuario.getRefeicoes().add(refeicao);

        assertEquals(1, usuario.getRefeicoes().size());
        assertEquals("Almoço", usuario.getRefeicoes().get(0).getTipo());
        assertEquals(usuario, usuario.getRefeicoes().get(0).getUsuario());
    }
    /*
    @Test
    public void nutrienteTest() {
        // Adiciona o nutriente à refeição
        refeicao.getNutrientes().add(nutriente);

        assertEquals(1, refeicao.getNutrientes().size());
        assertEquals(alimento, refeicao.getNutrientes().get(0).getAlimento());
        assertEquals(refeicao, refeicao.getNutrientes().get(0).getRefeicao());
        assertEquals(50.0, refeicao.getNutrientes().get(0).getQuantidade());
    }

     */
}

