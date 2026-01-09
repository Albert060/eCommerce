"use client"

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";

export interface ServerResponse {
    message: CategoryParent[]
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

export default function ProductosPage() {
    const [categories, setCategories] = useState<CategoryParent[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<Set<number>>(new Set());
    const [minPrice, setMinPrice] = useState<number>(0);
    const [maxPrice, setMaxPrice] = useState<number>(1000);
    const [sortBy, setSortBy] = useState<string>('relevance');

    useEffect(() => {
        const getCategories = async () => {
            const response = await fetch("/api/categorias");
            const data = (await response.json()) as ServerResponse;
            setCategories(data.message);
        }

        getCategories();
    }, []);

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
        setSelectedCategories(new Set());
        setMinPrice(0);
        setMaxPrice(1000);
        setSortBy('relevance');

        // Update URL by removing all filter parameters
        const url = new URL(window.location.href);
        url.searchParams.delete('categorias');
        url.searchParams.delete('precioMin');
        url.searchParams.delete('precioMax');
        url.searchParams.delete('orden');
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

    return (
        <main>
            <nav className=" top-0 z-50 w-full bg-neutral-primary-soft border-b border-default">
                <div className="px-3 py-3 lg:px-5 lg:pl-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center justify-start rtl:justify-end">
                        </div>
                        <div className="flex items-center">
                            <div className="flex items-center ms-3">
                                <div>
                                    <Input></Input>
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

            <aside id="top-bar-sidebar"
                   className=" top-0 left-0 z-40 w-64 h-full transition-transform -translate-x-full sm:translate-x-0"
                   aria-label="Sidebar">
                <div className="h-full px-3 py-4 overflow-y-auto bg-neutral-primary-soft border-e border-default">
                    <div className="mb-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Filtros</h3>
                        <button
                            type="button"
                            onClick={clearAllFilters}
                            className="text-xs text-blue-600 hover:underline"
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
                                    <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Mínimo</label>
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
                                    <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Máximo</label>
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
                                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                            checked={category.children.some(child => selectedCategories.has(child.id_categoria))}
                                            onChange={() => handleParentCategoryChange(category)}
                                        />
                                        <label
                                            htmlFor={`parent-${category.parent_id}`}
                                            className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
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
                                                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                                    checked={selectedCategories.has(child.id_categoria)}
                                                    onChange={() => handleChildCategoryChange(child.id_categoria)}
                                                />
                                                <label
                                                    htmlFor={`child-${child.id_categoria}`}
                                                    className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
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
        </main>
    )
}