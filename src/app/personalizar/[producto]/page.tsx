import { notFound } from "next/navigation";

import { isValidProductType } from "@/constants/products";

import PersonalizerEditor from "./PersonalizerEditor";

type PersonalizerPageProps = {
  params: Promise<{
    producto: string;
  }>;
};

export default async function PersonalizerPage({
  params,
}: PersonalizerPageProps) {
  const { producto } = await params;

  if (!isValidProductType(producto)) {
    notFound();
  }

  return (
    <PersonalizerEditor productType={producto} />
  );
}