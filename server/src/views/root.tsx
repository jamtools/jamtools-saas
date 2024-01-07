import Html from '@kitajs/html';

export const renderRoot = () => {
    return (
        <Root />
    );
};

const Root = () => {
    return (
        <>
            {'<!DOCTYPE html>'}
            <html>
                <head>
                    <meta charset="utf-8" />
                    <meta name="viewport" content="width=device-width, initial-scale=1" />
                    <title>Jam Tools</title>
                    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@picocss/pico@1/css/pico.min.css">
                    </link>
                </head>
                <body>
                    <MainContent />
                </body>
            </html>
        </>
    );
};

const MainContent = () => {
    const chordNames = [
        'C',
        'Dm',
        'Em',
        'F',
        'G',
        'Am',
    ];

    return (
        <div class='' style={{textAlign: 'center'}}>
            <div class="">
                {chordNames.map((chordName) => (
                    <button
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
        </div>
    );
};
