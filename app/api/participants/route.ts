import {NextRequest, NextResponse} from "next/server";
import {supabase} from "@/lib/supabaseDatabase";

export async function GET() {
    try {
        const response = await supabase.from('participants').select();

        if (!response.error) {
            return NextResponse.json({
                'message': 'Participants retrieved.',
                'status': 200,
                'ok': true,
                'data': response.data,
            })
        } else {
            return NextResponse.json({
                'message': response.error.message,
                'status': response.error.code,
                'ok': false,
            })
        }

    } catch (err: any) {
        console.log(err);
        return NextResponse.json({
            'message': err.message ? err.message : 'An error has occurred. Try again later.',
            'ok': false,
            'status': 500
        })
    }
}