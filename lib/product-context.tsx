"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define types
export interface CategoryParent {
  parent_id: string;
  parent_nombre: string;
  children: CategoryChildren[];
}

export interface CategoryChildren {
  id_categoria: number;
  nombre: string;
}

export interface ProductImage {
  id_imagen: number;
  id_producto: number;
  url: string;
  orden: number;
}

export interface Product {
  id_producto: string;
  nombre: string;
  descripcion: string;
  sku: string;
  id_categoria: string;
  precio_base: string;
  peso: string;
  volumen: string;
  activo: boolean;
  imagenes: ProductImage[];
}

interface ProductFilterContextType {
  categories: CategoryParent[];
  selectedCategories: Set<number>;
  minPrice: number;
  maxPrice: number;
  sortBy: string;
  searchQuery: string;
  products: Product[];
  filteredProducts: Product[];
  currentPage: number;
  totalPages: number;
  productsPerPage: number;
  paginatedProducts: Product[];
  setCurrentPage: (page: number) => void;
  setProductsPerPage: (perPage: number) => void;
  setSelectedCategories: (categories: Set<number>) => void;
  setMinPrice: (price: number) => void;
  setMaxPrice: (price: number) => void;
  setSortBy: (sort: string) => void;
  setSearchQuery: (query: string) => void;
  setProducts: (products: Product[]) => void;
  handleChildCategoryChange: (categoryId: number) => void;
  handleParentCategoryChange: (category: CategoryParent) => void;
  handlePriceChange: (value: number, type: 'min' | 'max') => void;
  clearAllFilters: () => void;
  handleSortChange: (sortValue: string) => void;
  handleSearchChange: (value: string) => void;
  goToPreviousPage: () => void;
  goToNextPage: () => void;
  goToPage: (page: number) => void;
}

const ProductFilterContext = createContext<ProductFilterContextType | undefined>(undefined);

export function ProductFilterProvider({ children }: { children: ReactNode }) {
  const [categories, setCategories] = useState<CategoryParent[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<Set<number>>(new Set());
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(1000);
  const [sortBy, setSortBy] = useState<string>('relevance');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [productsPerPage, setProductsPerPage] = useState<number>(8); // Show 8 products per page

  // Load initial data and filters from URL
  useEffect(() => {
    const initializeFilters = async () => {
      // Fetch categories
      const categoriesResponse = await fetch("/api/categorias");
      const categoriesData = await categoriesResponse.json();
      setCategories(categoriesData.message as CategoryParent[]);

      // Fetch products
      const productsResponse = await fetch("/api/productos");
      const productsData = await productsResponse.json();
      setProducts(productsData.message as Product[]);

      // Initialize filters from URL parameters
      const urlParams = new URLSearchParams(window.location.search);

      // Initialize search query from URL
      const searchParam = urlParams.get('search') || '';
      setSearchQuery(searchParam);

      // Initialize categories from URL
      const categoriasParam = urlParams.get('categorias');
      if (categoriasParam) {
        const categoryIds = categoriasParam.split(',').map(id => parseInt(id));
        setSelectedCategories(new Set(categoryIds));
      }

      // Initialize price range from URL
      const minPriceParam = urlParams.get('precioMin');
      const maxPriceParam = urlParams.get('precioMax');
      if (minPriceParam) setMinPrice(parseInt(minPriceParam));
      if (maxPriceParam) setMaxPrice(parseInt(maxPriceParam));

      // Initialize sort from URL
      const sortParam = urlParams.get('orden');
      if (sortParam) {
        setSortBy(sortParam);
      } else {
        // Si no hay parámetro de orden pero se accede desde ofertas, establecer un orden predeterminado
        const pathname = window.location.pathname;
        if (pathname.includes('/ofertas')) {
          setSortBy('discount'); // Ordenar por descuento si viene de ofertas
        }
      }
    };

    initializeFilters();
  }, []);

  // Apply filters when any filter value changes
  useEffect(() => {
    applyFilters();
    
    // Update URL when filters change
    const url = new URL(window.location.href);
    url.searchParams.delete('categorias');
    url.searchParams.delete('precioMin');
    url.searchParams.delete('precioMax');
    url.searchParams.delete('orden');
    url.searchParams.delete('search');
    
    if (selectedCategories.size > 0) {
      url.searchParams.set('categorias', Array.from(selectedCategories).join(','));
    }
    if (minPrice > 0) {
      url.searchParams.set('precioMin', minPrice.toString());
    }
    if (maxPrice < 1000) {
      url.searchParams.set('precioMax', maxPrice.toString());
    }
    if (sortBy !== 'relevance') {
      url.searchParams.set('orden', sortBy);
    }
    if (searchQuery.trim() !== '') {
      url.searchParams.set('search', searchQuery.trim());
    }
    
    window.history.pushState({}, '', url);
  }, [selectedCategories, minPrice, maxPrice, sortBy, searchQuery, products]);

  const handleChildCategoryChange = (categoryId: number) => {
    const newSelectedCategories = new Set(selectedCategories);
    if (newSelectedCategories.has(categoryId)) {
      newSelectedCategories.delete(categoryId);
    } else {
      newSelectedCategories.add(categoryId);
    }
    setSelectedCategories(newSelectedCategories);
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
  };

  const clearAllFilters = () => {
    // Reset all filters
    setSelectedCategories(new Set());
    setMinPrice(0);
    setMaxPrice(1000);
    setSortBy('relevance');
    setSearchQuery('');

    // Update URL by removing all filter parameters
    const url = new URL(window.location.href);
    url.searchParams.delete('categorias');
    url.searchParams.delete('precioMin');
    url.searchParams.delete('precioMax');
    url.searchParams.delete('orden');
    url.searchParams.delete('search');
    window.history.pushState({}, '', url);
  };

  const handleSortChange = (sortValue: string) => {
    setSortBy(sortValue);
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
  };

  // Function to apply all filters to the products
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
        case 'discount':
          // Para ordenar por descuento, necesitamos simular un campo de descuento
          // En este caso, simplemente ordenamos de forma descendente por precio como ejemplo
          // En una implementación real, aquí se calcularía el porcentaje de descuento
          return parseFloat(b.precio_base) - parseFloat(a.precio_base);
        case 'novedad':
          // Para ordenar por novedad, podríamos usar una fecha de creación
          // Por ahora, simplemente mantenemos el orden original
          return 0;
        default:
          return 0; // relevance sorting would go here if implemented
      }
    });

    setFilteredProducts(result);
  };

  // Calculate total pages
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  // Get current products for the page
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const paginatedProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  // Pagination functions
  const goToPreviousPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const goToNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const value = {
    categories,
    selectedCategories,
    minPrice,
    maxPrice,
    sortBy,
    searchQuery,
    products,
    filteredProducts,
    currentPage,
    totalPages,
    productsPerPage,
    paginatedProducts,
    setCurrentPage,
    setProductsPerPage,
    setSelectedCategories,
    setMinPrice,
    setMaxPrice,
    setSortBy,
    setSearchQuery,
    setProducts,
    handleChildCategoryChange,
    handleParentCategoryChange,
    handlePriceChange,
    clearAllFilters,
    handleSortChange,
    handleSearchChange,
    goToPreviousPage,
    goToNextPage,
    goToPage
  };

  return (
    <ProductFilterContext.Provider value={value}>
      {children}
    </ProductFilterContext.Provider>
  );
}

export function useProductFilter() {
  const context = useContext(ProductFilterContext);
  if (context === undefined) {
    throw new Error('useProductFilter must be used within a ProductFilterProvider');
  }
  return context;
}