export interface IInsight {
  title: string;
  level: "great" | "warning" | "danger";
  href?: string;
}

export interface IInsights {
  category: string;
  insights: IInsight[];
}
