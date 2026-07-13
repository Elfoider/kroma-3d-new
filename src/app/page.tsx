import Image from "next/image";
import Link from "next/link";

import { PRODUCT_LIST } from "@/constants/products";

export default function HomePage() {
  return (
    <main className="home-page">
      <div
        className="background-effects"
        aria-hidden="true"
      >
        <div className="glow glow-purple" />
        <div className="glow glow-blue" />
        <div className="grid-background" />
      </div>

      <header className="navbar">
        <Link href="/" className="brand">
          <Image
            src="/logo-kroma-3d.png"
            alt="Logo de KROMA 3D"
            width={58}
            height={58}
            priority
            className="brand-logo"
          />

          <div className="brand-text">
            <span className="brand-name">KROMA 3D</span>

            <span className="brand-subtitle">
              Personalización visual
            </span>
          </div>
        </Link>

        <nav
          className="navigation"
          aria-label="Navegación principal"
        >
          <Link href="#productos">Productos</Link>

          <Link href="#como-funciona">
            Cómo funciona
          </Link>

          <button
            type="button"
            className="login-button"
          >
            Administrador
          </button>
        </nav>
      </header>

      <section className="hero">
        <div className="hero-content">
          <div className="hero-badge">
            <span className="badge-dot" />

            Plataforma de personalización 3D
          </div>

          <h1>
            Convierte tus ideas en
            <span> productos únicos.</span>
          </h1>

          <p className="hero-description">
            Personaliza tazas y franelas, agrega imágenes
            y textos, y visualiza el resultado antes de
            realizar tu pedido.
          </p>

          <div className="hero-actions">
            <Link
              href="#productos"
              className="primary-button"
            >
              Comenzar a diseñar
              <span aria-hidden="true">→</span>
            </Link>

            <Link
              href="#como-funciona"
              className="secondary-button"
            >
              Ver cómo funciona
            </Link>
          </div>

          <div className="hero-features">
            <div>
              <span>✓</span>
              Diseño en tiempo real
            </div>

            <div>
              <span>✓</span>
              Vista previa 3D
            </div>

            <div>
              <span>✓</span>
              Pedido sencillo
            </div>
          </div>
        </div>

        <div className="hero-visual">
          <div className="visual-orbit orbit-one" />
          <div className="visual-orbit orbit-two" />

          <div className="visual-card">
            <div className="visual-card-header">
              <span>Vista previa</span>

              <div className="window-controls">
                <span />
                <span />
                <span />
              </div>
            </div>

            <div className="product-preview">
              <div className="preview-glow" />

              <div className="mockup-cup">
                <div className="cup-design">
                  <Image
                    src="/logo-kroma-3d.png"
                    alt=""
                    width={105}
                    height={105}
                  />
                </div>

                <div className="cup-handle" />
              </div>

              <div className="preview-shadow" />
            </div>

            <div className="editor-toolbar">
              <button
                type="button"
                aria-label="Agregar imagen"
              >
                ▧
              </button>

              <button
                type="button"
                aria-label="Agregar texto"
              >
                T
              </button>

              <button
                type="button"
                aria-label="Rotar elemento"
              >
                ↻
              </button>

              <button
                type="button"
                aria-label="Cambiar color"
              >
                ◉
              </button>
            </div>
          </div>
        </div>
      </section>

      <section
        id="productos"
        className="products-section"
      >
        <div className="section-heading">
          <span>NUESTROS PRODUCTOS</span>

          <h2>¿Qué deseas personalizar?</h2>

          <p>
            Selecciona un producto para comenzar a crear
            tu diseño.
          </p>
        </div>

        <div className="products-grid">
          {PRODUCT_LIST.map((product) => (
            <article
              className="product-card"
              key={product.id}
            >
              <div className="product-icon">
                {product.icon}
              </div>

              <div className="product-information">
                <span className="available-label">
                  {product.available
                    ? "Disponible"
                    : "Próximamente"}
                </span>

                <h3>{product.name}</h3>

                <p>{product.description}</p>
              </div>

              {product.available ? (
                <Link
                  href={`/personalizar/${product.id}`}
                  className="product-link"
                >
                  Personalizar
                  <span aria-hidden="true">→</span>
                </Link>
              ) : (
                <span className="product-link">
                  Próximamente
                </span>
              )}
            </article>
          ))}
        </div>
      </section>

      <section
        id="como-funciona"
        className="steps-section"
      >
        <div className="section-heading">
          <span>PROCESO SENCILLO</span>

          <h2>Crea tu producto en pocos pasos</h2>
        </div>

        <div className="steps-grid">
          <article className="step-card">
            <span className="step-number">01</span>

            <h3>Selecciona</h3>

            <p>
              Elige la taza o franela que deseas
              personalizar.
            </p>
          </article>

          <article className="step-card">
            <span className="step-number">02</span>

            <h3>Diseña</h3>

            <p>
              Sube imágenes, agrega textos y organiza tu
              composición.
            </p>
          </article>

          <article className="step-card">
            <span className="step-number">03</span>

            <h3>Visualiza</h3>

            <p>
              Observa una vista previa del producto
              personalizado.
            </p>
          </article>

          <article className="step-card">
            <span className="step-number">04</span>

            <h3>Confirma</h3>

            <p>
              Completa tus datos y envía el pedido desde
              la plataforma.
            </p>
          </article>
        </div>
      </section>

      <footer className="footer">
        <div className="footer-brand">
          <Image
            src="/logo-kroma-3d.png"
            alt="KROMA 3D"
            width={42}
            height={42}
          />

          <div>
            <strong>KROMA 3D</strong>
            <span>Tu idea, llevada a la realidad.</span>
          </div>
        </div>

        <p>
          © 2026 KROMA 3D. Todos los derechos reservados.
        </p>
      </footer>
    </main>
  );
}