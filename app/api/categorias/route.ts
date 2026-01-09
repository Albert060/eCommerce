import { NextRequest, NextResponse } from "next/server";
import { database } from "@/lib/database";

export async function GET(req: NextRequest) {
    try {
        const response = await database.query(`
            SELECT p.id_categoria AS parent_id,
                   p.nombre       AS parent_nombre,
                   COALESCE(
                           (SELECT json_agg(
                                           json_build_object(
                                                   'id_categoria', c.id_categoria,
                                                   'nombre', c.nombre
                                           )
                                   )
                            FROM categorias c
                            WHERE c.id_categoria_padre = p.id_categoria),
                           '[]'::json
                   )              AS children
            FROM categorias p
            WHERE p.id_categoria_padre IS NULL;
        `);
        if (response.rows.length == 0) {
            return NextResponse.json({ message: 'no hay ningún dato' })
        }
        return NextResponse.json({ message: response.rows })
    } catch (e: any) {
        return NextResponse.json({ message: e.message })
    }
}

export function POST(req: NextRequest, res: NextResponse) {
}

export function PUT(req: NextRequest, res: NextResponse) {
}

export function DELETE(req: NextRequest, res: NextResponse) {
}
