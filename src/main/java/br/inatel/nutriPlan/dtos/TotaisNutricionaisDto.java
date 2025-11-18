package br.inatel.nutriPlan.dtos;

public class TotaisNutricionaisDto {
  private double calorias;
  private double proteinas;
  private double carboidratos;
  private double gorduras;

  public TotaisNutricionaisDto(
      double calorias, double proteinas, double carboidratos, double gorduras) {
    this.calorias = calorias;
    this.proteinas = proteinas;
    this.carboidratos = carboidratos;
    this.gorduras = gorduras;
  }

  public double getCalorias() {
    return calorias;
  }

  public void setCalorias(double calorias) {
    this.calorias = calorias;
  }

  public double getProteinas() {
    return proteinas;
  }

  public void setProteinas(double proteinas) {
    this.proteinas = proteinas;
  }

  public double getCarboidratos() {
    return carboidratos;
  }

  public void setCarboidratos(double carboidratos) {
    this.carboidratos = carboidratos;
  }

  public double getGorduras() {
    return gorduras;
  }

  public void setGorduras(double gorduras) {
    this.gorduras = gorduras;
  }
}
