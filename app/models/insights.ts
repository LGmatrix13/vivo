export interface IInsight {
  title: string;
  level: "great" | "warning" | "danger";
  action?: {
    href: string;
    title: string;
  };
}

export interface IInsights {
  category: string;
  insights: IInsight[];
}
