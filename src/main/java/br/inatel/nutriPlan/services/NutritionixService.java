package br.inatel.nutriPlan.services;

import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class NutritionixService {

  @Value("${nutritionix.api.url}")
  private String apiUrl;

  @Value("${nutritionix.app.id}")
  private String appId;

  @Value("${nutritionix.app.key}")
  private String appKey;

  private final RestTemplate restTemplate = new RestTemplate();

  public JsonNode buscarInformacoesAlimento(String nomeAlimento) {
    HttpHeaders headers = new HttpHeaders();
    headers.set("x-app-id", appId);
    headers.set("x-app-key", appKey);
    headers.set("Content-Type", "application/json");

    String body = String.format("{\"query\": \"%s\"}", nomeAlimento);
    HttpEntity<String> entity = new HttpEntity<>(body, headers);

    ResponseEntity<JsonNode> response =
        restTemplate.exchange(apiUrl, HttpMethod.POST, entity, JsonNode.class);

    return response.getBody();
  }
}
