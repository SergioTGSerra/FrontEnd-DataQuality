interface IProductionActivityMetric {
    productionActivityid: string;
    metricid: string;
    min: number;
    max: number;
    mean: number;
    k: number;
    minDegValid: number;
    minDegSuspect: number;
    validationFormula: string;
  }
  
  export type { IProductionActivityMetric };