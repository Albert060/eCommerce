import Navbar from "@/components/productos/navbar";
import { ReactNode } from "react";

interface ProductosLayoutProps{
    children?: ReactNode;
}

export default function ProductosLayout({children}: ProductosLayoutProps){
    return(
        <>
        <Navbar />
            {children}
        </>
    )
}