import dts from 'rollup-plugin-dts'
import esbuild from 'rollup-plugin-esbuild'

/**
 * @param {import('rollup').RollupOptions} config
 * @returns {import('rollup').RollupOptions}
 */
const bundle = config => ({
    ...config,
    input: 'src/index.ts'
})

export default [
    bundle({
        plugins: [esbuild()],
        output: [
            {
                file: 'dist/index.mjs',
                format: "es"
            },
            {
                file: 'dist/index.js',
                format: "cjs"
            },
        ]
    }),
    bundle({
        plugins: [dts()],
        output: [
            {
                file: 'dist/index.d.ts'
            },
        ],
    }),
];