type Participant = {
    id: number;
    name: string;
};

type RaceResult = {
    id: number;
    participantId: number;
    score: number;
    fastestLapScore: number;
    overtakes: number;
};

type NumericFields = 'score' | 'fastestLapScore' | 'overtakes';

type ColumnConfig = {
    field: NumericFields;
    calculation: 'sum' | 'min' | 'max';
    order: 'asc' | 'desc';
};

interface Config {
    columns: {
        field: 'score' | 'fastestLapScore' | 'overtakes',
        operation: 'sum' | 'min' | 'max',
        order: 'asc' | 'desc'
    }[]
}

export type {
    Participant,
    RaceResult,
    NumericFields,
    ColumnConfig,
    Config
}