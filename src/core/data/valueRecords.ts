interface IValueRecord {
  id: string;
  metricId: string;
  productionActivityId: string;
  organizationId: string;
  datetime: any;
  validityDegree: number;
  lotReference: string;
  validityCategory: string;
}

export type { IValueRecord };