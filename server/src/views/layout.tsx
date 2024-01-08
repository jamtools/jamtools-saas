import Html from '@kitajs/html';

type HtmlContent = string | JSX.Element;

type LayoutProps = {
    content: HtmlContent;
}

export const renderLayout = (content: HtmlContent) => {
    return (
        <Layout content={content} />
    );
};

const Layout = ({content}: LayoutProps) => {
    return (
        <>
            {'<!DOCTYPE html>'}
            <html>
                <head>
                    <meta charset="utf-8" />
                    <meta name="viewport" content="width=device-width, initial-scale=1" />
                    <title>Jam Tools</title>
                    <script src="https://unpkg.com/htmx.org@1.9.10"/>
                    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@picocss/pico@1/css/pico.min.css"/>
                </head>
                <body>
                    {content}
                </body>
            </html>
        </>
    );
};
