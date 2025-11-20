package br.inatel.nutriPlan.services;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;
import static org.mockito.Mockito.times;

import br.inatel.nutriPlan.models.Usuario;
import br.inatel.nutriPlan.repositories.UsuarioRepository;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

public class UsuarioServiceTest {
  @Mock private UsuarioRepository usuarioRepository;

  @InjectMocks private UsuarioService usuarioService;

  @BeforeEach
  public void setUp() {
    MockitoAnnotations.initMocks(this);
  }

  @Test
  public void testSaveUsuario() {
    Usuario usuario = new Usuario();
    usuario.setId(1L);
    when(usuarioRepository.save(usuario)).thenReturn(usuario);
    Usuario usuarioSaved = usuarioService.save(usuario);

    assertEquals(1L, usuarioSaved.getId());
  }

  @Test
  public void testFindAll() {
    Usuario usuario1 = new Usuario();
    usuario1.setId(1L);
    Usuario usuario2 = new Usuario();
    usuario2.setId(2L);

    List<Usuario> usuarios = Arrays.asList(usuario1, usuario2);

    when(usuarioRepository.findAll()).thenReturn(usuarios);

    List<Usuario> result = usuarioService.findAll();

    assertEquals(2, result.size());
    assertEquals(1L, result.get(0).getId());
    assertEquals(2L, result.get(1).getId());
    verify(usuarioRepository, times(1)).findAll();
  }

  @Test
  public void testFindbyId() {
    Usuario usuario1 = new Usuario();
    usuario1.setId(3L);
    usuario1.setNome("natalia");

    when(usuarioRepository.findById(3)).thenReturn(Optional.of(usuario1));

    Optional<Usuario> result = usuarioService.findById(3L);

    assertEquals(3L, result.get().getId());
    assertEquals("natalia", result.get().getNome());
    verify(usuarioRepository, times(1)).findById(3);
  }

  @Test
  public void testDeleteUsuario() {
    Usuario usuario = new Usuario();
    usuario.setId(1L);

    doNothing().when(usuarioRepository).delete(usuario);
    usuarioService.delete(usuario);
    verify(usuarioRepository, times(1)).delete(usuario);
  }
}
