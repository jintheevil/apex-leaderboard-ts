import {NextRequest, NextResponse} from "next/server";
import {Participant, RaceResult, Config} from "@/utils/types";

export async function POST(req: NextRequest, res: NextResponse) {
    // Get data from body in JSON form
    const JSONBody = await req.json()

    // Sorting function
    function sortParticipants(
        participants: any[],
        raceResults: any[],
        config: Config
    ): Array<Participant & {score: number, fastestLapScore: number, overtakes: number}> {

        // Defining operations according to keys
        const operations: { [key in 'sum' | 'min' | 'max']: (accumulator: number, currentValue: number) => number } = {
            'sum': (accumulator: number, currentValue: number) => accumulator + currentValue,
            'min': (accumulator: number, currentValue: number) => Math.min(accumulator, currentValue),
            'max': (accumulator: number, currentValue: number) => Math.max(accumulator, currentValue),
        };

        // Map out each participant's data and do the right calculations according to the config passed
        const participantValues = participants.map((participant) => {
            const values = {
                score: 0,
                fastestLapScore: 0,
                overtakes: 0
            };

            const participantResults = raceResults.filter(
                (result) => result.participantId === participant.id
            );

            for (let i = 0; i < config.columns.length; i++) {
                const columnConfig = config.columns[i];

                const results = participantResults.map(result => result[columnConfig.field]);

                values[columnConfig.field] = results.reduce((acc, curr) => operations[columnConfig.operation](acc, curr), 0);
            }

            return {
                ...participant,
                ...values,
            };
        });

        // Sort based on order
        return participantValues.sort((a, b) => {
            for (let i = 0; i < config.columns.length; i++) {
                const columnConfig = config.columns[i];

                if (a[columnConfig.field] < b[columnConfig.field]) {
                    return columnConfig.order === 'asc' ? -1 : 1;
                }
                if (a[columnConfig.field] > b[columnConfig.field]) {
                    return columnConfig.order === 'asc' ? 1 : -1;
                }
            }

            return 0;
        });
    }

    if (!JSONBody) {
        return NextResponse.json({
            'message': 'Empty body received.',
            'ok': false,
            'status': 500,
        })
    }

    try {
        // Retrieving data from APIs in other routes
        const participantsJSON: any = await (await fetch('http://localhost:3000/api/participants', { method: 'GET' })).json()

        const participants = participantsJSON.data; // Retrieve from database

        const resultsJSON: any = await (await fetch('http://localhost:3000/api/results', { method: 'GET' })).json()

        const results = resultsJSON.data; // Retrieve from database

        // Setting config correctly
        const config: Config = {
            columns: JSONBody
        };

        const sortedParticipants = sortParticipants(participants, results, config);

        // Response when successfully retrieved
        return NextResponse.json({
            'message': 'Leaderboards successfully retrieved!',
            'ok': true,
            'status': 200,
            'data': sortedParticipants
        });
    } catch (err: any) {
        // Log the error and respond accordingly
        console.log(err);
        return NextResponse.json({
            'message': err.message ? err.message : 'An error has occurred. Try again later.',
            'ok': false,
            'status': 500
        })
    }
}