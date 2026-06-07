#!/usr/bin/env python3
"""Genera los iconos PNG de la PWA (medidor VU) sin dependencias externas."""
import zlib, struct, math

def lerp(a, b, t): return tuple(a[i] + (b[i]-a[i])*t for i in range(3))

TOP=(74,56,38); BOT=(20,13,6)
CREAM=(243,231,200); BRASS=(184,137,59)
TICK=(58,42,22); RED=(192,57,43); PIVOT=(36,26,14); REDZONE=(181,48,31)

def render(S, ss=3):
    # centro y radio del dial
    cx, cy = 0.5*S, 0.585*S
    R = 0.40*S
    nθ = math.radians(28)                       # ángulo de la aguja desde la vertical
    ndir = (math.sin(nθ), -math.cos(nθ))
    ntip = (cx + R*0.9*ndir[0], cy + R*0.9*ndir[1])
    nw = 0.020*S
    ticks = [math.radians(a) for a in range(-70, 71, 20)]
    buf = bytearray(S*S*4)

    def shade(x, y):
        # fondo: degradado vertical a todo el cuadro
        col = list(lerp(TOP, BOT, y/S)); a = 255
        dx, dy = x-cx, y-cy
        dist = math.hypot(dx, dy)
        ang = math.atan2(dx, -dy)               # ángulo desde la vertical
        # anillo de latón
        if R <= dist <= R+0.035*S:
            col = list(BRASS)
        elif dist < R:
            col = list(CREAM)
            # zona roja (extremo derecho del arco)
            if 0.78*R <= dist <= 0.99*R and math.radians(38) <= ang <= math.radians(70):
                col = list(REDZONE)
            # ticks
            if 0.78*R <= dist <= 0.93*R:
                for t in ticks:
                    if abs(ang-t) < 0.035:
                        col = list(TICK); break
            # aguja (distancia punto-segmento centro→punta)
            vx, vy = ntip[0]-cx, ntip[1]-cy
            L2 = vx*vx+vy*vy
            tproj = max(0.0, min(1.0, (dx*vx+dy*vy)/L2))
            px, py = cx+tproj*vx, cy+tproj*vy
            if math.hypot(x-px, y-py) < nw:
                col = list(RED)
            # pivote
            if dist < 0.11*R:
                col = list(PIVOT)
        return col[0], col[1], col[2], a

    for py in range(S):
        for px in range(S):
            r=g=b=a=0
            for sy in range(ss):
                for sx in range(ss):
                    cr,cg,cb,ca = shade(px+(sx+0.5)/ss, py+(sy+0.5)/ss)
                    r+=cr; g+=cg; b+=cb; a+=ca
            n=ss*ss; o=(py*S+px)*4
            buf[o]=int(r/n); buf[o+1]=int(g/n); buf[o+2]=int(b/n); buf[o+3]=int(a/n)
    return buf

def write_png(path, S, buf):
    def chunk(typ, data):
        return struct.pack(">I", len(data)) + typ + data + struct.pack(">I", zlib.crc32(typ+data)&0xffffffff)
    raw=bytearray()
    for y in range(S):
        raw.append(0); raw+=buf[y*S*4:(y+1)*S*4]
    png=b"\x89PNG\r\n\x1a\n"
    png+=chunk(b"IHDR", struct.pack(">IIBBBBB", S, S, 8, 6, 0, 0, 0))
    png+=chunk(b"IDAT", zlib.compress(bytes(raw), 9))
    png+=chunk(b"IEND", b"")
    open(path,"wb").write(png)
    print("escrito", path, S, "x", S)

for size in (180, 192, 512):
    write_png(f"icon-{size}.png", size, render(size))
