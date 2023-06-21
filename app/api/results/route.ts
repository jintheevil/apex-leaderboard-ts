import {NextRequest, NextResponse} from "next/server";
import {supabase} from "@/lib/supabaseDatabase";

export async function GET() {
    try {
        // GET results from supabase table
        const response = await supabase.from('results').select();

        // Response handling for either error or no
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
        // Log the error and respond accordingly
        console.log(err);
        return NextResponse.json({
            'message': err.message ? err.message : 'An error has occurred, please try again later.',
            'status': 500,
            'ok': false,
        })
    }
}

export async function POST(req: NextRequest, res: NextResponse) {
    // Extract participant's information from request body
    const JSONBody = await req.json()
    const { name, score, fastestLapScore, overtakes } = JSONBody;

    if (!JSONBody) {
        return NextResponse.json({
            'message': 'Empty body received.',
            'ok': false,
            'status': 500,
        })
    }

    try {
        // Check if the participant exists
        let { data: participant, error } = await supabase
            .from('participants')
            .select('id')
            .eq('name', name)
            .single();

        // If participant doesn't exist, create new participant
        if (!participant) {
            const { error: insertError } = await supabase
                .from('participants')
                .insert([{ name }]);

            if (insertError) {
                return NextResponse.json({ error: 'Failed to create participant' });
            }

            // Fetch the newly inserted participant
            let { data: newParticipant, error: fetchError } = await supabase
                .from('participants')
                .select('id')
                .eq('name', name)
                .single();

            if (fetchError) {
                return NextResponse.json({ error: 'Failed to fetch the newly created participant' });
            }

            participant = newParticipant;
        }

        // Add result to results table
        const result = {
            participantId: participant ? participant.id : null,
            score,
            fastestLapScore,
            overtakes
        };

        if (!result.participantId) {
            return NextResponse.json({ error: 'No participant ID found' });
        }

        let { error: insertResultError } = await supabase
            .from('results')
            .insert([result]);

        if (insertResultError) {
            console.log(insertResultError)
            return NextResponse.json({ error: 'Failed to insert result' });
        }

        // Return success response
        return NextResponse.json({ message: 'Successfully inserted result' });
    } catch (err: any) {
        console.log(err);
        return NextResponse.json({
            'message': err.message ? err.message : 'An error has occurred. Try again later.',
            'ok': false,
            'status': 500
        })
    }
}

