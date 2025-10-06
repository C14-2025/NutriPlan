package br.inatel.nutriPlan.services;

import br.inatel.nutriPlan.models.Nutriente;
import br.inatel.nutriPlan.repositories.NutrienteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class NutrienteService {
    @Autowired
    private NutrienteRepository nutrienteRepository;

    public List<Nutriente> findAll() {
        return nutrienteRepository.findAll();
    }
    public Optional<Nutriente> findById(long id) {
        return nutrienteRepository.findById(id);
    }

    public Nutriente save(Nutriente nutrienteModel) {
        return nutrienteRepository.save(nutrienteModel);
    }
}
