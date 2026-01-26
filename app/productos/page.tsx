"use client"

import { useRouter } from 'next/navigation'
import { useProductFilter } from '@/lib/product-context';

export interface ServerResponse {
    message: CategoryParent[] | Product[]
}

export interface CategoryParent {
    parent_id: string
    parent_nombre: string
    children: CategoryChildren[]
}

export interface CategoryChildren {
    id_categoria: number
    nombre: string
}

export interface ProductImage {
    id_imagen: number
    id_producto: number
    url: string
    orden: number
}

export interface Product {
    id_producto: string
    nombre: string
    descripcion: string
    sku: string
    id_categoria: string
    precio_base: string
    peso: string
    volumen: string
    activo: boolean
    imagenes: ProductImage[]
}

export default function ProductosPage() {
    const {
        paginatedProducts,
        currentPage,
        totalPages,
        goToPreviousPage,
        goToNextPage,
        goToPage
    } = useProductFilter();
    const router = useRouter();

    return (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {paginatedProducts.length > 0 ? (
                    paginatedProducts.map((product) => (
                        <div key={product.id_producto} className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                            {product.imagenes && product.imagenes.length > 0 ? (
                                <img
                                    src={product.imagenes[0].url}
                                    alt={product.nombre}
                                    className="w-full h-40 object-cover rounded-xl"
                                />
                            ) : (
                                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-40 flex items-center justify-center text-gray-500">
                                    Imagen
                                </div>
                            )}
                            <h3 className="font-semibold text-lg">{product.nombre}</h3>
                            <p className="text-gray-600 text-sm mt-1 line-clamp-2">{product.descripcion}</p>
                            <p className="font-bold text-lg mt-2">${product.precio_base}</p>
                            <button className="mt-3 w-full bg-primary text-white py-2 rounded hover:bg-primary/90 transition-colors" onClick={() => router.push(`/productos/${product.id_producto}`) }>
                                Ver producto
                            </button>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full text-center py-10">
                        <p className="text-gray-500">No se encontraron productos</p>
                    </div>
                )}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center mt-8 space-x-2">
                    <button
                        onClick={goToPreviousPage}
                        disabled={currentPage === 1}
                        className={`px-4 py-2 rounded-md ${
                            currentPage === 1
                                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                : 'bg-primary text-white hover:bg-primary/90'
                        }`}
                    >
                        Anterior
                    </button>

                    {/* Page numbers */}
                    {[...Array(totalPages)].map((_, index) => {
                        const pageNumber = index + 1;
                        const isFirstPage = pageNumber === 1;
                        const isLastPage = pageNumber === totalPages;
                        const isCurrentPage = pageNumber === currentPage;

                        // Show first page, last page, current page and adjacent pages
                        if (
                            isFirstPage ||
                            isLastPage ||
                            (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                        ) {
                            return (
                                <button
                                    key={index}
                                    onClick={() => goToPage(pageNumber)}
                                    className={`px-4 py-2 rounded-md ${
                                        isCurrentPage
                                            ? 'bg-primary text-white'
                                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                    }`}
                                >
                                    {pageNumber}
                                </button>
                            );
                        } else if (
                            pageNumber === currentPage - 2 ||
                            pageNumber === currentPage + 2
                        ) {
                            // Show ellipsis for skipped pages
                            return (
                                <span key={index} className="px-2">...</span>
                            );
                        }
                        return null;
                    })}

                    <button
                        onClick={goToNextPage}
                        disabled={currentPage === totalPages}
                        className={`px-4 py-2 rounded-md ${
                            currentPage === totalPages
                                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                : 'bg-primary text-white hover:bg-primary/90'
                        }`}
                    >
                        Siguiente
                    </button>
                </div>
            )}
        </>
    )
}