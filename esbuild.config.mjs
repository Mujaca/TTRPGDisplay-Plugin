import esbuild from "esbuild";
import process from "process";
import builtins from "builtin-modules";
import Vue from "@the_tree/esbuild-plugin-vue3";

const banner =
`/*
THIS IS A GENERATED/BUNDLED FILE BY ESBUILD
if you want to view the source, please visit the github repository of this plugin
*/
`;

const prod = (process.argv[2] === "production");

const context = await esbuild.context({
	banner: {
		js: banner,
        css: banner,
	},
	entryPoints: ["main.ts"],
	bundle: true,
    plugins: [
        Vue({ isProd: prod })
    ],
	external: [
		"obsidian",
		"electron",
		"@codemirror/autocomplete",
		"@codemirror/collab",
		"@codemirror/commands",
		"@codemirror/language",
		"@codemirror/lint",
		"@codemirror/search",
		"@codemirror/state",
		"@codemirror/view",
		"@lezer/common",
		"@lezer/highlight",
		"@lezer/lr",
		...builtins],
	format: "cjs",
	target: "es2018",
	logLevel: "info",
	sourcemap: prod ? false : "inline",
	treeShaking: true,
	outfile: "main.js",
	minify: prod,
});

const styles = await esbuild.context({
    entryPoints: ["./main.css"],
    outfile: "styles.css",
    bundle: true,
    treeShaking: true,
    allowOverwrite: true,
    minify: prod,
});

if (prod) {
	await context.rebuild();
    await styles.rebuild();
	process.exit(0);
} else {
	await context.watch();
    await styles.watch();
}
