import { NextRequest, NextResponse } from "next/server";
import { database } from "@/lib/database";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params
        const response = await database.query(`SELECT 
                p.*,
                (SELECT json_agg(ip) FROM imagenes_producto ip WHERE ip.id_producto = p.id_producto) AS imagenes
            FROM productos p WHERE p.id_producto = ${id}`);
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
