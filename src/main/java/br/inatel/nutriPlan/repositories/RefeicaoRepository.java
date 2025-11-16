package br.inatel.nutriPlan.repositories;

import br.inatel.nutriPlan.models.Refeicao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RefeicaoRepository extends JpaRepository<Refeicao, Long> {
    List<Refeicao> findByUsuarioId(Long usuarioId);
}
