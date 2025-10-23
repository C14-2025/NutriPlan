package br.inatel.nutriPlan.services;

import br.inatel.nutriPlan.models.Alimento;
import br.inatel.nutriPlan.models.Refeicao;
import br.inatel.nutriPlan.repositories.AlimentoRepository;
import br.inatel.nutriPlan.repositories.RefeicaoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class RefeicaoService {

    @Autowired
    private RefeicaoRepository refeicaoRepository;
    private AlimentoRepository alimentoRepository;

    public List<Refeicao> findAll() {
        return refeicaoRepository.findAll();
    }

    public Optional<Refeicao> findById(long id) {
        return refeicaoRepository.findById(id);
    }

    public Refeicao save(Refeicao refeicaoModel) {
        return refeicaoRepository.save(refeicaoModel);
    }

    public void delete(Refeicao refeicao) {
        refeicaoRepository.delete(refeicao);
    }


}
