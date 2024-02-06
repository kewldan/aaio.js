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
                dir: "dist",
                format: "es",
                exports: "named"
            },
        ],
    }),
    bundle({
        plugins: [dts()],
        output: {
            dir: "dist",
            format: "es",
            exports: "named"
        },
    }),
];