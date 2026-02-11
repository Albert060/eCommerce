"use client";

import Link from "next/link";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function RegistroPage() {
  const [tipoCliente, setTipoCliente] = useState<"PARTICULAR" | "EMPRESA">("PARTICULAR");

  const [formData, setFormData] = useState({
    // Datos de CUENTA (autenticación)
    email: "",
    password: "",
    confirmPassword: "",

    // Datos de PERSONA (identidad)
    nombre: "",
    apellidos: "",
    nifCif: "",
    razonSocial: "",
    nombreComercial: "",
    telefono: "",

    // Datos de PERFIL_CLIENTE (dirección)
    direccionFacturacion: "",
    ciudad: "",
    cp: "",
    pais: "España",

    // Otros
    aceptaTerminos: false,
    aceptaNewsletter: false,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof typeof formData, string>>>({});
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleCheckboxChange = (name: keyof typeof formData) => {
    setFormData((prev) => ({ ...prev, [name]: !prev[name] }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setGeneralError(null);

    // Validación básica en cliente
    if (formData.password !== formData.confirmPassword) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: "Las contraseñas no coinciden",
      }));
      return;
    }

    if (!formData.aceptaTerminos) {
      setErrors((prev) => ({
        ...prev,
        aceptaTerminos: "Debes aceptar los términos y condiciones",
      }));
      return;
    }

    // Validar campos obligatorios según tipo
    const newErrors: Partial<Record<keyof typeof formData, string>> = {};

    if (!formData.email) newErrors.email = "El email es obligatorio";
    if (!formData.password) newErrors.password = "La contraseña es obligatoria";
    if (!formData.telefono) newErrors.telefono = "El teléfono es obligatorio";

    if (tipoCliente === "PARTICULAR") {
      if (!formData.nombre) newErrors.nombre = "El nombre es obligatorio";
      if (!formData.apellidos) newErrors.apellidos = "Los apellidos son obligatorios";
      if (!formData.nifCif) newErrors.nifCif = "El NIF es obligatorio";
    } else {
      if (!formData.razonSocial) newErrors.razonSocial = "La razón social es obligatoria";
      if (!formData.nifCif) newErrors.nifCif = "El CIF es obligatorio";
    }

    if (!formData.direccionFacturacion) newErrors.direccionFacturacion = "La dirección es obligatoria";
    if (!formData.ciudad) newErrors.ciudad = "La ciudad es obligatoria";
    if (!formData.cp) newErrors.cp = "El código postal es obligatorio";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setIsSubmitting(true);

      // Preparar payload para el API según el modelo de BD
      const payload = {
        tipo: tipoCliente,
        cuenta: {
          email: formData.email,
          password_hash: formData.password, // El backend hará el hash
        },
        persona: {
          tipo: tipoCliente,
          nombre: tipoCliente === "PARTICULAR" ? formData.nombre : null,
          apellidos: tipoCliente === "PARTICULAR" ? formData.apellidos : null,
          razon_social: tipoCliente === "EMPRESA" ? formData.razonSocial : null,
          nombre_comercial: tipoCliente === "EMPRESA" ? formData.nombreComercial : null,
          nif_cif: formData.nifCif,
          telefono: formData.telefono,
        },
        perfil_cliente: {
          direccion_facturacion: formData.direccionFacturacion,
          ciudad: formData.ciudad,
          cp: formData.cp,
          pais: formData.pais,
        },
        preferencias: {
          newsletter: formData.aceptaNewsletter,
        },
      };

      const res = await fetch("/api/clientes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));

        if (data?.errors) {
          setErrors(data.errors);
        } else if (data?.message) {
          setGeneralError(data.message);
        } else {
          setGeneralError("Ha ocurrido un error al crear la cuenta.");
        }
        return;
      }

      // Redirigir o mostrar mensaje de éxito
      // router.push("/productos/checkout-login");
      alert("¡Cuenta creada correctamente! Redirigiendo...");
    } catch (err) {
      setGeneralError("No se ha podido conectar con el servidor.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
      <div className="min-h-screen bg-muted/40 flex items-center justify-center p-4">
        <Card className="w-full max-w-4xl">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold">Crear cuenta</CardTitle>
            <CardDescription>
              Completa tus datos para crear tu cuenta de cliente
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Selector de tipo de cliente */}
              <div className="md:col-span-2 space-y-2">
                <Label>Tipo de cliente</Label>
                <RadioGroup
                    value={tipoCliente}
                    onValueChange={(value: "PARTICULAR" | "EMPRESA") => setTipoCliente(value)}
                    className="flex space-x-8"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="PARTICULAR" id="particular" />
                    <Label htmlFor="particular">Particular</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="EMPRESA" id="empresa" />
                    <Label htmlFor="empresa">Empresa</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Información de autenticación */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">
                  Información de acceso
                </h3>

                <div className="space-y-2">
                  <Label htmlFor="email">Correo electrónico *</Label>
                  <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="tu@email.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                  />
                  {errors.email && (
                      <p className="text-sm text-red-500">{errors.email}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="password">Contraseña *</Label>
                    <Input
                        id="password"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                    {errors.password && (
                        <p className="text-sm text-red-500">{errors.password}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">
                      Confirmar contraseña *
                    </Label>
                    <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                    />
                    {errors.confirmPassword && (
                        <p className="text-sm text-red-500">
                          {errors.confirmPassword}
                        </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="telefono">Teléfono *</Label>
                  <Input
                      id="telefono"
                      name="telefono"
                      type="tel"
                      placeholder="+34 123 456 789"
                      value={formData.telefono}
                      onChange={handleChange}
                      required
                  />
                  {errors.telefono && (
                      <p className="text-sm text-red-500">{errors.telefono}</p>
                  )}
                </div>
              </div>

              {/* Información de identidad (condicional) */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">
                  {tipoCliente === "PARTICULAR" ? "Datos personales" : "Datos de empresa"}
                </h3>

                {tipoCliente === "PARTICULAR" ? (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="nombre">Nombre *</Label>
                        <Input
                            id="nombre"
                            name="nombre"
                            type="text"
                            placeholder="Juan"
                            value={formData.nombre}
                            onChange={handleChange}
                            required
                        />
                        {errors.nombre && (
                            <p className="text-sm text-red-500">{errors.nombre}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="apellidos">Apellidos *</Label>
                        <Input
                            id="apellidos"
                            name="apellidos"
                            type="text"
                            placeholder="Pérez García"
                            value={formData.apellidos}
                            onChange={handleChange}
                            required
                        />
                        {errors.apellidos && (
                            <p className="text-sm text-red-500">{errors.apellidos}</p>
                        )}
                      </div>
                    </>
                ) : (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="razonSocial">Razón social *</Label>
                        <Input
                            id="razonSocial"
                            name="razonSocial"
                            type="text"
                            placeholder="Empresa S.L."
                            value={formData.razonSocial}
                            onChange={handleChange}
                            required
                        />
                        {errors.razonSocial && (
                            <p className="text-sm text-red-500">
                              {errors.razonSocial}
                            </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="nombreComercial">Nombre comercial</Label>
                        <Input
                            id="nombreComercial"
                            name="nombreComercial"
                            type="text"
                            placeholder="Mi Empresa"
                            value={formData.nombreComercial}
                            onChange={handleChange}
                        />
                        {errors.nombreComercial && (
                            <p className="text-sm text-red-500">
                              {errors.nombreComercial}
                            </p>
                        )}
                      </div>
                    </>
                )}

                <div className="space-y-2">
                  <Label htmlFor="nifCif">
                    {tipoCliente === "PARTICULAR" ? "NIF *" : "CIF *"}
                  </Label>
                  <Input
                      id="nifCif"
                      name="nifCif"
                      type="text"
                      placeholder={tipoCliente === "PARTICULAR" ? "12345678X" : "B12345678"}
                      value={formData.nifCif}
                      onChange={handleChange}
                      required
                  />
                  {errors.nifCif && (
                      <p className="text-sm text-red-500">{errors.nifCif}</p>
                  )}
                </div>
              </div>

              {/* Dirección de facturación */}
              <div className="space-y-4 md:col-span-2">
                <h3 className="text-lg font-semibold text-foreground">
                  Dirección de facturación
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="direccionFacturacion">Dirección *</Label>
                    <Input
                        id="direccionFacturacion"
                        name="direccionFacturacion"
                        type="text"
                        placeholder="Calle Principal, 123"
                        value={formData.direccionFacturacion}
                        onChange={handleChange}
                        required
                    />
                    {errors.direccionFacturacion && (
                        <p className="text-sm text-red-500">
                          {errors.direccionFacturacion}
                        </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ciudad">Ciudad *</Label>
                    <Input
                        id="ciudad"
                        name="ciudad"
                        type="text"
                        placeholder="Madrid"
                        value={formData.ciudad}
                        onChange={handleChange}
                        required
                    />
                    {errors.ciudad && (
                        <p className="text-sm text-red-500">{errors.ciudad}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cp">Código postal *</Label>
                    <Input
                        id="cp"
                        name="cp"
                        type="text"
                        placeholder="28001"
                        value={formData.cp}
                        onChange={handleChange}
                        required
                    />
                    {errors.cp && (
                        <p className="text-sm text-red-500">{errors.cp}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pais">País *</Label>
                    <Select
                        value={formData.pais}
                        onValueChange={(value) => handleSelectChange("pais", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="España">España</SelectItem>
                        <SelectItem value="México">México</SelectItem>
                        <SelectItem value="Argentina">Argentina</SelectItem>
                        <SelectItem value="Colombia">Colombia</SelectItem>
                        <SelectItem value="Chile">Chile</SelectItem>
                        <SelectItem value="Perú">Perú</SelectItem>
                        <SelectItem value="Venezuela">Venezuela</SelectItem>
                        <SelectItem value="Ecuador">Ecuador</SelectItem>
                        <SelectItem value="Guatemala">Guatemala</SelectItem>
                        <SelectItem value="Cuba">Cuba</SelectItem>
                        <SelectItem value="Bolivia">Bolivia</SelectItem>
                        <SelectItem value="Dominicana">
                          República Dominicana
                        </SelectItem>
                        <SelectItem value="Honduras">Honduras</SelectItem>
                        <SelectItem value="Paraguay">Paraguay</SelectItem>
                        <SelectItem value="El Salvador">El Salvador</SelectItem>
                        <SelectItem value="Nicaragua">Nicaragua</SelectItem>
                        <SelectItem value="Costa Rica">Costa Rica</SelectItem>
                        <SelectItem value="Puerto Rico">Puerto Rico</SelectItem>
                        <SelectItem value="Uruguay">Uruguay</SelectItem>
                        <SelectItem value="Panamá">Panamá</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.pais && (
                        <p className="text-sm text-red-500">{errors.pais}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Términos y condiciones */}
              <div className="md:col-span-2 space-y-4">
                <div className="flex items-start space-x-2">
                  <Checkbox
                      id="aceptaTerminos"
                      checked={formData.aceptaTerminos}
                      onCheckedChange={() => handleCheckboxChange("aceptaTerminos")}
                      required
                  />
                  <div className="grid gap-1.5 leading-none">
                    <label
                        htmlFor="aceptaTerminos"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Acepto los{" "}
                      <Link
                          href="#"
                          className="text-primary hover:underline"
                      >
                        Términos y Condiciones
                      </Link>{" "}
                      y la{" "}
                      <Link
                          href="#"
                          className="text-primary hover:underline"
                      >
                        Política de Privacidad
                      </Link>{" "}
                      *
                    </label>
                  </div>
                </div>
                {errors.aceptaTerminos && (
                    <p className="text-sm text-red-500">{errors.aceptaTerminos}</p>
                )}

                <div className="flex items-start space-x-2">
                  <Checkbox
                      id="aceptaNewsletter"
                      checked={formData.aceptaNewsletter}
                      onCheckedChange={() => handleCheckboxChange("aceptaNewsletter")}
                  />
                  <div className="grid gap-1.5 leading-none">
                    <label
                        htmlFor="aceptaNewsletter"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Deseo recibir promociones y novedades por correo electrónico
                    </label>
                  </div>
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col space-y-4">
              {generalError && (
                  <p className="text-sm text-red-500 text-center">
                    {generalError}
                  </p>
              )}

              <Button
                  type="submit"
                  className="w-full max-w-md"
                  disabled={isSubmitting}
              >
                {isSubmitting ? "Creando cuenta..." : "Crear cuenta"}
              </Button>

              <div className="flex items-center justify-center space-x-2">
              <span className="text-muted-foreground text-sm">
                ¿Ya tienes cuenta?
              </span>
                <Link
                    href="/productos/checkout-login"
                    className="text-sm font-medium text-primary hover:underline"
                >
                  Inicia sesión aquí
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
  );
}