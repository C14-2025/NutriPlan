package br.inatel.nutriPlan.services;

import br.inatel.nutriPlan.dtos.NutrienteDto;
import br.inatel.nutriPlan.models.Nutriente;
import br.inatel.nutriPlan.models.Refeicao;
import org.springframework.stereotype.Service;

@Service
public class CalculoNutricionalService {
    public NutrienteDto calcularTotais(Refeicao refeicao) {
        NutrienteDto totais = new NutrienteDto();

        for (Nutriente n : refeicao.getNutrientes()) {
            totais.setCalorias(totais.getCalorias() + n.getCaloriasCalculadas());
            totais.setProteinas(totais.getProteinas() + n.getProteinasCalculadas());
            totais.setCarboidratos(totais.getCarboidratos() + n.getCarboidratosCalculadas());
            totais.setGorduras(totais.getGorduras() + n.getGordurasCalculadas());
        }

        return totais;
    }

}
