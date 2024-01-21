const all12Notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#','A', 'A#', 'B'];

const scaleDegrees = [0, 2, 4, 5, 7, 9] as const;
const scaleDegreeQualities = ['', 'm', 'm', '', '', 'm'] as const;

const majorIndexes = [0, 5, 7] as const;

export const getChordsFromKeyRoot = (keyRoot: string) => {
    const tonicIndex = all12Notes.indexOf(keyRoot);
    const allDegrees = scaleDegrees.map((degree) => (degree + tonicIndex) % 12);

    const chordsInThisKey = allDegrees.map((degree, index) => {
        const chordRoot = all12Notes[degree];
        const chordQuality = scaleDegreeQualities[index];

        return chordRoot + chordQuality;
    });

    return chordsInThisKey;
};
