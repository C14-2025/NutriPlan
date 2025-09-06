package br.inatel.nutriPlan.services;

import br.inatel.nutriPlan.models.Alimento;
import br.inatel.nutriPlan.repositories.AlimentoRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AlimentoService {

    @Autowired
    private AlimentoRepository alimentoRepository;

    @Transactional
    public Alimento save(Alimento alimentoModel) {
        return alimentoRepository.save(alimentoModel);
    }
}
