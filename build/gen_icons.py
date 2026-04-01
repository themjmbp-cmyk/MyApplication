"""Generate ZK logo PNG icons and .ico without external deps."""
import struct, zlib, os

def png(size):
    """Render ZK logo as PNG at given size."""
    # Colors
    BG   = (20,  48,  79)   # #14304f
    FG   = (255, 255, 255)  # white
    ACC  = (125, 216, 122)  # #7dd87a

    img = [list(BG) for _ in range(size * size)]

    def px(x, y, c):
        if 0 <= x < size and 0 <= y < size:
            img[y * size + x] = list(c)

    def rect(x0, y0, x1, y1, c):
        for y in range(y0, y1):
            for x in range(x0, x1):
                px(x, y, c)

    # Green bar at bottom (12% height)
    bar_h = max(2, size // 8)
    bar_margin = max(1, size // 10)
    rect(bar_margin, size - bar_h - bar_margin,
         size - bar_margin, size - bar_margin, ACC)

    # "ZK" text drawn with thick strokes scaled to size
    s = max(1, size // 16)  # stroke width
    mid = size // 2
    pad = max(2, size // 6)
    top = max(2, size // 5)
    bot = size - bar_h - bar_margin * 2 - max(2, size // 10)

    # Z character (left half)
    lx0, lx1 = pad, mid - s
    # top bar
    rect(lx0, top, lx1, top + s * 2, FG)
    # diagonal (approx)
    h = bot - top
    for i in range(h):
        xi = lx0 + int((lx1 - lx0 - s) * i / h)
        rect(xi, top + i, xi + s * 2, top + i + 1, FG)
    # bottom bar
    rect(lx0, bot - s * 2, lx1, bot, FG)

    # K character (right half)
    rx0, rx1 = mid + s, size - pad
    rmid = (rx0 + rx1) // 2
    # vertical stroke
    rect(rx0, top, rx0 + s * 2, bot, FG)
    # upper diagonal
    h2 = (bot - top) // 2
    for i in range(h2):
        xi = rx0 + s * 2 + int((rx1 - rx0 - s * 2) * i / h2)
        rect(xi, top + h2 - i, xi + s * 2, top + h2 - i + 1, FG)
    # lower diagonal
    for i in range(h2):
        xi = rx0 + s * 2 + int((rx1 - rx0 - s * 2) * i / h2)
        rect(xi, top + h2 + i, xi + s * 2, top + h2 + i + 1, FG)

    # Encode as PNG
    def pack_chunk(tag, data):
        c = zlib.crc32(tag + data) & 0xffffffff
        return struct.pack('>I', len(data)) + tag + data + struct.pack('>I', c)

    ihdr = struct.pack('>IIBBBBB', size, size, 8, 2, 0, 0, 0)
    raw = b''
    for y in range(size):
        raw += b'\x00'
        for x in range(size):
            r, g, b = img[y * size + x]
            raw += bytes([r, g, b])
    idat = zlib.compress(raw)

    return (b'\x89PNG\r\n\x1a\n'
            + pack_chunk(b'IHDR', ihdr)
            + pack_chunk(b'IDAT', idat)
            + pack_chunk(b'IEND', b''))

def make_ico(sizes, pngs):
    """Pack multiple PNGs into a .ico file."""
    n = len(sizes)
    header = struct.pack('<HHH', 0, 1, n)
    dir_size = 16
    offset = 6 + n * dir_size
    directory = b''
    for i, (sz, data) in enumerate(zip(sizes, pngs)):
        w = h = sz if sz < 256 else 0
        directory += struct.pack('<BBBBHHII', w, h, 0, 0, 1, 24, len(data), offset)
        offset += len(data)
    return header + directory + b''.join(pngs)

sizes = [16, 32, 48, 64, 128, 256, 512]
pngs  = [png(s) for s in sizes]

# Write individual PNGs for Linux
icons_dir = os.path.join(os.path.dirname(__file__), 'icons')
os.makedirs(icons_dir, exist_ok=True)
for s, data in zip(sizes, pngs):
    path = os.path.join(icons_dir, f'{s}x{s}.png')
    with open(path, 'wb') as f:
        f.write(data)
    print(f'  wrote {path}')

# Write .ico for Windows (use sizes up to 256)
ico_sizes = [s for s in sizes if s <= 256]
ico_pngs  = [pngs[sizes.index(s)] for s in ico_sizes]
ico_path  = os.path.join(os.path.dirname(__file__), 'icon.ico')
with open(ico_path, 'wb') as f:
    f.write(make_ico(ico_sizes, ico_pngs))
print(f'  wrote {ico_path}')
