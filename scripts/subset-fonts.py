# Web cut of the Junicode display face: pins the width and enlarged-letter axes to their defaults
# (the site only varies weight) and keeps Latin + Vietnamese, general punctuation and arrows.
# Run: python scripts/subset-fonts.py  (needs fonttools + brotli). Originals stay in src/fonts/.
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
from fontTools import subset
from io import BytesIO

UNICODES = (
    list(range(0x20, 0x7F)) + list(range(0xA0, 0x180)) + list(range(0x1A0, 0x1B1))
    + list(range(0x300, 0x324)) + list(range(0x1EA0, 0x1EFA)) + list(range(0x2000, 0x2070))
    + list(range(0x2190, 0x2200)) + [0x20AB, 0x20AC]
)

for style in ("Roman", "Italic"):
    font = TTFont(f"src/fonts/JunicodeVF-{style}.woff2")
    opts = subset.Options()
    opts.layout_features = ["kern", "liga", "calt", "ccmp", "mark", "mkmk", "locl", "onum", "lnum", "tnum", "pnum"]
    opts.name_IDs = ["*"]
    opts.notdef_outline = True
    sub = subset.Subsetter(opts)
    sub.populate(unicodes=UNICODES)
    sub.subset(font)  # subset first: instancing the full Italic overflows its GPOS on save
    buf = BytesIO(); font.save(buf); buf.seek(0)
    font = instantiateVariableFont(TTFont(buf), {"wdth": 100, "ENLA": 0})
    out = f"src/fonts/JunicodeVF-{style}-web.woff2"
    font.flavor = "woff2"
    font.save(out)
    print(out)
