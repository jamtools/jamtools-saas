/// <reference types="@kitajs/html/htmx.d.ts" />

import Html from '@kitajs/html';

import express from 'express';
import {WebSocket} from 'ws';

import {getChordsFromKeyRoot} from '../utils/music_utils';

export const jamRouter = express.Router();

jamRouter.use(express.json());
jamRouter.use(express.urlencoded({extended: true}));

enum ROUTES {
    JAM_ACTIONS_ADD_CHORD = '/jam/actions/add_chord',
    JAM_ACTIONS_NEW_JAM = '/jam/actions/new_jam',
    JAM_ACTIONS_CHANGE_KEY = '/jam/actions/change_key',
    JAM_ROOM_WEBSOCKET = '/jam/ws',
}

type JamState = {
    key: string;
    selectedChords: string[];
};

const jamState: JamState = {
    key: 'C',
    selectedChords: [],
};

type ConnectedUser = {
    name: string;
    ws: WebSocket;
}

const connectedSockets: ConnectedUser[] = [];

export const initJamRouterWebsocket = () => {
    jamRouter.ws(ROUTES.JAM_ROOM_WEBSOCKET, (ws, req) => {
        connectedSockets.push({
            name: req.cookies.name,
            ws,
        });
        console.log('ws connected');
        ws.send(JamView().toString());

        ws.on('message', (msg) => {
            console.log(msg);
        });

        ws.on('close', () => {
            console.log('ws closed');
            connectedSockets.splice(connectedSockets.findIndex(u => u.ws === ws), 1);
        });

        refreshAll();
    });
};

const refreshAll = () => {
    for (const u of connectedSockets) {
       u.ws.send(JamView().toString());
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

jamRouter.post<undefined, JSX.Element, {key: string}>(
    ROUTES.JAM_ACTIONS_CHANGE_KEY,
    (req, res) => {
        const {key} = req.body;
        jamState.key = key;

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
    const selectedChords = jamState.selectedChords;
    const key = jamState.key;
    const availableChords = getChordsFromKeyRoot(key);

    return (
        <div
            id='jam-view'
            hx-ws='message:replaceOuterHTML'
            style={{textAlign: 'center'}}
        >
            <JamUsersView />
            <KeyName root={key} quality='maj' />
            <ChooseKeySelectBox key={key} />
            <NewJamButton />
            <ChordSelectorSection availableChords={availableChords} />
            <DraftViewSection selectedChords={selectedChords} />
        </div>
    );
};

const JamUsersView = () => {
    return (
        <div>
            <ul>
                {connectedSockets.map((user) => (
                    <li>{user.name}</li>
                ))}
            </ul>
        </div>
    );
}

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
    console.log(props.availableChords);
    return (
        <div class='chord-buttons'>
            {props.availableChords.map((chordName) => {
                const params = new URLSearchParams();
                params.append('chord', chordName);
                return (
                    <button
                        type='button'
                        class='chord-button'
                        hx-post={`${
                            ROUTES.JAM_ACTIONS_ADD_CHORD
                        }?${params.toString()}`}
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
                );
            })}
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

type ChooseKeySelectBoxProps = {
    key: string;
};

const ChooseKeySelectBox = (props: ChooseKeySelectBoxProps = {key: 'C'}) => {
    const notes = [
        '',
        'C',
        'C#',
        'D',
        'D#',
        'E',
        'F',
        'F#',
        'G',
        'G#',
        'A',
        'A#',
        'B',
    ];
    const noteOptions = notes.map((note) => (
        <option value={note} selected={note === props.key}>
            {note}
        </option>
    ));

    return (
        <div class='container'>
            <select
                hx-post='/jam/actions/change_key'
                hx-trigger='change'
                name='key'
            >
                {noteOptions}
            </select>
        </div>
    );
};

type KeyNameProps = {
    root: string;
    quality: string;
};

const KeyName = (props: KeyNameProps) => {
    return (
        <h1>
            {props.root}
            {props.quality}
        </h1>
    );
};
