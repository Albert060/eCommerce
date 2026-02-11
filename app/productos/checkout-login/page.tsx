"use client";

import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";

export default function CheckoutLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login logic here
    console.log("Login attempt with:", { email, password });
  };

  return (
    <div className="min-h-screen bg-muted/40 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left side - Welcome message and benefits */}
        <div className="hidden lg:flex flex-col justify-center p-8 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl">
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-foreground">¡Bienvenido de nuevo!</h1>
            <p className="text-muted-foreground text-lg">
              Inicia sesión para continuar con tu proceso de compra y disfrutar de una experiencia personalizada.
            </p>

            <div className="space-y-4 mt-8">
              <div className="flex items-start space-x-3">
                <div className="bg-primary/10 p-2 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Seguimiento de pedidos</h3>
                  <p className="text-muted-foreground text-sm">Consulta el estado de tus compras en tiempo real</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="bg-primary/10 p-2 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Compras más rápidas</h3>
                  <p className="text-muted-foreground text-sm">Guarda tus datos para futuras compras sin repetir información</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="bg-primary/10 p-2 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Ofertas exclusivas</h3>
                  <p className="text-muted-foreground text-sm">Accede a descuentos especiales para usuarios registrados</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Login form */}
        <Card className="w-full max-w-md mx-auto my-8 lg:my-0">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Continuar con la compra</CardTitle>
            <CardDescription>
              Inicia sesión o continúa como invitado
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Correo electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Contraseña</Label>
                  <Link href="#" className="text-sm font-medium text-primary hover:underline">
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <Button type="submit" className="w-full">
                Iniciar sesión
              </Button>
            </form>

          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <div className="flex items-center justify-center space-x-2">
              <span className="text-muted-foreground text-sm">¿No tienes cuenta?</span>
              <Link href="/registro" className="text-sm font-medium text-primary hover:underline">
                Regístrate aquí
              </Link>
            </div>

            <div className="w-full pt-4">
              <Link href="/checkout">
                <Button variant="secondary" className="w-full">
                  Continuar como invitado
                </Button>
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}