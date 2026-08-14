#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""抖音求助图 v2 — 浅色医疗科普风 (2026-07-10)
9:16 / 1080x1920, 米白底 + 深青绿主色 + 珊瑚红强调, 手绘图标(不依赖emoji字体)。
"""
import os
from PIL import Image, ImageDraw, ImageFont

OUT = "/home/ubuntu/chinahospitalsguide/internal-research-notes/douyin-help-2026-07-10"
os.makedirs(OUT, exist_ok=True)

W, H = 1080, 1920
FONT = "/usr/share/fonts/truetype/wqy/wqy-zenhei.ttc"

# ---- palette (light clinical) ----
BG      = (247, 244, 238)   # 米白
CARD    = (255, 255, 255)   # 卡片白
TEAL    = (15, 110, 110)    # 深青绿 主色
TEAL_D  = (9, 74, 74)       # 深青绿 加深
CORAL   = (232, 80, 58)     # 珊瑚红 强调
INK     = (31, 41, 55)      # 墨色 正文
GREY    = (107, 114, 128)   # 灰 说明
LINE    = (223, 216, 205)   # 分隔线
GOLD    = (201, 162, 39)    # 点缀

def f(sz, bold=False):
    return ImageFont.truetype(FONT, sz, index=0)

def tw(d, txt, font):
    b = d.textbbox((0,0), txt, font=font)
    return b[2]-b[0], b[3]-b[1]

def center(d, txt, font, cx, y, fill):
    w,h = tw(d, txt, font)
    d.text((cx - w/2, y), txt, font=font, fill=fill)
    return y + h

def left(d, txt, font, x, y, fill):
    d.text((x, y), txt, font=font, fill=fill)
    b = d.textbbox((0,0), txt, font=font)
    return y + (b[3]-b[1])

def base(footer_page):
    img = Image.new("RGB", (W,H), BG)
    d = ImageDraw.Draw(img)
    # top brand bar
    d.rectangle([0,0,W,150], fill=TEAL_D)
    bf = f(34)
    d.text((70, 52), "CHINA HOSPITALS GUIDE", font=bf, fill=(255,255,255))
    sf = f(30)
    tag = "海外医疗求助"
    w,_ = tw(d, tag, sf)
    d.text((W-70-w, 56), tag, font=sf, fill=(180,222,215))
    # thin gold rule under bar
    d.rectangle([0,150,W,156], fill=GOLD)
    # footer page dots
    for i in range(4):
        cx = W/2 - 60 + i*40
        col = TEAL if (i+1)==footer_page else (205,198,187)
        d.ellipse([cx-9, H-70, cx+9, H-52], fill=col)
    pf = f(26)
    ptxt = f"{footer_page} / 4"
    w,_ = tw(d, ptxt, pf)
    d.text((W-70-w, H-78), ptxt, font=pf, fill=GREY)
    return img, d

def rcard(d, x0,y0,x1,y1, r=36, fill=CARD, outline=None, ow=0):
    d.rounded_rectangle([x0,y0,x1,y1], radius=r, fill=fill, outline=outline, width=ow)

# ---- icons ----
def icon_globe(d, cx, cy, r, col):
    d.ellipse([cx-r,cy-r,cx+r,cy+r], outline=col, width=8)
    d.ellipse([cx-r*0.45,cy-r,cx+r*0.45,cy+r], outline=col, width=6)
    d.line([cx-r,cy,cx+r,cy], fill=col, width=6)
    d.line([cx-r*0.86,cy-r*0.5,cx+r*0.86,cy-r*0.5], fill=col, width=5)
    d.line([cx-r*0.86,cy+r*0.5,cx+r*0.86,cy+r*0.5], fill=col, width=5)

def badge_x(d, cx, cy, r):
    d.ellipse([cx-r,cy-r,cx+r,cy+r], fill=CORAL)
    o = r*0.42
    d.line([cx-o,cy-o,cx+o,cy+o], fill=(255,255,255), width=9)
    d.line([cx-o,cy+o,cx+o,cy-o], fill=(255,255,255), width=9)

def badge_num(d, cx, cy, r, n):
    d.ellipse([cx-r,cy-r,cx+r,cy+r], fill=TEAL)
    nf = f(int(r*1.25))
    s = str(n)
    w,h = tw(d, s, nf)
    d.text((cx-w/2, cy-h/2-r*0.16), s, font=nf, fill=(255,255,255))

def badge_chat(d, cx, cy, r, col):
    d.rounded_rectangle([cx-r,cy-r*0.8,cx+r,cy+r*0.55], radius=r*0.35, fill=col)
    d.polygon([(cx-r*0.35,cy+r*0.5),(cx-r*0.05,cy+r*0.5),(cx-r*0.35,cy+r*0.95)], fill=col)
    for dx in (-r*0.4,0,r*0.4):
        d.ellipse([cx+dx-6,cy-r*0.15-6,cx+dx+6,cy-r*0.15+6], fill=(255,255,255))

# ==================== PAGE 1 — 封面钩子 ====================
img, d = base(1)
icon_globe(d, W/2, 360, 92, TEAL)
# small kicker
kf = f(38)
center(d, "一位海外血管疾病患者的中国求医路", kf, W/2, 520, GREY)
# big hook
bigf = f(150)
center(d, "4 年半", bigf, W/2, 640, CORAL)
center(d, "求医无门", bigf, W/2, 810, INK)
# coral underline
d.rectangle([W/2-230, 1000, W/2+230, 1012], fill=GOLD)
# sub
subf = f(72)
center(d, "她今年才 27 岁", subf, W/2, 1080, TEAL_D)
# bottom card
rcard(d, 110, 1300, W-110, 1560, r=40, fill=CARD)
cf = f(44)
center(d, "海外病历齐全 · 中英双语", cf, W/2, 1360, INK)
center(d, "只差一个愿意先看资料的医生", cf, W/2, 1440, INK)
img.save(f"{OUT}/page1.png")

# ==================== PAGE 2 — 病情 ====================
img, d = base(2)
tf = f(78)
left(d, "她是谁", tf, 90, 230, TEAL_D)
d.rectangle([92, 340, 92+140, 350], fill=CORAL)
rows2 = [
    ("27 岁女性，现居荷兰", None),
    ("左肾静脉压迫综合征", "俗称「胡桃夹综合征」"),
    ("合并左髂静脉压迫", "即 May-Thurner 综合征"),
    ("病程 4.5 年，反复不缓解", None),
    ("体重 60kg → 43.5kg", "已无法正常工作与学习"),
]
y = 430
mf = f(52)
nf = f(38)
for main, note in rows2:
    ch = 150 if note else 110
    rcard(d, 90, y, W-90, y+ch, r=32, fill=CARD)
    d.rounded_rectangle([90, y, 108, y+ch], radius=0, fill=TEAL)
    d.text((150, y+34), main, font=mf, fill=INK)
    if note:
        d.text((150, y+92), note, font=nf, fill=GREY)
    y += ch + 26
img.save(f"{OUT}/page2.png")

# ==================== PAGE 3 — 困境 ====================
img, d = base(3)
tf = f(70)
left(d, "联系了 3 家三甲", tf, 90, 220, TEAL_D)
d.rectangle([92, 320, 92+140, 330], fill=CORAL)
hosp = [
    ("北京大学第一医院", "必须本人挂号、排队一周"),
    ("中日友好医院", "门诊部无法处理外籍预审"),
    ("空军军医大学唐都医院", "军事医院不接外籍患者"),
]
y = 400
hf = f(50)
df = f(38)
for name, reason in hosp:
    ch = 200
    rcard(d, 90, y, W-90, y+ch, r=32, fill=CARD)
    badge_x(d, 175, y+ch/2, 52)
    d.text((270, y+46), name, font=hf, fill=INK)
    d.text((270, y+116), reason, font=df, fill=CORAL)
    y += ch + 30
# summary strip
rcard(d, 90, y+10, W-90, y+180, r=32, fill=TEAL_D)
sf = f(46)
center(d, "统一答复", sf, W/2, y+40, (180,222,215))
sf2 = f(50)
center(d, "本人到场 → 现场审 → 排队治疗", sf2, W/2, y+100, (255,255,255))
img.save(f"{OUT}/page3.png")

# ==================== PAGE 4 — 求助 ====================
img, d = base(4)
tf = f(66)
left(d, "只想求一个机会", tf, 90, 220, TEAL_D)
d.rectangle([92, 320, 92+140, 330], fill=CORAL)
asks = [
    ("血管外科擅长", "胡桃夹 + 髂静脉压迫"),
    ("接受海外邮件预审", "先看影像与病历资料"),
    ("先判断能不能接诊", "确诊后患者再飞中国"),
]
y = 400
af = f(52)
df = f(40)
for i,(main,note) in enumerate(asks, 1):
    ch = 175
    rcard(d, 90, y, W-90, y+ch, r=32, fill=CARD)
    badge_num(d, 180, y+ch/2, 56, i)
    d.text((285, y+42), main, font=af, fill=INK)
    d.text((285, y+108), note, font=df, fill=GREY)
    y += ch + 28
# CTA card
rcard(d, 90, y+16, W-90, y+300, r=40, fill=TEAL)
badge_chat(d, W/2, y+95, 46, (255,255,255))
cf = f(50)
center(d, "有医院 · 有医生 · 有渠道", cf, W/2, y+150, (255,255,255))
center(d, "麻烦您留个言，帮忙转发", cf, W/2, y+215, (255,255,255))
# footer contact
ct = f(38)
center(d, "评论区扣 1 · 私信发完整病历影像", ct, W/2, y+340, GREY)
img.save(f"{OUT}/page4.png")

# verify
print("DONE")
for i in range(1,5):
    p = f"{OUT}/page{i}.png"
    im = Image.open(p)
    print(p, im.size, im.mode, os.path.getsize(p), "bytes")
