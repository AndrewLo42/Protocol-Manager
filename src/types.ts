export interface Department {
  id: number;
  name: string;
  connections: number[];
}

export interface Protocol {
  id: number;
  title: string;
  summary: string;
  steps: string[];
  departmentId: number;
  tags: string[];
}
