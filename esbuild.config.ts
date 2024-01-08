import esbuild from 'esbuild';

import {esbuildPluginIstanbul} from "esbuild-plugin-istanbul";

const plugins: esbuild.Plugin[] = [];

if (process.env.COVERAGE) {

    // Add code coverage instrumentation
    plugins.push(
        esbuildPluginIstanbul({
            name: "istanbul-loader-ts",
            filter: /\.[cm]?ts$/,
            loader: "ts",
        }),
        esbuildPluginIstanbul({
            name: "istanbul-loader-tsx",
            filter: /\.tsx$/,
            loader: "tsx",
        }),
    );
}


(async () => {
    await esbuild.build({
        plugins,
        bundle: true,
        platform: 'node',
        target: 'node14',
        sourcemap: true,
        entryPoints: ['server/src/index.ts'],
        outdir: 'dist/server',
    });
})();
