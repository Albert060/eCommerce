"use client"
import { useState } from "react";
import { cn } from "@/lib/utils";
import { HoveredLink, Menu, MenuItem, ProductItem } from "@/components/landing/navbar-menu";

export default function Navbar({ className }: { className?: string }) {
    const [active, setActive] = useState<string | null>(null);
    return (
        <div
            className={cn("fixed top-10 inset-x-0 max-w-2xl mx-auto z-50", className)}
        >
            <Menu setActive={setActive}>
                <MenuItem setActive={setActive} active={active} item="Categorías">
                    <div className="flex flex-col space-y-4 text-sm">
                        <HoveredLink href="/ropa">Ropa</HoveredLink>
                        <HoveredLink href="/zapatos">Zapatos</HoveredLink>
                        <HoveredLink href="/tecnologia">Tecnología</HoveredLink>
                        <HoveredLink href="/accesorios">Accesorios</HoveredLink>
                    </div>
                </MenuItem>
                <MenuItem setActive={setActive} active={active} item="Productos Destacados">
                    <div className="  text-sm grid grid-cols-2 gap-10 p-4">
                        <ProductItem
                            title="Zapatillas Deportivas"
                            href="/productos/zapatillas"
                            src="https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300&h=300&fit=crop"
                            description="Zapatillas cómodas y modernas para todo tipo de actividad."
                        />
                        <ProductItem
                            title="Smartphone Pro"
                            href="/productos/smartphone"
                            src="https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=300&h=300&fit=crop"
                            description="Última generación en dispositivos móviles con cámara profesional."
                        />
                        <ProductItem
                            title="Camiseta Premium"
                            href="/productos/camiseta"
                            src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop"
                            description="Camiseta de algodón orgánico de alta calidad y ajuste perfecto."
                        />
                        <ProductItem
                            title="Auriculares Inalámbricos"
                            href="/productos/auriculares"
                            src="https://images.unsplash.com/photo-1657223144998-e5aa4fa2db7c?q=80&w=765&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                            description="Auriculares con cancelación de ruido y sonido de alta fidelidad."
                        />
                    </div>
                </MenuItem>
                <MenuItem setActive={setActive} active={active} item="Ofertas">
                    <div className="flex flex-col space-y-4 text-sm">
                        <HoveredLink href="/ofertas">Ver Ofertas</HoveredLink>
                        <HoveredLink href="/flash-sales">Ventas Flash</HoveredLink>
                        <HoveredLink href="/novedades">Novedades</HoveredLink>
                        <HoveredLink href="/descuentos">Descuentos</HoveredLink>
                    </div>
                </MenuItem>
            </Menu>
        </div>
    );
}