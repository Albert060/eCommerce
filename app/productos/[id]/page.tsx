'use client'
import { useParams } from 'next/navigation'
import { useEffect, useState } from "react";
import { Product, ProductImage, ServerResponse } from "@/app/productos/page";
import Link from "next/link";

export default function ProductDetail(){
    const { id } = useParams<{ id: string }>()
    const [product, setProduct] = useState<Product>()
    const [selectedImage, setSelectedImage] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(()=>{
        const fetchProduct = async () => {
            try {
                const response = await fetch(`/api/productos/${id}`)
                const data = (await response.json()) as ServerResponse
                const fetchedProduct = data.message[0] as Product
                setProduct(fetchedProduct)

                // Set the first image as selected by default
                if (fetchedProduct.imagenes && fetchedProduct.imagenes.length > 0) {
                    setSelectedImage(fetchedProduct.imagenes[0].url)
                }
            } catch (error) {
                console.error('Error fetching product:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchProduct();
    }, [id])

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-neutral-primary-soft">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                    <p className="mt-4 text-lg text-gray-600">Cargando producto...</p>
                </div>
            </div>
        )
    }

    if (!product) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-neutral-primary-soft">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-800">Producto no encontrado</h2>
                    <p className="mt-2 text-gray-600">Lo sentimos, el producto que buscas no existe.</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-neutral-primary-soft py-8">
            <div className="container mx-auto px-4 max-w-6xl">
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    {/* Breadcrumb */}
                    <div className="px-6 py-4 border-b border-gray-200">
                        <nav className="flex" aria-label="Breadcrumb">
                            <ol className="inline-flex items-center space-x-1 md:space-x-3">
                                <li className="inline-flex items-center">
                                    <Link href="/" className="text-sm text-gray-700 hover:text-primary">Inicio</Link>
                                </li>
                                <li>
                                    <div className="flex items-center">
                                        <svg className="w-3 h-3 mx-1 text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
                                        </svg>
                                        <Link href="/productos" className="ml-1 text-sm text-gray-700 hover:text-primary md:ml-2">Productos</Link>
                                    </div>
                                </li>
                                <li aria-current="page">
                                    <div className="flex items-center">
                                        <svg className="w-3 h-3 mx-1 text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
                                        </svg>
                                        <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2 truncate max-w-xs">{product.nombre}</span>
                                    </div>
                                </li>
                            </ol>
                        </nav>
                    </div>

                    {/* Product Detail Content */}
                    <div className="p-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Product Images Section */}
                            <div>
                                {/* Main Image Display */}
                                <div className="bg-gray-100 rounded-lg overflow-hidden mb-4 aspect-square flex items-center justify-center">
                                    {selectedImage ? (
                                        <img
                                            src={selectedImage}
                                            alt={product.nombre}
                                            className="w-full h-full object-contain max-h-[500px]"
                                        />
                                    ) : (
                                        <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-64 flex items-center justify-center text-gray-500">
                                            Imagen no disponible
                                        </div>
                                    )}
                                </div>

                                {/* Thumbnails */}
                                {product.imagenes && product.imagenes.length > 0 && (
                                    <div className="grid grid-cols-4 gap-3">
                                        {product.imagenes.map((image: ProductImage, index: number) => (
                                            <div
                                                key={image.id_imagen}
                                                className={`cursor-pointer rounded-lg overflow-hidden border-2 ${selectedImage === image.url ? 'border-primary ring-2 ring-primary/30' : 'border-transparent'} transition-all duration-200`}
                                                onClick={() => setSelectedImage(image.url)}
                                            >
                                                <img
                                                    src={image.url}
                                                    alt={`${product.nombre} - Imagen ${index + 1}`}
                                                    className="w-full h-20 object-cover"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Product Info Section */}
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">{product.nombre}</h1>

                                <div className="mt-2">
                                    <span className="text-2xl font-bold text-primary">${product.precio_base}</span>
                                    <span className="text-gray-500 line-through ml-2">$19.99</span>
                                    <span className="ml-2 text-green-600 font-medium">(35% OFF)</span>
                                </div>

                                <div className="mt-4">
                                    <h3 className="text-lg font-semibold text-gray-900">Descripción</h3>
                                    <p className="mt-2 text-gray-600 leading-relaxed">
                                        {product.descripcion}
                                    </p>
                                </div>

                                <div className="mt-6 grid grid-cols-2 gap-4">
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-900">SKU</h3>
                                        <p className="mt-1 text-sm text-gray-500">{product.sku}</p>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-900">Disponibilidad</h3>
                                        <p className="mt-1 text-sm text-green-600">En stock</p>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-900">Peso</h3>
                                        <p className="mt-1 text-sm text-gray-500">{product.peso} kg</p>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-900">Volumen</h3>
                                        <p className="mt-1 text-sm text-gray-500">{product.volumen} L</p>
                                    </div>
                                </div>

                                <div className="mt-8 flex flex-wrap gap-4">
                                    <button className="flex-1 bg-primary text-white py-3 px-6 rounded-lg hover:bg-primary/90 transition-colors font-medium shadow-md">
                                        Añadir al carrito
                                    </button>
                                    <button className="flex-1 bg-white border border-primary text-primary py-3 px-6 rounded-lg hover:bg-primary/5 transition-colors font-medium">
                                        Comprar ahora
                                    </button>
                                </div>

                                <div className="mt-6 pt-6 border-t border-gray-200">
                                    <h3 className="text-lg font-semibold text-gray-900">Detalles del producto</h3>
                                    <ul className="mt-3 space-y-2">
                                        <li className="flex items-start">
                                            <svg className="h-5 w-5 text-green-500 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                            <span className="text-gray-600">Calidad premium garantizada</span>
                                        </li>
                                        <li className="flex items-start">
                                            <svg className="h-5 w-5 text-green-500 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                            <span className="text-gray-600">Envío gratis en pedidos superiores a $50</span>
                                        </li>
                                        <li className="flex items-start">
                                            <svg className="h-5 w-5 text-green-500 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                            <span className="text-gray-600">Devolución gratuita dentro de los 30 días</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}