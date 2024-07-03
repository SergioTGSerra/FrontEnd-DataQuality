interface IValueRecord {
  id: string;
  metricId: string;
  productionActivityId: string;
  organizationId: string;
  datetime: any;
  validityDegree: number;
  validityCategory: string;
  lotId: string;
  value: number;
}

export type { IValueRecord };