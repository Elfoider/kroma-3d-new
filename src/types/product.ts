export type ProductType = "taza" | "franela";

export type ProductColor = {
  name: string;
  value: string;
};

export type ProductDefinition = {
  id: ProductType;
  name: string;
  shortName: string;
  description: string;
  printAreaDescription: string;
  icon: string;
  available: boolean;
  colors: ProductColor[];
  sizes?: string[];
};