#!/usr/bin/env python3
"""Gera o banner da campanha de reconstrução do muro do gatil
(ONG Amor Animal - Marília/SP).

Uso:
    python3 tools/gerar_banner_muro.py                      # 1080x1080 (feed)
    python3 tools/gerar_banner_muro.py 1080 1350 saida.png  # tamanho/arquivo custom

Requer Pillow (`pip install Pillow`).
"""

from PIL import Image, ImageDraw, ImageFont, ImageFilter
import os

# ---------------- Config ----------------
REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
import sys
W, H = (int(sys.argv[1]), int(sys.argv[2])) if len(sys.argv) > 2 else (1080, 1080)
OUT = (sys.argv[3] if len(sys.argv) > 3 else
       os.path.join(REPO, "static/css/imagem/banner_muro_gatil.png"))
FONTS = os.path.join(REPO, "static/fonts/")
QR = os.path.join(REPO, "static/css/imagem/qrcodepix.png")
ICON = os.path.join(REPO, "static/pwa/icon-512.png")

TEAL = (13, 148, 136)
TEAL_DARK = (8, 59, 57)
TEAL_MID = (11, 75, 71)
CORAL = (249, 115, 22)
RED = (220, 38, 38)
AMBER = (251, 191, 36)
MINT = (167, 243, 208)
MINT_LIGHT = (209, 250, 229)
WHITE = (255, 255, 255)
INK = (15, 23, 42)
SLATE = (71, 85, 105)

def font(name, size):
    return ImageFont.truetype(FONTS + name, size)

def lerp(a, b, t):
    return tuple(round(a[i] + (b[i] - a[i]) * t) for i in range(3))

# ---------------- Layout anchors (computed from H) ----------------
PX = 64
BOX_H = 150
CARD_H = 92
FOOT_H = 62
STATS_Y = H - FOOT_H - BOX_H - 28 - CARD_H
HEADER_END = 226            # bottom of logo/name block
HL_STEP = 96
SUB_STEP = 40
HL_N, SUB_N = 4, 3
# text group = headline + gap + subtitle
GROUP_H = HL_N * HL_STEP + 24 + SUB_N * SUB_STEP
region_top = HEADER_END + 30
region_bottom = STATS_Y - 30
# center the text group in the region, distributed across the available height
slack = max(0, (region_bottom - region_top) - GROUP_H)
HEAD_Y = region_top + round(slack * 0.35)
SUB_Y = HEAD_Y + HL_N * HL_STEP + 24
HL = [("ELES PERDERAM", WHITE), ("A PROTEÇÃO.", WHITE),
      ("VOCÊ PODE", AMBER), ("DEVOLVER.", AMBER)]

# ---------------- Background: vertical + diagonal teal gradient ----------------
img = Image.new("RGB", (W, H), TEAL_DARK)
d = ImageDraw.Draw(img)
for y in range(H):
    t = y / (H - 1)
    if t < 0.42:
        c = lerp(TEAL_DARK, TEAL_MID, t / 0.42)
    else:
        c = lerp(TEAL_MID, TEAL, (t - 0.42) / 0.58)
    d.line([(0, y), (W, y)], fill=c)

# soft radial glow (top-right) using a blurred ellipse
glow = Image.new("L", (W, H), 0)
gd = ImageDraw.Draw(glow)
gd.ellipse([W - 620, -300, W + 260, 560], fill=110)
gd.ellipse([-360, H - 620, 300, H + 300], fill=70)
glow = glow.filter(ImageFilter.GaussianBlur(120))
img = Image.composite(Image.new("RGB", (W, H), (20, 184, 166)), img, glow.point(lambda v: v))
img = Image.blend(img, Image.new("RGB", (W, H), TEAL), 0.0)
d = ImageDraw.Draw(img)

# faint paw/cat watermark shapes (simple circles as paws)
wm = Image.new("RGBA", (W, H), (0, 0, 0, 0))
wd = ImageDraw.Draw(wm)
def paw(cx, cy, s, alpha):
    col = (255, 255, 255, alpha)
    wd.ellipse([cx - s*0.62, cy - s*0.5, cx + s*0.62, cy + s*0.78], fill=col)
    for dx, dy, r in [(-0.62, -0.55, 0.22), (-0.2, -0.78, 0.23), (0.26, -0.78, 0.23), (0.66, -0.5, 0.21)]:
        wd.ellipse([cx + dx*s - r*s, cy + dy*s - r*s, cx + dx*s + r*s, cy + dy*s + r*s], fill=col)
paw(980, 235, 150, 22)
paw(95, int(H * 0.74), 120, 20)
paw(1005, int(H * 0.59), 90, 16)
img = Image.alpha_composite(img.convert("RGBA"), wm).convert("RGB")
d = ImageDraw.Draw(img)

# ---------------- Top alert bar ----------------
BAR_H = 76
bar = Image.new("RGB", (W, BAR_H), RED)
bd = ImageDraw.Draw(bar)
for x in range(W):
    bd.line([(x, 0), (x, BAR_H)], fill=lerp(RED, CORAL, x / (W - 1)))
img.paste(bar, (0, 0))
bf = font("Roboto-Black.ttf", 30)
msg = "MURO DO GATIL DESABOU  •  AJUDE A RECONSTRUIR"
bw = d.textlength(msg, font=bf)
d.text(((W - bw) / 2 + 18, 20), msg, font=bf, fill=WHITE)
# pulsing dot
d.ellipse([(W - bw) / 2 - 14, 31, (W - bw) / 2 + 2, 47], fill=WHITE)

# ---------------- Header: logo + nome ----------------
y = 118
icon = Image.open(ICON).convert("RGBA").resize((96, 96), Image.LANCZOS)
card = Image.new("RGBA", (108, 108), (255, 255, 255, 255))
card.paste(icon, (6, 6), icon)
# rounded corners
mask = Image.new("L", (108, 108), 0)
ImageDraw.Draw(mask).rounded_rectangle([0, 0, 107, 107], 22, fill=255)
# shadow
sh = Image.new("RGBA", (W, H), (0, 0, 0, 0))
sh.paste((0, 0, 0, 90), (PX + 4, y + 6), mask)
sh = sh.filter(ImageFilter.GaussianBlur(10))
img = Image.alpha_composite(img.convert("RGBA"), sh).convert("RGB")
d = ImageDraw.Draw(img)
img.paste(card, (PX, y), mask)
d = ImageDraw.Draw(img)
f_name = font("Roboto-Black.ttf", 34)
f_sub = font("Roboto-Regular.ttf", 22)
d.text((PX + 128, y + 8), "ONG Amor Animal", font=f_name, fill=WHITE)
d.text((PX + 128, y + 58), "MARÍLIA  •  SP", font=f_sub, fill=MINT)

# ---------------- Headline ----------------
f_h = font("Roboto-Black.ttf", 86)
hl = [("ELES PERDERAM", WHITE), ("A PROTEÇÃO.", WHITE),
      ("VOCÊ PODE", AMBER), ("DEVOLVER.", AMBER)]
for i, (txt, col) in enumerate(hl):
    d.text((PX, HEAD_Y + i * 96), txt, font=f_h, fill=col)

# ---------------- Subtitle (anchored above stat cards) ----------------
f_s = font("Roboto-Regular.ttf", 29)
lines = [
    ("No temporal de 04 de outubro, o muro do gatil da ONG desabou.", WHITE),
    ("Os animais foram resgatados, mas o abrigo segue exposto.", MINT_LIGHT),
    ("Precisamos reconstruir o muro para garantir a segurança de todos.", MINT_LIGHT),
]
stats_y = STATS_Y
sub_y = SUB_Y
for i, (txt, col) in enumerate(lines):
    d.text((PX, sub_y + i * 40), txt, font=f_s, fill=col)

# ---------------- Stat cards (anchored above PIX box) ----------------
box_h = BOX_H
stats = [("+300", "animais sob nossos cuidados"),
         ("100%", "do valor vai para as obras"),
         ("1 PIX", "e o muro começa a subir")]
gap = 18
cw = (W - 2 * PX - 2 * gap) // 3
ch = CARD_H
y = STATS_Y
f_big = font("Roboto-Black.ttf", 38)
f_lbl = font("Roboto-Regular.ttf", 18)
for i, (big, lbl) in enumerate(stats):
    x = PX + i * (cw + gap)
    card = Image.new("RGBA", (cw, ch), (0, 0, 0, 0))
    cdr = ImageDraw.Draw(card)
    cdr.rounded_rectangle([0, 0, cw - 1, ch - 1], 16, fill=(255, 255, 255, 38),
                          outline=(255, 255, 255, 70), width=2)
    img.paste(card, (x, y), card)
    d = ImageDraw.Draw(img)
    d.text((x + 20, y + 12), big, font=f_big, fill=AMBER)
    # wrap label to card width
    words = lbl.split()
    cur = ""
    yy = y + 58
    for w in words:
        test = (cur + " " + w).strip()
        if d.textlength(test, font=f_lbl) > cw - 36:
            d.text((x + 20, yy), cur, font=f_lbl, fill=MINT_LIGHT)
            yy += 20
            cur = w
        else:
            cur = test
    if cur:
        d.text((x + 20, yy), cur, font=f_lbl, fill=MINT_LIGHT)

# ---------------- PIX box ----------------
y = H - FOOT_H - BOX_H - 4
box = Image.new("RGBA", (W - 2 * PX, box_h), (0, 0, 0, 0))
bdr = ImageDraw.Draw(box)
bdr.rounded_rectangle([0, 0, W - 2 * PX - 1, box_h - 1], 24, fill=WHITE)
sh = Image.new("RGBA", (W, H), (0, 0, 0, 0))
smask = Image.new("L", (W - 2 * PX, box_h), 0)
ImageDraw.Draw(smask).rounded_rectangle([0, 0, W - 2 * PX - 1, box_h - 1], 24, fill=255)
sh.paste((0, 0, 0, 110), (PX, y + 8), smask)
sh = sh.filter(ImageFilter.GaussianBlur(14))
img = Image.alpha_composite(img.convert("RGBA"), sh).convert("RGB")
img.paste(box, (PX, y), box)
d = ImageDraw.Draw(img)

# QR
qr = Image.open(QR).convert("RGB").resize((118, 118), Image.NEAREST)
img.paste(qr, (PX + 16, y + 16))
d = ImageDraw.Draw(img)

tx = PX + 156
f_k = font("Roboto-Bold.ttf", 19)
f_cnpj = font("Roboto-Black.ttf", 46)
f_nome = font("Roboto-Regular.ttf", 20)
f_cta = font("Roboto-Bold.ttf", 17)
d.text((tx, y + 14), "CHAVE PIX  (CNPJ)", font=f_k, fill=TEAL)
d.text((tx, y + 36), "40.472.777/0001-73", font=f_cnpj, fill=INK)
d.text((tx, y + 92), "Associação Grupo de Apoio Amor Animal", font=f_nome, fill=SLATE)
# CTA pill
cta = "DOE AGORA E COMPARTILHE  ♥"
cw2 = d.textlength(cta, font=f_cta)
px0 = W - PX - 30 - cw2 - 44
d.rounded_rectangle([px0, y + 44, px0 + cw2 + 44, y + 44 + 42], 21, fill=TEAL)
d.text((px0 + 22, y + 54), cta, font=f_cta, fill=WHITE)

# ---------------- Footer ----------------
d = ImageDraw.Draw(img)
d.rectangle([0, H - FOOT_H, W, H], fill=(2, 25, 24))
f_foot = font("Roboto-Black.ttf", 24)
f_tag = font("Roboto-Regular.ttf", 20)
d.text((PX, H - FOOT_H + 16), "amoranimal.ong.br", font=f_foot, fill=WHITE)
tag = "Cada tijolo conta  •  Doe qualquer valor  ♥"
tw = d.textlength(tag, font=f_tag)
d.text((W - PX - tw, H - FOOT_H + 19), tag, font=f_tag, fill=MINT)

img.save(OUT, "PNG", optimize=True)
print("OK ->", OUT, img.size)
