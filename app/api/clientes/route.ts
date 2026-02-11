import { NextRequest, NextResponse } from "next/server";
import { database } from "@/lib/database";
import bcrypt from "bcrypt";

export async function GET(req: NextRequest) {
    try {
        const response = await database.query('select * from personas');
        if (response.rows.length == 0) {
            return NextResponse.json({ message: 'no hay ningún dato' })
        }
        return NextResponse.json({ message: response.rows })
    } catch (e: any) {
        return NextResponse.json({ message: e.message })
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        // Validar estructura del payload
        const { tipo, cuenta, persona, perfil_cliente, preferencias } = body;

        if (!tipo || !["PARTICULAR", "EMPRESA"].includes(tipo)) {
            return NextResponse.json(
                { errors: { tipo: "Tipo de cliente inválido" } },
                { status: 400 }
            );
        }

        if (!cuenta?.email || !cuenta?.password_hash) {
            return NextResponse.json(
                { errors: { email: "Email y contraseña son obligatorios" } },
                { status: 400 }
            );
        }

        // ============================
        // VALIDACIÓN DE DUPLICADOS
        // ============================
        const errors: Record<string, string> = {};

        // Verificar email duplicado en cuentas
        const emailDup = await database.query(
            "SELECT 1 FROM cuentas WHERE email = $1",
            [cuenta.email]
        );
        if (emailDup.rows.length > 0) {
            errors.email = "El correo electrónico ya está registrado";
        }

        // Verificar NIF/CIF duplicado en personas
        const nifDup = await database.query(
            "SELECT 1 FROM personas WHERE nif_cif = $1",
            [persona.nif_cif]
        );
        if (nifDup.rows.length > 0) {
            errors.nif_cif = "El NIF/CIF ya está registrado";
        }

        if (Object.keys(errors).length > 0) {
            return NextResponse.json({ errors }, { status: 400 });
        }

        // ============================
        // VALIDACIÓN DE CAMPOS SEGÚN TIPO
        // ============================
        if (tipo === "PARTICULAR") {
            if (!persona.nombre) errors.nombre = "El nombre es obligatorio";
            if (!persona.apellidos) errors.apellidos = "Los apellidos son obligatorios";
            if (persona.razon_social) {
                errors.razon_social = "Las personas particulares no pueden tener razón social";
            }
        } else {
            if (!persona.razon_social) errors.razon_social = "La razón social es obligatoria";
            if (persona.nombre || persona.apellidos) {
                errors.nombre = "Las empresas no pueden tener nombre/apellidos";
            }
        }

        if (!persona.telefono) errors.telefono = "El teléfono es obligatorio";
        if (!perfil_cliente?.direccion_facturacion) {
            errors.direccion_facturacion = "La dirección de facturación es obligatoria";
        }
        if (!perfil_cliente?.ciudad) errors.ciudad = "La ciudad es obligatoria";
        if (!perfil_cliente?.cp) errors.cp = "El código postal es obligatorio";
        if (!perfil_cliente?.pais) errors.pais = "El país es obligatorio";

        if (Object.keys(errors).length > 0) {
            return NextResponse.json({ errors }, { status: 400 });
        }

        // ============================
        // INICIAR TRANSACCIÓN
        // ============================
        await database.query("BEGIN");

        try {
            // ============================
            // 1. INSERTAR EN CUENTAS (autenticación)
            // ============================
            const hashedPassword = await bcrypt.hash(cuenta.password_hash, 12);

            const cuentaResult = await database.query(
                `
        INSERT INTO cuentas (email, password_hash, activo, fecha_alta)
        VALUES ($1, $2, true, NOW())
        RETURNING id_cuenta
        `,
                [cuenta.email, hashedPassword]
            );

            const id_cuenta = cuentaResult.rows[0].id_cuenta;

            // ============================
            // 2. INSERTAR EN PERSONAS (identidad)
            // ============================
            const personaResult = await database.query(
                `
        INSERT INTO personas (
          tipo, nombre, apellidos, razon_social, nombre_comercial, 
          nif_cif, telefono, fecha_registro
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
        RETURNING id_persona
        `,
                [
                    tipo,
                    tipo === "PARTICULAR" ? persona.nombre : null,
                    tipo === "PARTICULAR" ? persona.apellidos : null,
                    tipo === "EMPRESA" ? persona.razon_social : null,
                    tipo === "EMPRESA" ? persona.nombre_comercial : null,
                    persona.nif_cif,
                    persona.telefono,
                ]
            );

            const id_persona = personaResult.rows[0].id_persona;

            // ============================
            // 3. INSERTAR EN PERFILES_CLIENTE
            // ============================
            const preferenciasNotificacion = preferencias
                ? { newsletter: preferencias.newsletter }
                : { newsletter: false };

            await database.query(
                `
        INSERT INTO perfiles_cliente (
          id_persona, direccion_facturacion, ciudad, cp, pais, preferencias_notificacion
        )
        VALUES ($1, $2, $3, $4, $5, $6)
        `,
                [
                    id_persona,
                    perfil_cliente.direccion_facturacion,
                    perfil_cliente.ciudad,
                    perfil_cliente.cp,
                    perfil_cliente.pais,
                    preferenciasNotificacion,
                ]
            );

            // ============================
            // 4. VINCULAR CUENTA + PERSONA + ROL
            // ============================
            await database.query(
                `
        INSERT INTO cuentas_personas (id_cuenta, id_persona, rol, fecha_vinculo, activo)
        VALUES ($1, $2, 'CLIENTE', NOW(), true)
        `,
                [id_cuenta, id_persona]
            );

            // ============================
            // COMMIT TRANSACCIÓN
            // ============================
            await database.query("COMMIT");

            // ============================
            // RESPUESTA EXITOSA
            // ============================
            return NextResponse.json(
                {
                    message: "Cuenta creada correctamente",
                    data: {
                        id_cuenta,
                        id_persona,
                        email: cuenta.email,
                        tipo,
                    },
                },
                { status: 201 }
            );
        } catch (insertError) {
            // Si falla cualquier inserción, hacemos rollback
            await database.query("ROLLBACK");
            throw insertError;
        }
    } catch (error: any) {
        console.error("Error en registro:", error);

        // Si no es un error de validación, es un error interno
        if (!error.status) {
            return NextResponse.json(
                { message: "Error interno del servidor" },
                { status: 500 }
            );
        }

        // Re-lanzar errores de validación que ya fueron manejados
        throw error;
    }
}

export function PUT(req: NextRequest, res: NextResponse) {
}

export function DELETE(req: NextRequest, res: NextResponse) {
}
