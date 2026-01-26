import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ProductoNoEncontrado() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
            <div className="max-w-md text-center">
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 mx-auto flex items-center justify-center text-gray-500 mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-8 h-8">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                </div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Producto no encontrado</h1>
                <p className="text-gray-600 mb-8">
                    Lo sentimos, el producto que estás buscando no está disponible en este momento.
                </p>
                <Link href="/" passHref>
                    <Button className="bg-primary hover:bg-primary/90 text-white font-medium py-2 px-6 rounded-lg transition-colors">
                        Volver a la página principal
                    </Button>
                </Link>
                <div className="mt-4">
                    <Link href="/productos" className="text-primary hover:underline">
                        Ver todos los productos
                    </Link>
                </div>
            </div>
        </div>
    );
}