import { NextRequest, NextResponse } from "next/server";
import { database } from "@/lib/database";

export async function GET(req: NextRequest) {
    try {
        const response = await database.query('select * from facturas');
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
