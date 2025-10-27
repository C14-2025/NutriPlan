package br.inatel.nutriPlan.services;

import br.inatel.nutriPlan.models.Alimento;
import br.inatel.nutriPlan.models.Refeicao;
import br.inatel.nutriPlan.repositories.AlimentoRepository;
import br.inatel.nutriPlan.repositories.RefeicaoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class RefeicaoService {

    @Autowired
    private RefeicaoRepository refeicaoRepository;
    @Autowired
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

    public Refeicao adicionarAlimento(long refeicaoId, long alimentoId, int quantidade) {
        Optional<Refeicao> optRefeicao = refeicaoRepository.findById(refeicaoId);
        if(optRefeicao.isEmpty()) {
            throw new RuntimeException("Refeicao nao encontrada");
        }
        Optional<Alimento> optAlimento = alimentoRepository.findById((int) alimentoId);
        if(optAlimento.isEmpty()) {
            throw new RuntimeException("Alimento nao encontrado");
        }
        Alimento alimento = optAlimento.get();
        Refeicao refeicao = optRefeicao.get();
        refeicao.getAlimentos().add(alimento);
        return refeicaoRepository.save(refeicao);

    }

    public Refeicao removerAlimento(long refeicaoId, long alimentoId) {
        Optional<Refeicao> optRefeicao = refeicaoRepository.findById(refeicaoId);
        if(optRefeicao.isEmpty()) {
            throw new RuntimeException("Refeicao nao encontrada");
        }
        Refeicao refeicao = optRefeicao.get();
        List<Alimento> alimentos = refeicao.getAlimentos();
        for(Alimento alimento : alimentos) {
            if(alimento.getId() == alimentoId) {
                refeicao.getAlimentos().remove(alimento);
            }
        }
        return refeicaoRepository.save(refeicao);
    }

}
