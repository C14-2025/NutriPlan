package br.inatel.nutriPlan.repositories;

import br.inatel.nutriPlan.models.Nutriente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface NutrienteRepository extends JpaRepository<Nutriente, Long>{
}
