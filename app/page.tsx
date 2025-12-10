import Navbar from "@/components/landing/navbar";
import { HeroGeometric } from "@/components/landing/shape-landing-hero";
import { TestimonialsSection } from "@/components/landing/testimonials-with-marquee";
import Footer4Col from "@/components/landing/footer-column";


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

