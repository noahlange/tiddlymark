# TiddlyWiki Plugins

A handful of TiddlyWiki plugins designed to make things a little friendlier for
folks from the mainstream JS ecosystem, the scripts to bundle them, and some
half-baked typings for TiddlyWiki.

## markdown-plus

Alternative parser/renderer that uses `simple-markdown` to build a JsonML tree
instead of generating raw HTML. We can then take advantage of TiddlyWiki's HTML
rendering features that would otherwise be unavailable to us&mdash;macros,
link-checking, &amp;c.

Also includes a half-dozen syntax extensions for emojis, containers,
sub/superscript and the aforementioned inline/block macros.

## sass

Compiles `.scss` files tagged with `$:/tags/Stylesheet` into a hidden CSS
tiddler, which is then inserted into the DOM like other stylesheets. Requires a
page template override to avoid inserting the SASS source as CSS.

## prettier

Runs [prettier](https://prettier.io) on HTML, Markdown, JavaScript/TypeScript
and CSS/SCSS/LESS/PostCSS on save. There's a noticeable pause, but I much prefer
not having to worry about formatting things...

## monaco, monaco-workers

A pretty straightforward [Monaco](https://github.com/Microsoft/monaco-editor)
integration, which I (personally) like a lot more than Ace and CodeMirror.
Requires `monaco-workers`, which bundles its webworkers and adds a server route
to fetch them.

## fs-plus

Adjusts the standard file-system adapter to embed metadata as YAML into the
front-matter of Markdown files, which are then saved as `.md`. Also provides a
deserializer that reads these files back into a format TiddlyWiki understands.

Helps manage some file clutter and (more importantly) gives us regular Markdown
files. These can then be committed and viewed on GitHub or whatevered.
