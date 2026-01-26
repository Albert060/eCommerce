"use client"

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { useRouter } from 'next/navigation'

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

export default function TecnologiaPage() {
    const [categories, setCategories] = useState<CategoryParent[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<Set<number>>(new Set());
    const [minPrice, setMinPrice] = useState<number>(0);
    const [maxPrice, setMaxPrice] = useState<number>(1000);
    const [sortBy, setSortBy] = useState<string>('relevance');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [products, setProducts] = useState<Product[]>([]);
    const router = useRouter();

    useEffect(() => {
        const getCategories = async () => {
            const response = await fetch("/api/categorias");
            const data = (await response.json()) as ServerResponse;
            setCategories(data.message as CategoryParent[]);
        }

        // Initialize filters from URL parameters
        const urlParams = new URLSearchParams(window.location.search);

        // Initialize search query from URL
        const searchParam = urlParams.get('search') || '';
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setSearchQuery(searchParam);

        // Initialize categories from URL
        const categoriasParam = urlParams.get('categorias');
        if (categoriasParam) {
            const categoryIds = categoriasParam.split(',').map(id => parseInt(id));
            setSelectedCategories(new Set(categoryIds));
        } else {
            // Si no hay categorías en la URL, seleccionamos la categoría de tecnología
        }

        // Initialize price range from URL
        const minPriceParam = urlParams.get('precioMin');
        const maxPriceParam = urlParams.get('precioMax');
        if (minPriceParam) setMinPrice(parseInt(minPriceParam));
        if (maxPriceParam) setMaxPrice(parseInt(maxPriceParam));

        // Initialize sort from URL
        const sortParam = urlParams.get('orden');
        if (sortParam) setSortBy(sortParam);

        getCategories();

        const getProductos = async () => {
            const response = await fetch("/api/productos");
            const data = (await response.json()) as ServerResponse;
            setProducts(data.message as Product[]);
        }

        getProductos();
    }, []);

    // Aplicar filtro automático para mostrar solo productos de tecnología
    useEffect(() => {
        if (categories.length > 0 && products.length > 0) {
            // Buscar la categoría "Tecnología" entre las categorías disponibles
            const tecnologiaCategory = categories.find(cat => 
                cat.parent_nombre.toLowerCase() === 'tecnología' || 
                cat.children.some(child => child.nombre.toLowerCase() === 'tecnología')
            );

            if (tecnologiaCategory) {
                // Seleccionar automáticamente la categoría de tecnología
                const tecnologiaChildIds = tecnologiaCategory.children.map(child => child.id_categoria);
                const newSelectedCategories = new Set(tecnologiaChildIds);
                
                setSelectedCategories(newSelectedCategories);

                // Actualizar la URL para reflejar el filtro de tecnología
                const url = new URL(window.location.href);
                url.searchParams.delete('categorias');
                if (newSelectedCategories.size > 0) {
                    url.searchParams.set('categorias', Array.from(newSelectedCategories).join(','));
                }
                window.history.pushState({}, '', url);
            }
        }
    }, [categories, products]);

    // Apply filters when any filter value changes
    useEffect(() => {
        // eslint-disable-next-line react-hooks/immutability
        applyFilters();
    }, [selectedCategories, minPrice, maxPrice, sortBy, searchQuery, products]);

    const handleChildCategoryChange = (categoryId: number) => {
        const newSelectedCategories = new Set(selectedCategories);
        if (newSelectedCategories.has(categoryId)) {
            newSelectedCategories.delete(categoryId);
        } else {
            newSelectedCategories.add(categoryId);
        }
        setSelectedCategories(newSelectedCategories);

        // Update URL with selected categories
        const url = new URL(window.location.href);
        url.searchParams.delete('categorias');
        if (newSelectedCategories.size > 0) {
            url.searchParams.set('categorias', Array.from(newSelectedCategories).join(','));
        }
        window.history.pushState({}, '', url);
    };

    const handleParentCategoryChange = (category: CategoryParent) => {
        const newSelectedCategories = new Set(selectedCategories);
        const allChildrenSelected = category.children.every(child => newSelectedCategories.has(child.id_categoria));

        if (allChildrenSelected) {
            // Deselect all children of this parent
            category.children.forEach(child => {
                newSelectedCategories.delete(child.id_categoria);
            });
        } else {
            // Select all children of this parent
            category.children.forEach(child => {
                newSelectedCategories.add(child.id_categoria);
            });
        }

        setSelectedCategories(newSelectedCategories);

        // Update URL with selected categories
        const url = new URL(window.location.href);
        url.searchParams.delete('categorias');
        if (newSelectedCategories.size > 0) {
            url.searchParams.set('categorias', Array.from(newSelectedCategories).join(','));
        }
        window.history.pushState({}, '', url);
    };

    const handlePriceChange = (value: number, type: 'min' | 'max') => {
        if (type === 'min') {
            const newMin = Math.min(value, maxPrice);
            setMinPrice(newMin);
            if (newMin > maxPrice) {
                setMaxPrice(newMin);
            }
        } else {
            const newMax = Math.max(value, minPrice);
            setMaxPrice(newMax);
            if (newMax < minPrice) {
                setMinPrice(newMax);
            }
        }

        // Update URL with price range
        const url = new URL(window.location.href);
        url.searchParams.delete('precioMin');
        url.searchParams.delete('precioMax');
        if (minPrice > 0) {
            url.searchParams.set('precioMin', minPrice.toString());
        }
        if (maxPrice < 1000) {
            url.searchParams.set('precioMax', maxPrice.toString());
        }
        window.history.pushState({}, '', url);
    };

    const clearAllFilters = () => {
        // Reset all filters
        // Mantener la categoría de tecnología seleccionada
        const tecnologiaCategory = categories.find(cat => 
            cat.parent_nombre.toLowerCase() === 'tecnología' || 
            cat.children.some(child => child.nombre.toLowerCase() === 'tecnología')
        );

        if (tecnologiaCategory) {
            const tecnologiaChildIds = tecnologiaCategory.children.map(child => child.id_categoria);
            setSelectedCategories(new Set(tecnologiaChildIds));
        } else {
            setSelectedCategories(new Set());
        }
        
        setMinPrice(0);
        setMaxPrice(1000);
        setSortBy('relevance');
        setSearchQuery('');

        // Update URL by removing all filter parameters except categories
        const url = new URL(window.location.href);
        url.searchParams.delete('precioMin');
        url.searchParams.delete('precioMax');
        url.searchParams.delete('orden');
        url.searchParams.delete('search');
        window.history.pushState({}, '', url);
    };

    const handleSortChange = (sortValue: string) => {
        setSortBy(sortValue);

        // Update URL with sort option
        const url = new URL(window.location.href);
        url.searchParams.delete('orden');
        if (sortValue !== 'relevance') {
            url.searchParams.set('orden', sortValue);
        }
        window.history.pushState({}, '', url);
    };

    const handleSearchChange = (value: string) => {
        setSearchQuery(value);

        // Update URL with search query
        const url = new URL(window.location.href);
        url.searchParams.delete('search');
        if (value.trim() !== '') {
            url.searchParams.set('search', value.trim());
        }
        window.history.pushState({}, '', url);
    };

    // Function to apply all filters to the products
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

    const applyFilters = () => {
        let result = [...products];

        // Apply category filter
        if (selectedCategories.size > 0) {
            result = result.filter(product => {
                // Assuming product.id_categoria can be converted to number for comparison
                const productCategoryId = parseInt(product.id_categoria);
                return selectedCategories.has(productCategoryId);
            });
        }

        // Apply price filter
        result = result.filter(product => {
            const price = parseFloat(product.precio_base);
            return price >= minPrice && price <= maxPrice;
        });

        // Apply search query filter
        if (searchQuery.trim() !== '') {
            const query = searchQuery.toLowerCase().trim();
            result = result.filter(product =>
                product.nombre.toLowerCase().includes(query) ||
                product.descripcion.toLowerCase().includes(query)
            );
        }

        // Apply sorting
        result.sort((a, b) => {
            switch (sortBy) {
                case 'price-asc':
                    return parseFloat(a.precio_base) - parseFloat(b.precio_base);
                case 'price-desc':
                    return parseFloat(b.precio_base) - parseFloat(a.precio_base);
                default:
                    return 0; // relevance sorting would go here if implemented
            }
        });

        setFilteredProducts(result);
    };

    return (
        <main className="min-h-screen flex flex-col">
            <nav className="top-0 z-50 w-full bg-neutral-primary-soft border-b border-default">
                <div className="px-3 py-3 lg:px-5 lg:pl-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center justify-start rtl:justify-end">
                        </div>
                        <div className="flex flex-1">
                            <div className="flex items-center ms-3">
                                <div>
                                    <Input
                                        placeholder="Buscar productos de tecnología..."
                                        value={searchQuery}
                                        onChange={(e) => handleSearchChange(e.target.value)}
                                    />
                                    <button type="button"
                                            className="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
                                            aria-expanded="false" data-dropdown-toggle="dropdown-user">
                                        <span className="sr-only">Open user menu</span>

                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="flex flex-1">
                <aside id="top-bar-sidebar"
                       className="w-64 flex-shrink-0 bg-neutral-primary-soft border-e border-default overflow-y-auto hidden sm:block"
                       aria-label="Sidebar">
                    <div className="h-full px-3 py-4 overflow-y-auto bg-neutral-primary-soft border-e border-default">
                        <div className="mb-4">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Filtros</h3>
                            <button
                                type="button"
                                onClick={clearAllFilters}
                                className="text-xs text-primary hover:underline"
                            >
                                Limpiar filtros
                            </button>
                        </div>

                        {/* Price Filter */}
                        <div className="mb-4">
                            <h4 className="text-md font-medium text-gray-900 dark:text-white mb-2">Precio</h4>
                            <div className="px-2">
                                <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
                                    <span>${minPrice}</span>
                                    <span>${maxPrice}</span>
                                </div>
                                <div className="space-y-2">
                                    <div>
                                        <label
                                            className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Mínimo</label>
                                        <input
                                            type="range"
                                            min="0"
                                            max="1000"
                                            value={minPrice}
                                            onChange={(e) => handlePriceChange(Number(e.target.value), 'min')}
                                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                                        />
                                    </div>
                                    <div>
                                        <label
                                            className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Máximo</label>
                                        <input
                                            type="range"
                                            min="0"
                                            max="1000"
                                            value={maxPrice}
                                            onChange={(e) => handlePriceChange(Number(e.target.value), 'max')}
                                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-between mt-2">
                                    <input
                                        type="number"
                                        value={minPrice}
                                        onChange={(e) => handlePriceChange(Number(e.target.value), 'min')}
                                        className="w-[45%] p-1 text-xs border border-gray-300 rounded"
                                        min="0"
                                    />
                                    <input
                                        type="number"
                                        value={maxPrice}
                                        onChange={(e) => handlePriceChange(Number(e.target.value), 'max')}
                                        className="w-[45%] p-1 text-xs border border-gray-300 rounded"
                                        min="0"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Categories */}
                        <div className="mb-4">
                            <h4 className="text-md font-medium text-gray-900 dark:text-white mb-2">Categorías</h4>
                            <ul className="space-y-2 font-medium">
                                {categories.map((category) => (
                                    <li key={category.parent_id}>
                                        <div className="flex items-center mb-2">
                                            <input
                                                type="checkbox"
                                                id={`parent-${category.parent_id}`}
                                                className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary dark:focus:ring-primary dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                                checked={category.children.some(child => selectedCategories.has(child.id_categoria))}
                                                onChange={() => handleParentCategoryChange(category)}
                                                disabled={category.parent_nombre.toLowerCase() === 'tecnología'} // Deshabilitar la casilla de tecnología
                                            />
                                            <label
                                                htmlFor={`parent-${category.parent_id}`}
                                                className={`ms-2 text-sm font-medium ${category.parent_nombre.toLowerCase() === 'tecnología' ? 'text-primary font-bold' : 'text-gray-900 dark:text-gray-300'}`}
                                            >
                                                {category.parent_nombre}
                                            </label>
                                        </div>
                                        <ul className="ps-6 space-y-1">
                                            {category.children.map((child) => (
                                                <li key={child.id_categoria} className="flex items-center">
                                                    <input
                                                        type="checkbox"
                                                        id={`child-${child.id_categoria}`}
                                                        className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary dark:focus:ring-primary dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                                        checked={selectedCategories.has(child.id_categoria)}
                                                        onChange={() => handleChildCategoryChange(child.id_categoria)}
                                                        disabled={category.parent_nombre.toLowerCase() === 'tecnología'} // Deshabilitar las subcategorías de tecnología
                                                    />
                                                    <label
                                                        htmlFor={`child-${child.id_categoria}`}
                                                        className={`ms-2 text-sm font-medium ${category.parent_nombre.toLowerCase() === 'tecnología' ? 'text-primary font-bold' : 'text-gray-900 dark:text-gray-300'}`}
                                                    >
                                                        {child.nombre}
                                                    </label>
                                                </li>
                                            ))}
                                        </ul>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Sorting Options */}
                        <div className="mb-4">
                            <h4 className="text-md font-medium text-gray-900 dark:text-white mb-2">Ordenar por</h4>
                            <select
                                value={sortBy}
                                onChange={(e) => handleSortChange(e.target.value)}
                                className="w-full p-2 text-sm border border-gray-300 rounded bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            >
                                <option value="price-asc">Precio: Menor a Mayor</option>
                                <option value="price-desc">Precio: Mayor a Menor</option>
                            </select>
                        </div>
                    </div>
                </aside>

                {/* Products Section - next to the filters */}
                <div className="flex-1 p-4 overflow-auto">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {filteredProducts.length > 0 ? (
                            filteredProducts.map((product) => (
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
                                <p className="text-gray-500">No se encontraron productos de tecnología</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    )
}