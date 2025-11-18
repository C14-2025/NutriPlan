package br.inatel.nutriPlan.repositories;

import br.inatel.nutriPlan.models.Refeicao;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RefeicaoRepository extends JpaRepository<Refeicao, Long> {
  List<Refeicao> findByUsuarioId(Long usuarioId);
}
