# Anchor Flow

OneNote and Word let you float an image left or right and wrap text around
it. Obsidian doesn't. Drop an image into a note and it sits alone on its own
line, nothing wrapping around it. I'm building the plugin that fixes that.

## What this does

Select an image and a toolbar appears above it: Left, Right, or Full-width.
Pick one, and the text around the image wraps automatically, in both
Reading mode and Live Preview. The same toolbar carries a numeric width
field, so you can set an exact size instead of guessing.

- Positioning toolbar on image selection: Left / Right / Full-width.
- Numeric width control in that same toolbar.
- New images stay plain by default. A setting can switch pasted and dropped
  images to auto-float instead.
- Existing plain image embeds stay untouched until you convert them, one at
  a time.

Drag-based positioning and resizing, and a bulk "convert every embed in this
note" command, are candidates for later, not this release.

## Status

Early development, but the core loop works end to end: click an image,
pick Left, Right, or Full-width, and it converts and renders correctly in
both Reading mode and Live Preview. Clicking an already-floated image lets
you change its position or width the same way. The toolbar is positioned
to stay clear of Obsidian's own native image controls rather than hide
them, by design, not as a workaround.

Not built yet: the settings tab (default width, default position, the
auto-convert-on-paste toggle), and the submission-readiness pass.

## Support

If this plugin is useful to you, you can support my work here:
[Buy Me a Coffee](https://www.buymeacoffee.com/valleytheknight).

## Contributing

Issues and pull requests are welcome.
