import express from 'express';

import {AppDependencies} from './types/app_dependencies';
import {renderLayout} from './views/layout';
import {loginRouter, renderLoginPage} from './modules/login';
import {jamRouter, renderJamPage} from './modules/jam';

const handlePage = (renderer: () => string | Promise<string>): express.Handler => async (req, res, next) => {
    const page = await Promise.resolve(renderer());
    const fullContent = renderLayout(page);

    res.setHeader('Content-Type', 'text/html');
    res.send(fullContent);
};

export const initApp = (deps: AppDependencies) => {
    const app = express();

    app.get('/', handlePage(renderLoginPage));

    app.get('/jam', handlePage(renderJamPage));
    app.get('/login', handlePage(renderLoginPage));

    app.use(jamRouter);
    app.use(loginRouter);

    return app;
};
