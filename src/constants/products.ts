import type {
  ProductDefinition,
  ProductType,
} from "@/types/product";

export const PRODUCT_COLORS = [
  {
    name: "Blanco",
    value: "#ffffff",
  },
  {
    name: "Negro",
    value: "#111111",
  },
  {
    name: "Morado",
    value: "#7b2eff",
  },
  {
    name: "Azul",
    value: "#00c2ff",
  },
  {
    name: "Magenta",
    value: "#ff2e88",
  },
] as const;

export const PRODUCTS: Record<ProductType, ProductDefinition> = {
  taza: {
    id: "taza",
    name: "Taza personalizada",
    shortName: "Taza",
    description:
      "Crea diseños envolventes para tazas de 11 Oz y visualízalos antes de realizar tu pedido.",
    printAreaDescription:
      "Área aproximada de sublimación: 21.5 cm × 9.5 cm",
    icon: "☕",
    available: true,
    colors: [...PRODUCT_COLORS],
  },

  franela: {
    id: "franela",
    name: "Franela personalizada",
    shortName: "Franela",
    description:
      "Sube imágenes, agrega textos y crea una franela personalizada con vista previa.",
    printAreaDescription:
      "Personalización frontal con área segura de impresión",
    icon: "👕",
    available: true,
    colors: [...PRODUCT_COLORS],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
  },
};

export const PRODUCT_LIST = Object.values(PRODUCTS);

export function isValidProductType(
  value: string,
): value is ProductType {
  return value in PRODUCTS;
}