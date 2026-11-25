"""Generates PNG app icons (teal background, white crescent + star). Pure stdlib."""
import zlib, struct, math, sys

def png(path, size, maskable):
    bg = (15, 118, 110)
    fg = (255, 255, 255)
    # maskable icons need content inside the central 80% safe zone
    scale = 0.55 if maskable else 0.7
    cx = cy = size / 2
    r = size * scale / 2
    rows = []
    for y in range(size):
        row = bytearray([0])
        for x in range(size):
            # round corners for non-maskable icons
            inside = True
            if not maskable:
                rad = size * 0.18
                dx = max(rad - x, 0, x - (size - 1 - rad))
                dy = max(rad - y, 0, y - (size - 1 - rad))
                inside = dx * dx + dy * dy <= rad * rad
            if not inside:
                row += bytes((0, 0, 0, 0)); continue
            d1 = math.hypot(x - cx, y - cy)
            d2 = math.hypot(x - (cx + r * 0.38), y - (cy - r * 0.08))
            crescent = d1 <= r and d2 > r * 0.82
            star = math.hypot(x - (cx + r * 0.52), y - (cy - r * 0.05)) <= r * 0.13
            c = fg if (crescent or star) else bg
            row += bytes(c + (255,))
        rows.append(bytes(row))
    raw = b''.join(rows)
    def chunk(t, d):
        c = struct.pack('>I', len(d)) + t + d
        return c + struct.pack('>I', zlib.crc32(t + d) & 0xffffffff)
    data = b'\x89PNG\r\n\x1a\n' + chunk(b'IHDR', struct.pack('>IIBBBBB', size, size, 8, 6, 0, 0, 0)) \
        + chunk(b'IDAT', zlib.compress(raw, 9)) + chunk(b'IEND', b'')
    open(path, 'wb').write(data)

png('icon-192.png', 192, False)
png('icon-512.png', 512, False)
png('icon-maskable-512.png', 512, True)
print('ok')
