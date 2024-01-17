import express, {Router} from 'express';
import expressWs from 'express-ws';

import {initJamRouterWebsocket, jamRouter, renderJamPage} from './modules/jam';
import {loginRouter, renderLoginPage} from './modules/login';
import {AppDependencies} from './types/app_dependencies';
import {renderLayout} from './views/layout';

const handlePage =
    (renderer: () => string | Promise<string>): express.Handler =>
    async (req, res, next) => {
        const page = await Promise.resolve(renderer());
        const fullContent = renderLayout(page);

        res.setHeader('Content-Type', 'text/html');
        res.send(fullContent);
    };

export const initApp = (deps: AppDependencies) => {
    const app = expressWs(express()).app;

    app.get('/', handlePage(renderLoginPage));

    app.get('/jam', handlePage(renderJamPage));
    app.get('/login', handlePage(renderLoginPage));

    app.use(jamRouter);
    app.use(loginRouter);

    initJamRouterWebsocket();

    return app;
};
