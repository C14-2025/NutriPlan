package br.inatel.nutriPlan.services;

import br.inatel.nutriPlan.models.Alimento;
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

    public Nutriente calcularNutrientes(Alimento alimento, double quantidade) {
        Nutriente n = new Nutriente();
        n.setAlimento(alimento);
        n.setQuantidade(quantidade);

        double fator = quantidade / 100.0;
        n.setCalorias(alimento.getCalorias() * fator);
        n.setCarboidratos(alimento.getCarboidratos() * fator);
        n.setProteinas(alimento.getProteinas() * fator);
        n.setGorduras(alimento.getGorduras() * fator);

        return n;
    }
}
