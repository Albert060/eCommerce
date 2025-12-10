import Navbar from "@/components/landing/navbar";
import { HeroGeometric } from "@/components/landing/shape-landing-hero";
import { TestimonialsSection } from "@/components/landing/testimonials-with-marquee";
import Footer4Col from "@/components/landing/footer-column";
import { FeatureSteps } from "@/components/landing/feature-section";

const features = [
    {
        step: 'Step 1',
        title: 'Publica Tus Productos',
        content: 'Agrega tus productos de forma sencilla con descripciones detalladas, imágenes y precios.',
        image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?q=80&w=2070&auto=format&fit=crop'
    },
    {
        step: 'Step 2',
        title: 'Gestiona Inventario',
        content: 'Controla tus stocks en tiempo real, recibe alertas cuando se agotan productos y gestiona tu almacén de forma eficiente.',
        image: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?q=80&w=2070&auto=format&fit=crop'
    },
    {
        step: 'Step 3',
        title: 'Administra Ventas',
        content: 'Realiza un seguimiento completo de tus ventas, pedidos y clientes para maximizar tus resultados.',
        image: 'https://plus.unsplash.com/premium_photo-1661539176723-0d0043ac82f8?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    },
]
const testimonials = [
    {
        author: {
            name: "María González",
            handle: "@mariashopping",
            avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face"
        },
        text: "Encuentro ropa de calidad a precios increíbles. La plataforma hace que comprar en línea sea muy fácil y rápido.",
        href: "#"
    },
    {
        author: {
            name: "Carlos Ramírez",
            handle: "@carloshitech",
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
        },
        text: "Los productos electrónicos tienen garantía y el servicio al cliente es excelente. He realizado varias compras y siempre han sido perfectas.",
        href: "#"
    },
    {
        author: {
            name: "Laura Vásquez",
            handle: "@laurafashion",
            avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face"
        },
        text: "Los zapatos que compré son cómodos y duraderos. La entrega fue mucho más rápida de lo esperado."
    }
]

export default function Home() {
    return (
        <>
            <div className="relative w-full flex items-center justify-center">
                <Navbar className="top-2"/>
                <main className="w-full flex flex-col">
                    <HeroGeometric
                        badge="MarketPlace"
                        title1="Descubre"
                        title2="Productos Increíbles"/>
                    <FeatureSteps
                        features={features}
                        title="Ventas e Inventarios Simplificados"
                        autoPlayInterval={4000}
                        imageHeight="h-[500px]"
                    />
                    <TestimonialsSection
                        title="Confiado por miles de clientes"
                        description="Únete a nuestros clientes satisfechos que han encontrado todo tipo de productos de calidad"
                        testimonials={testimonials}
                    />
                    <Footer4Col />
                </main>

            </div>
        </>
    );
}

