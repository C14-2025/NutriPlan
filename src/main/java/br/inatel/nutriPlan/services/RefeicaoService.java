package br.inatel.nutriPlan.services;

import br.inatel.nutriPlan.models.Alimento;
import br.inatel.nutriPlan.models.Refeicao;
import br.inatel.nutriPlan.repositories.AlimentoRepository;
import br.inatel.nutriPlan.repositories.RefeicaoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
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

    public Refeicao adicionarAlimento(long refeicaoId, long alimentoId, double quantidade) {
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

        if (refeicao.getQuantidadePorAlimento() == null) {
            refeicao.setQuantidadePorAlimento(new HashMap<>());
        }

        refeicao.getQuantidadePorAlimento().put(alimento, quantidade);

        return refeicaoRepository.save(refeicao);

    }

    public Refeicao removerAlimento(long refeicaoId, long alimentoId) {
        Optional<Refeicao> optRefeicao = refeicaoRepository.findById(refeicaoId);
        if(optRefeicao.isEmpty()) {
            throw new RuntimeException("Refeicao nao encontrada");
        }
        Optional<Alimento> optAlimento = alimentoRepository.findById((int) alimentoId);
        if(optAlimento.isEmpty()) {
            throw new RuntimeException("Alimento nao encontrado");
        }
        Refeicao refeicao = optRefeicao.get();
        Alimento alimento = optAlimento.get();

        if (refeicao.getQuantidadePorAlimento() != null) {
            refeicao.getQuantidadePorAlimento().remove(alimento);
        }
        return refeicaoRepository.save(refeicao);
    }

    public Map<String,Double> calcularTotaisNutricionais(long refeicaoId){
        Optional<Refeicao> optRefeicao = refeicaoRepository.findById(refeicaoId);
        if(optRefeicao.isEmpty()) {
            throw new RuntimeException("Refeicao nao encontrada");
        }
        Refeicao refeicao = optRefeicao.get();
        double totalCalorias = 0;
        double totalProteinas = 0;
        double totalCarboidratos = 0;
        double totalGorduras = 0;

        if(refeicao.getQuantidadePorAlimento() != null) {
            for(Map.Entry<Alimento,Double> entry: refeicao.getQuantidadePorAlimento().entrySet()) {
                Alimento alimento = entry.getKey();
                double quantidadePorAlimento = entry.getValue();
                totalCalorias += (alimento.getCalorias()/100) * quantidadePorAlimento;
                totalProteinas += (alimento.getProteinas()/100) * quantidadePorAlimento;
                totalCarboidratos += (alimento.getCarboidratos()/100) * quantidadePorAlimento;
                totalGorduras += (alimento.getGorduras()/100) * quantidadePorAlimento;
            }
        }

        Map<String,Double> resultado = new HashMap<>();
        resultado.put("totalCalorias", totalCalorias);
        resultado.put("totalProteinas", totalProteinas);
        resultado.put("totalCarboidratos", totalCarboidratos);
        resultado.put("totalGorduras", totalGorduras);
        return resultado;
    }

}
