/// <reference types="@kitajs/html/htmx.d.ts" />

import Html from '@kitajs/html';

import express from 'express';
import {WebSocket} from 'ws';

export const jamRouter = express.Router();

enum ROUTES {
    JAM_ACTIONS_ADD_CHORD = '/jam/actions/add_chord',
    JAM_ACTIONS_NEW_JAM = '/jam/actions/new_jam',
    JAM_ROOM_WEBSOCKET = '/jam/ws',
}

type JamState = {
    availableChords: string[];
    selectedChords: string[];
};

const jamState: JamState = {
    availableChords: ['C', 'Dm', 'Em', 'F', 'G', 'Am'],
    selectedChords: [],
};

const connectedSockets: WebSocket[] = [];

export const initJamRouterWebsocket = () => {
    jamRouter.ws(ROUTES.JAM_ROOM_WEBSOCKET, (ws, req) => {
        connectedSockets.push(ws);
        console.log('ws connected');
        ws.send(JamView().toString());

        ws.on('message', (msg) => {
            console.log(msg);
        });

        ws.on('close', () => {
            console.log('ws closed');
            connectedSockets.splice(connectedSockets.indexOf(ws), 1);
        });
    });
};

const refreshAll = () => {
    for (const ws of connectedSockets) {
        ws.send(JamView().toString());
    }
};

jamRouter.post<undefined, JSX.Element, undefined, {chord: string}>(
    ROUTES.JAM_ACTIONS_ADD_CHORD,
    (req, res) => {
        const {chord} = req.query;
        jamState.selectedChords.push(chord);

        res.send(JamView());
        refreshAll();
    },
);

jamRouter.post<undefined, JSX.Element>(
    ROUTES.JAM_ACTIONS_NEW_JAM,
    (req, res) => {
        jamState.selectedChords = [];

        res.send(JamView());
        refreshAll();
    },
);

export const renderJamPage = () => {
    return JamPage();
};

export const JamPage = () => {
    return (
        <>
            <div hx-ws='connect:/jam/ws' />
            <JamView />
        </>
    );
};

export const JamView = () => {
    const chordNames = jamState.availableChords;
    const selectedChords = jamState.selectedChords;

    return (
        <div
            id='jam-view'
            hx-ws='message:replaceOuterHTML'
            style={{textAlign: 'center'}}
        >
            <NewJamButton />
            <ChordSelectorSection availableChords={chordNames} />
            <DraftViewSection selectedChords={selectedChords} />
        </div>
    );
};

const DraftViewSection = (props: {selectedChords: string[]}) => {
    return (
        <div class='drafted-chords'>
            {props.selectedChords.map((chordName) => (
                <span class='displayed-chord' style={{margin: '20px'}}>
                    {chordName}
                </span>
            ))}
        </div>
    );
};

const ChordSelectorSection = (props: {availableChords: string[]}) => {
    return (
        <div class='chord-buttons'>
            {props.availableChords.map((chordName) => (
                <button
                    type='button'
                    class='chord-button'
                    hx-post={`${ROUTES.JAM_ACTIONS_ADD_CHORD}?chord=${chordName}`}
                    hx-target='#jam-view'
                    hx-swap='outerHTML'
                    style={{
                        maxWidth: '100px',
                        margin: '20px',
                    }}
                    role='button'
                >
                    {chordName}
                </button>
            ))}
        </div>
    );
};

const NewJamButton = () => {
    return (
        <button
            type='button'
            class='chord-button'
            hx-post={ROUTES.JAM_ACTIONS_NEW_JAM}
            hx-target='#jam-view'
            hx-swap='outerHTML'
            style={{
                maxWidth: '100px',
                margin: '20px',
            }}
            role='button'
        >
            {'New Jam'}
        </button>
    );
};
