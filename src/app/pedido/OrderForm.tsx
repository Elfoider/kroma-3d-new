"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import styles from "./order.module.css";

type SavedDesign = {
  productType: "taza" | "franela";
  productName: string;
  productColor: string;
  customText: string;
  textColor: string;
  previewImage: string;
  createdAt: string;
};

type OrderFormData = {
  customerName: string;
  phone: string;
  email: string;
  quantity: number;
  size: string;
  notes: string;
};

const initialFormData: OrderFormData = {
  customerName: "",
  phone: "",
  email: "",
  quantity: 1,
  size: "M",
  notes: "",
};

export default function OrderForm() {
  const [design, setDesign] = useState<SavedDesign | null>(null);
  const [formData, setFormData] = useState<OrderFormData>(initialFormData);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdOrderId, setCreatedOrderId] = useState<string | null>(null);

  useEffect(() => {
    const savedDesign = sessionStorage.getItem("kroma3d-current-design");

    if (savedDesign) {
      try {
        setDesign(JSON.parse(savedDesign) as SavedDesign);
      } catch (error) {
        console.error("No se pudo leer el diseño:", error);
      }
    }

    setIsLoading(false);
  }, []);

  function updateField<K extends keyof OrderFormData>(
    field: K,
    value: OrderFormData[K],
  ) {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function submitOrder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!design) {
      alert("No existe un diseño para enviar.");
      return;
    }

    if (!formData.customerName.trim() || !formData.phone.trim()) {
      alert("Completa tu nombre y teléfono.");
      return;
    }

    try {
      setIsSubmitting(true);

      const orderData = {
        customer: {
          name: formData.customerName.trim(),
          phone: formData.phone.trim(),
          email: formData.email.trim(),
        },

        product: {
          type: design.productType,
          name: design.productName,
          color: design.productColor,
          quantity: formData.quantity,
          size: design.productType === "franela" ? formData.size : null,
        },

        design: {
          customText: design.customText,
          textColor: design.textColor,

          // Temporalmente no guardaremos la imagen en Firestore.
          // La subiremos a Storage en el siguiente paso.
          previewImage: "",
        },

        notes: formData.notes.trim(),
        status: "pendiente",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      const documentReference = await addDoc(
        collection(db, "orders"),
        orderData,
      );

      console.log("Pedido guardado correctamente:", documentReference.id);

      setCreatedOrderId(documentReference.id);

      sessionStorage.setItem("kroma3d-last-order-id", documentReference.id);

      sessionStorage.removeItem("kroma3d-current-design");
    } catch (error) {
      console.error("Error completo al guardar el pedido:", error);

      alert(
        "No se pudo guardar el pedido. Abre la consola del navegador para revisar el error.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <main className={styles.messagePage}>
        <p>Cargando diseño...</p>
      </main>
    );
  }

  if (createdOrderId) {
    return (
      <main className={styles.successPage}>
        <div className={styles.successCard}>
          <Image
            src="/logo-kroma-3d.png"
            alt="KROMA 3D"
            width={90}
            height={90}
          />

          <div className={styles.successIcon}>✓</div>

          <span>PEDIDO REGISTRADO</span>

          <h1>¡Recibimos tu solicitud!</h1>

          <p>
            Tu diseño fue guardado correctamente. Nos pondremos en contacto
            contigo para revisar los detalles y confirmar la producción.
          </p>

          <div className={styles.orderCode}>
            <span>Código del pedido</span>
            <strong>{createdOrderId}</strong>
          </div>

          <Link href="/" className={styles.primaryLink}>
            Volver al inicio
          </Link>
        </div>
      </main>
    );
  }

  if (!design) {
    return (
      <main className={styles.messagePage}>
        <Image src="/logo-kroma-3d.png" alt="KROMA 3D" width={90} height={90} />

        <h1>No encontramos un diseño</h1>

        <p>Primero debes personalizar una taza o una franela.</p>

        <Link href="/#productos" className={styles.primaryLink}>
          Seleccionar producto
        </Link>
      </main>
    );
  }
  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <Link href="/" className={styles.brand}>
          <Image
            src="/logo-kroma-3d.png"
            alt="KROMA 3D"
            width={48}
            height={48}
          />

          <div>
            <strong>KROMA 3D</strong>
            <span>Confirmación del pedido</span>
          </div>
        </Link>

        <Link
          href={`/personalizar/${design.productType}`}
          className={styles.backButton}
        >
          ← Editar diseño
        </Link>
      </header>

      <section className={styles.content}>
        <div className={styles.previewColumn}>
          <div className={styles.sectionHeading}>
            <span>VISTA PREVIA</span>
            <h1>Tu producto personalizado</h1>
            <p>Verifica el diseño antes de enviar el pedido.</p>
          </div>

          <div className={styles.previewCard}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={design.previewImage}
              alt={`Vista previa de ${design.productName}`}
              className={styles.previewImage}
            />
          </div>

          <div className={styles.productSummary}>
            <div>
              <span>Producto</span>
              <strong>{design.productName}</strong>
            </div>

            <div>
              <span>Texto</span>
              <strong>{design.customText || "Sin texto"}</strong>
            </div>

            <div>
              <span>Color</span>

              <div className={styles.colorSummary}>
                <span
                  style={{
                    backgroundColor: design.productColor,
                  }}
                />
                <strong>{design.productColor.toUpperCase()}</strong>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.formColumn}>
          <div className={styles.formHeading}>
            <span>DATOS DEL CLIENTE</span>
            <h2>Completa tu pedido</h2>
            <p>
              Introduce la información necesaria para procesar la solicitud.
            </p>
          </div>

          <form className={styles.form} onSubmit={submitOrder}>
            <label>
              Nombre completo
              <input
                type="text"
                value={formData.customerName}
                onChange={(event) =>
                  updateField("customerName", event.target.value)
                }
                placeholder="Ejemplo: Juan Pérez"
                required
              />
            </label>

            <label>
              Teléfono o WhatsApp
              <input
                type="tel"
                value={formData.phone}
                onChange={(event) => updateField("phone", event.target.value)}
                placeholder="+58 412 0000000"
                required
              />
            </label>

            <label>
              Correo electrónico
              <input
                type="email"
                value={formData.email}
                onChange={(event) => updateField("email", event.target.value)}
                placeholder="cliente@correo.com"
              />
            </label>

            <div className={styles.formRow}>
              <label>
                Cantidad
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={formData.quantity}
                  onChange={(event) =>
                    updateField(
                      "quantity",
                      Math.max(1, Number(event.target.value)),
                    )
                  }
                />
              </label>

              {design.productType === "franela" && (
                <label>
                  Talla
                  <select
                    value={formData.size}
                    onChange={(event) =>
                      updateField("size", event.target.value)
                    }
                  >
                    <option value="XS">XS</option>
                    <option value="S">S</option>
                    <option value="M">M</option>
                    <option value="L">L</option>
                    <option value="XL">XL</option>
                    <option value="XXL">XXL</option>
                  </select>
                </label>
              )}
            </div>

            <label>
              Observaciones
              <textarea
                value={formData.notes}
                onChange={(event) => updateField("notes", event.target.value)}
                placeholder="Agrega instrucciones especiales..."
                rows={5}
                maxLength={500}
              />
            </label>

            <div className={styles.notice}>
              <span>i</span>

              <p>
                El pedido todavía no se enviará a producción. Primero será
                revisado y confirmado.
              </p>
            </div>

            <button
              type="submit"
              className={styles.submitButton}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                "Guardando pedido..."
              ) : (
                <>
                  Enviar solicitud
                  <span>→</span>
                </>
              )}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
