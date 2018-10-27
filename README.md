# TiddlyMark
A TiddlyWiki installation with some modifications to make things a little
friendlier for folks who typically use Git + Markdown + YAML workflows. Clears
up a good amount of the fs clutter you usually get when working with Markdown
in TW.

You'll need Node 8.6+ to use this, uses some object destructuring + rest.

- Markdown by default
- adds FileSystemPaths tiddler to separate journals from content from config
- Markdown is now saved/loaded/parsed with inline YAML metadata instead of
  separate metadata files
- Maruku is now the default Markdown parser
- link parser regex modified to use allow spaces and apostrophes in URLs.
  this is against virtually every Markdown spec, but it was a pain point for me
  because I needed apostrophes and spaces in my titles, darnit!

```md
<!-- will no longer explode, hooray! -->
[Dumbledore's Army](#Dumbledore's Army).
```

Things you may want to do that I have not:

- get rid of the "New Tiddler" button in the main toolbar
- install an editor with Markdown syntax highlighting

Things I may do that I have not:

- replace Markdown library ([simple-markdown](https://github.com/Khan/simple-markdown) would be good, since the parser/renderer will need to be customized heavily to accounts for links, files, etc.)
