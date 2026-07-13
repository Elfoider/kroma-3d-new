import { notFound } from "next/navigation";
import PersonalizerEditor from "./PersonalizerEditor";

type PersonalizerPageProps = {
  params: Promise<{
    producto: string;
  }>;
};

const validProducts = ["taza", "franela"];

export default async function PersonalizerPage({
  params,
}: PersonalizerPageProps) {
  const { producto } = await params;

  if (!validProducts.includes(producto)) {
    notFound();
  }

  return <PersonalizerEditor productType={producto as "taza" | "franela"} />;
}