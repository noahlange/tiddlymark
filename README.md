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

1. Clone repository:

```
$ git clone git@github.com:noahlange/tiddlymark.git
$ cd tiddlymark
```

2. Install and generate plugins.

```
$ npm install
$ npm run dist
```

3. Link boot script and start server.

```
$ npm link
$ tiddlymark ./wiki
```

4. Optionally, symlink TiddlyWiki to make development easier.

```
$ ln -s "$(pwd)/node_modules/tiddlywiki" tiddlywiki
```

### Running the server

I have no intention to get much of this running in a client-only context; it
really operates with the assumption that you're running TiddlyWiki as a server
on `localhost`.

Some peculiarities in how TiddlyWiki handles file loading/deserialization make
custom deserializers inordinately difficult; these behaviors needed to be
overwritten at the JS level.

To get everything running properly, you'll need to run the CLI script in
`bin/serve` (or, after running `npm link`, use the `tiddlymark` command).

The updated CLI will add all the plugins in `./wiki/plugins`, create a
deserializer tiddler if necessary and boot the server, using the user's git
username as the wiki's anonymous username.

### Included plugins

| Plugin        |                                                     |
| :------------ | :-------------------------------------------------- |
| fs-plus       | Write metadata to YAML front-matter in `.md` files. |
| markdown-plus | "Native" markdown renderer.                         |
| monaco        | Enable the monaco text editor.                      |
| pretty        | Prettify files on save.                             |
| sass          | Compile SASS files into a CSS stylesheet tiddler.   |

#### fs-plus

Adjusts the standard file-system adapter to embed metadata as YAML into the
front-matter of Markdown files, which are then saved as `.md`. Also provides a
deserializer that reads these files back into a format TiddlyWiki understands.

Helps manage some file clutter and (more importantly) gives us regular Markdown
files. These can then be committed and viewed on GitHub or whatevered.

#### markdown-plus

Alternative parser/renderer that uses `simple-markdown` to build a JsonML tree
instead of generating raw HTML. We can then take advantage of TiddlyWiki's HTML
rendering features that would otherwise be unavailable to us&mdash;macros,
link-checking, &amp;c.

Also includes a few syntax extensions for:

- HTML entities (e.g., `&rarr;`)
- emojis (e.g., `:smile:`)
- ` <div>` containers (fences with `:::` instead of backticks)
- subscript and superscript (e.g., `~sub~`, `^super^`)
- insert (`++ins++`)
- inline and block macros (e.g., `<<sayhi>>`)

Unlike the stock Markdown plugin, link targets and image sources _don't_ require
a preceding `#`.

#### sass

Compiles `.scss` files tagged with `$:/tags/Stylesheet` into a hidden CSS
tiddler, which is then inserted into the DOM like other stylesheets. Requires a
page template override to avoid inserting the SASS source as CSS.

#### pretty

Adds a save hook to run [prettier](https://prettier.io) on XML, Markdown,
JavaScript/TypeScript and CSS/SCSS/LESS/PostCSS on save. There's a slight pause
upon save, but I'll take that over having to manually reformat content and/or
have it be ugly.

#### monaco

A pretty straightforward [Monaco](https://github.com/Microsoft/monaco-editor)
integration, which I (personally) like a lot more than Ace and CodeMirror.
