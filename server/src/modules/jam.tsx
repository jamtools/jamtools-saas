/// <reference types="@kitajs/html/htmx.d.ts" />

import Html from '@kitajs/html';

import express from 'express';

export const jamRouter = express.Router();

enum ROUTES {
    JAM_ACTIONS_ADD_CHORD = '/jam/actions/add_chord',
    JAM_ACTIONS_NEW_JAM = '/jam/actions/new_jam',
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

jamRouter.post<undefined, JSX.Element>(ROUTES.JAM_ACTIONS_NEW_JAM, (req, res) => {
    jamState.selectedChords = [];
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
            <NewJamButton/>
            <ChordSelectorSection availableChords={chordNames} />
            <DraftViewSection selectedChords={selectedChords} />
        </div>
    );
};

const DraftViewSection = (props: {selectedChords: string[]}) => {
    return (
        <div class='drafted-chords'>
            {props.selectedChords.map((chordName) => (
                <span
                    class='displayed-chord'
                    style={{margin: '20px'}}
                >
                    {chordName}
                </span>
            ))}
        </div>
    );
}

const ChordSelectorSection = (props: {availableChords: string[]}) => {
    return (
        <div class='chord-buttons'>
            {props.availableChords.map((chordName) => (
                <button
                    class='chord-button'
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
    );
}

const NewJamButton = () => {
    return (
        <button
            class='chord-button'
            hx-post={ROUTES.JAM_ACTIONS_NEW_JAM}
            hx-target='#jam-view'
            hx-swap='outerHTML'
            style={{
                maxWidth: '100px',
                margin: '20px',
            }}
            role="button"
        >
            {'New Jam'}
        </button>
    )
};
