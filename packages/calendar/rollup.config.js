import typescript from 'rollup-plugin-typescript2';
import json from '@rollup/plugin-json'
import css from "rollup-plugin-import-css";

export default {
    input: ["src/index.tsx"],
    output: [
        {
            dir: "dist",
            entryFileNames: "[name].js",
            format: "cjs",
            exports: "named"
        }
    ],
    plugins: [
        typescript({
            sourceMap: true,
            declaration: false,
            noEmitOnError: false,
            declarationDir: null,
            skipLibCheck: true, // Disables type checking
        }),
        json(),
        css()
    ],
    external: ["react"]
};
