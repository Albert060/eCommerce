"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Input } from "@/components/ui/input";
import { useProductFilter } from '@/lib/product-context';
import { useCart } from '@/lib/cart-context';

export default function Navbar() {
  const { searchQuery, handleSearchChange } = useProductFilter();
  const { getTotalItems } = useCart();
  const cartItemCount = getTotalItems();

  return (
    <nav className="top-0 z-50 w-full bg-neutral-primary-soft border-b border-default">
      <div className="px-3 py-3 lg:px-5 lg:pl-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-start rtl:justify-end">
            <Link href="/" className="flex items-center">
              <Image
                src="/logo.jpg"
                alt="MiTienda Logo"
                width={40}
                height={40}
                className="rounded-md"
              />
              <span className="ml-2 text-xl font-bold text-primary hidden sm:block">
                MiTienda
              </span>
            </Link>
          </div>
          <div className="flex flex-1 mx-4">
            <div className="flex items-center w-full">
              <div className="w-full max-w-md">
                <Input
                  placeholder="Buscar productos..."
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Link href="/productos/carrito" className="text-gray-700 hover:text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5 6m0 0h9" />
                </svg>
              </Link>
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </div>
            <button className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors">
              Iniciar Sesión
            </button>
            <button className="bg-secondary text-secondary-foreground px-4 py-2 rounded-md hover:bg-secondary/90 transition-colors ml-2">
              Registrarse
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}