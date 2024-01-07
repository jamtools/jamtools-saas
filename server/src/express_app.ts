import express from 'express';

import {AppDependencies} from './types/app_dependencies';
import {renderRoot} from './views/root';

export const initApp = (deps: AppDependencies) => {
    const app = express();

    app.get('/', (req, res) => {
        const content = renderRoot();
        res.setHeader('Content-Type', 'text/html');
        res.send(content);
    });

    return app;
};
