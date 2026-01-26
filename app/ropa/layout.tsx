import Navbar from "@/components/productos/navbar";
import { ReactNode } from "react";

interface CategoriaLayoutProps{
    children?: ReactNode;
}

export default function CategoriaLayout({children}: CategoriaLayoutProps){
    return(
        <>
        <Navbar />
            {children}
        </>
    )
}