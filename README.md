# TiddlyMark
A TiddlyWiki installation with some modifications to make things a little
friendlier for folks who are used to Git + Markdown + YAML workflows. Clears
up a good amount of the filesystem clutter you usually get when working with
Markdown in TiddlyWiki. Highlights:

- FileSystemPaths tiddler to separate journals from content from config
- Markdown saved/loaded/parsed with inline YAML metadata instead of
  separate metadata files
- link parser regex modified to use allow spaces and apostrophes in URLs.
  this is against virtually every Markdown spec, but it was a pain point for me
  because I needed apostrophes and spaces in my titles, darnit!
- swapped out parser with more features than the original, and less jank than
  some of the other available markdown parsers. instead of writing raw html, we
  return JSONML that TiddlyWiki turns into HTML after running it through its own
  pipelines (syntax highlighting, link resolution, macros interpolation, etc).

```md
<!-- will no longer explode, hooray! -->
[Dumbledore's Army](#Dumbledore's Army).
```

Things you may want to do that I have not:

- get rid of the "New Tiddler" button in the main toolbar
- install an editor with Markdown syntax highlighting (figured that was personal
  preference)