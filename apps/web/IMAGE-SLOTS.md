# Moltivate image slots

The page numbers photo locations so a future request can refer to “slot 1” or “slot 2.” Edit `index.html` and source assets here, then rebuild `dist/` with `npm run build`.

| Slot | Location | Current content | Suggested replacement |
| --- | --- | --- | --- |
| **1** | Challenges section; `figure[data-image-slot="1"]` | `assets/photos/teletubbies-gym-crew.jpg`, the user-supplied gym illustration | Portrait framing; the current 3:4 frame shows the complete image |
| **2** | Our story section; `figure[data-image-slot="2"]` | `assets/photos/heavy-gains-crew.jpg`, the user-supplied vintage gym photo | Portrait framing; the current 4:5 crop keeps the lifter and cheering crew visible |

## Replacing a slot

1. Put the supplied image in `assets/photos/` using a clear filename. Keep the `data-image-slot` number and the existing Polaroid figure so later requests still identify the same location.
2. Update the existing image's `src`, `alt`, `width`, and `height` to describe the replacement. Retain the figure and caption. Slot 1 uses a full 3:4 portrait frame; slot 2 uses a responsive 4:5 portrait frame; adjust its `object-position` in `editorial.css` if the new subject needs different framing.
3. Update the visible caption and credit to match the actual image. Do not keep Frederick Shaw's credit on someone else's photo or describe stock subjects as Moltivate customers or founders.
4. Record the image's source and permission in `assets/photos/ASSET-SOURCES.md`, then check desktop and phone layouts after rebuilding.

Both displayed images were supplied by the user. Provenance for them and the former Unsplash image is recorded in [ASSET-SOURCES.md](assets/photos/ASSET-SOURCES.md).
