package br.inatel.nutriPlan.services;

import br.inatel.nutriPlan.models.Usuario;
import br.inatel.nutriPlan.repositories.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UsuarioService {
    @Autowired
    private UsuarioRepository usuarioRepository;

    public List<Usuario> findAll() {
        return usuarioRepository.findAll();
    }

    public Optional<Usuario> findById(long id) {
        return usuarioRepository.findById((int) id);
    }

    public Usuario save(Usuario usuarioModel) {
        return usuarioRepository.save(usuarioModel);
    }

    public void delete(Usuario usuario) {
        usuarioRepository.delete(usuario);
    }
}
