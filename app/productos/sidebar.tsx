"use client";

import { useProductFilter } from '@/lib/product-context';

export default function Sidebar() {
  const {
    categories,
    selectedCategories,
    minPrice,
    maxPrice,
    sortBy,
    handleChildCategoryChange,
    handleParentCategoryChange,
    handlePriceChange,
    clearAllFilters,
    handleSortChange
  } = useProductFilter();

  return (
    <aside 
      id="top-bar-sidebar"
      className="w-64 flex-shrink-0 bg-neutral-primary-soft border-e border-default overflow-y-auto hidden sm:block"
      aria-label="Sidebar"
    >
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
                        className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary dark:focus:ring-primary dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
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
            <option value="relevance">Relevancia</option>
            <option value="price-asc">Precio: Menor a Mayor</option>
            <option value="price-desc">Precio: Mayor a Menor</option>
            <option value="discount">Mayor Descuento</option>
            <option value="novedad">Novedades</option>
          </select>
        </div>
      </div>
    </aside>
  );
}