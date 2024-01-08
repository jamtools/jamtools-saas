/// <reference types="@kitajs/html/htmx.d.ts" />

import Html from '@kitajs/html';

import express from 'express';

export const jamRouter = express.Router();

enum ROUTES {
    JAM_ACTIONS_ADD_CHORD = '/jam/actions/add_chord',
}

type JamState = {
    availableChords: string[];
    selectedChords: string[];
}

const jamState: JamState = {
    availableChords: [
        'C',
        'Dm',
        'Em',
        'F',
        'G',
        'Am',
    ],
    selectedChords: [

    ],
};

jamRouter.post<undefined, JSX.Element, undefined, {chord: string}>(ROUTES.JAM_ACTIONS_ADD_CHORD, (req, res) => {
    const {chord} = req.query;

    jamState.selectedChords.push(chord);
    res.send(JamView());
});

export const renderJamPage = () => {
    return JamView();
};

export const JamView = () => {
    const chordNames = jamState.availableChords;
    const selectedChords = jamState.selectedChords;

    return (
        <div id='jam-view' style={{textAlign: 'center'}}>
            <ChordSelectorSection availableChords={chordNames} />
            <DraftViewSection selectedChords={selectedChords} />
        </div>
    );
};

const DraftViewSection = (props: {selectedChords: string[]}) => {
    return (
        <div>
            {props.selectedChords.map((chordName) => (
                <span style={{margin: '20px'}}>{chordName}</span>
            ))}
        </div>
    )
}

const ChordSelectorSection = (props: {availableChords: string[]}) => {
    return (
        <div>
            {props.availableChords.map((chordName) => (
                <button
                    hx-post={ROUTES.JAM_ACTIONS_ADD_CHORD + '?chord=' + chordName}
                    hx-target='#jam-view'
                    hx-swap='outerHTML'
                    style={{
                        maxWidth: '100px',
                        margin: '20px',
                    }}
                    role="button"
                >
                    {chordName}
                </button>
            ))}
        </div>
    )
}
