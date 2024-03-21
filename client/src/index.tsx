import React from 'react';
import {createRoot} from 'react-dom/client';

import App from '../../../jam-tools/shared/app';
import {EasyMidi} from '../../../jam-tools/shared/types/easy_midi_types';
import {Stdin} from '../../../jam-tools/shared/io/qwerty/qwerty_service';
import {Config} from '../../../jam-tools/shared/types/config_types/config_types';
import {UserDataState} from '../../../jam-tools/shared/state/user_data_state';
import {EasyMidiWebShim} from '../../../jam-tools/webapp/src/actions/action_handler_local';

import * as webmidi from 'webmidi';
import MidiService from '../../../jam-tools/shared/io/midi/midi_service';
const WebMidi = webmidi.WebMidi as unknown as WebMidiType;

const midiShim = new EasyMidiWebShim(WebMidi);

const userData: UserDataState = {
    chords: [],
    songs: [],
};

const Main = ({midiService}: {midiService: MidiService}) => {
    debugger;
    const inputs = midiService.getInputs();

    return (
       <div>
            <ul>
                {inputs.map(instrument => (
                    <li key={instrument.name}>{instrument.name}</li>
                ))}
            </ul>
        </div>
    );
};

let ClientInitialized: Promise<void>;

window.addEventListener('load', async () => {
    ClientInitialized = new Promise(r => {
        const midiService = new MidiService(midiShim, {
            midi: {
                inputs: [{name: 'IAC Driver Bus 1'}],
                outputs: [],
            }
        });
        midiService.setupMidi().then(() => {
            console.log(midiService.getInputs());
            r();
        });

        window.RenderComponent = async <Name extends keyof typeof components>(selector: string, name: Name, props: Parameters<typeof components[Name]>[0]) => {
            await ClientInitialized;

            const Component = components[name];
            debugger;
            createRoot(document.querySelector(selector)!).render(<Component midiService={midiService} />);
        };
    });
});

window.React = React;
window.ReactDOM = {createRoot};

const components = {Main} as const;

window.ReactComponents = components;
