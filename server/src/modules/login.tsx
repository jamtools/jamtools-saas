/// <reference types="@kitajs/html/htmx.d.ts" />

import express from 'express';
import Html from '@kitajs/html';

export const loginRouter = express.Router();

const loginSubmissionRoute = '/forms/login_submission';

loginRouter.post(loginSubmissionRoute, (req, res) => {
    res.redirect('/jam');
});

export const renderLoginPage = () => {
    return <LoginView/>;
}

export const LoginView = () => {
    return (
        <form class='container' hx-post={loginSubmissionRoute} hx-push-url='/jam' hx-swap='outerHTML'>
            <div class='grid'>
                <label for='name'>
                    Name (optional)
                    <input type='text' id='firstname' name='firstname' placeholder='' autocomplete='off' />
                </label>
            </div>

            <button type='submit'>Submit</button>
        </form>
    );
};
