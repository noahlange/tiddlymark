# tiddlymark

A server-based [TiddlyWiki](https://tiddlywiki.com/) distribution for improved
Markdown support. Obviously, this makes liberal use of code loosely adapted from
TiddlyWiki's source.

Most of the codebase is a collection of TiddlyWiki plugins designed to make
things a little friendlier for folks from the mainstream JS and web dev
ecosystems.

The rest is composed of a few scripts to generate the plugin files and some
half-baked TS types for TiddlyWiki as a whole.

## Quick Start

```bash
# clone repository
git clone git@github.com:noahlange/tiddlymark.git && cd tiddlymark
# install dependencies and build plugins
npm install && npm run build
# serve the contents of ./wiki using the aforementioned plugins
node ./bin/serve ./wiki
```

### Running the server

I have no intention to get much of this running on the client; it operates with
the assumption that you're running TiddlyWiki from localhost.

Some peculiarities in how TiddlyWiki handles file loading/deserialization make
custom deserializers inordinately difficult; these behaviors needed to be
overwritten at the JS level.

To get everything running properly, you'll need to run the CLI script in
`bin/serve` or use the `tiddlymark` script. The updated CLI will add all the
plugins in `./wiki/plugins`, create a deserializer tiddler if necessary and boot
the server, using the user's git username as the wiki's anonymous username.

### Included plugins

#### markdown-plus

Alternative parser/renderer that uses `simple-markdown` to build a JsonML tree
instead of generating raw HTML. We can then take advantage of TiddlyWiki's HTML
rendering features that would otherwise be unavailable to us&mdash;macros,
link-checking, &amp;c.

Also includes a few syntax extensions for:

- HTML entities (e.g., `&rarr;`)
- emojis (e.g., `:smile:`)
- div containers (fences with `:::` instead of backticks)
- subscript and superscript (e.g., `~sub~`, `^super^`)
- inline and block macros (e.g., `<sayhi>`)

Unlike the stock Markdown plugin, link targets and image sources don't require a
preceding `#`.

#### sass

Compiles `.scss` files tagged with `$:/tags/Stylesheet` into a hidden CSS
tiddler, which is then inserted into the DOM like other stylesheets. Requires a
page template override to avoid inserting the SASS source as CSS.

#### prettier

Adds a save hoook to run [prettier](https://prettier.io) on HTML, Markdown,
JavaScript/TypeScript and CSS/SCSS/LESS/PostCSS on save. There's a slight pause
upon save, but I'll take that over constantly formatting content.

#### monaco, monaco-workers

A pretty straightforward [Monaco](https://github.com/Microsoft/monaco-editor)
integration, which I (personally) like a lot more than Ace and CodeMirror.
Requires `monaco-workers`, which bundles its webworkers and adds a server route
to fetch them.

#### fs-plus

Adjusts the standard file-system adapter to embed metadata as YAML into the
front-matter of Markdown files, which are then saved as `.md`. Also provides a
deserializer that reads these files back into a format TiddlyWiki understands.

Helps manage some file clutter and (more importantly) gives us regular Markdown
files. These can then be committed and viewed on GitHub or whatevered.

### Custom plugins

You can use the build scripts to generate custom plugins. Each plugin gets a
standalone directory in `plugins` with a webpack config and `index.js` that
serves as a "manifest" with the appropriate content and config.

Plugins you'd like to keep in the `plugins` directory but don't want to build
can be placed in directories prefixed with `.`. The build scripts will ignore
them.

#### webpack.config.js

Custom configuration for webpack goes in a `webpack.config.js` file to be merged
with the common `webpack.config.js` file at the project root. Things to note:

1. Your `target` depends on where you to run the code. Generally speaking,
   common or client-side code should use `web`; explicitly server-side code
   should use `node` instead. That being said, that's not always the case—it can
   get a little complicated.
2. Compiled files are dumped into `./build`.

#### index.js

A plain JS file that exports an object roughly corresponding to the file
structure of your plugin. Whatever the structure, the plugin's contents will
always be nested under `$:/plugins`.

Children of any given file are listed beneath `_`. Each key is a filename; the
keys beneath it correspond to its contents (`text`) and metadata (the rest).
Values need to be directly serializable to JSON or Promises of them.

#### Building plugins

To generate plugins during development, `npm run build` will suffice.
`npm run dist` is significantly more resource-intensive and intended for
production builds.

The generated files are copied to `wiki/plugins`.
