package br.inatel.nutriPlan.services;

import br.inatel.nutriPlan.repositories.AlimentoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AlimentoService {

    @Autowired
    private AlimentoRepository alimentoRepository;
}
