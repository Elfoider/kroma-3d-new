import {
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/services/firebase/client";
import type { CreateOrderInput } from "@/types/order";

export async function createOrder(
  input: CreateOrderInput,
): Promise<string> {
  const documentReference = await addDoc(
    collection(db, "orders"),
    {
      ...input,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    },
  );

  return documentReference.id;
}