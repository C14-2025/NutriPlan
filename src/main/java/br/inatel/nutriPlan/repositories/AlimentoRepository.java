package br.inatel.nutriPlan.repositories;

import br.inatel.nutriPlan.models.Alimento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AlimentoRepository extends JpaRepository<Alimento, Long> {
}
