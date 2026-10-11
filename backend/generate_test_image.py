"""生成一张用于测试重建管线的合成瓷器图片。"""
from PIL import Image, ImageDraw

W, H = 512, 512
img = Image.new("RGB", (W, H), (206, 203, 194))  # 浅灰背景，便于 rembg 分割
d = ImageDraw.Draw(img)


def radius(yn: float) -> float:
    """yn ∈ [0,1]，0=底部。返回半径（像素）。梅瓶形轮廓。"""
    if yn < 0.06:
        return 32
    if yn < 0.30:
        return 32 + 62 * ((yn - 0.06) / 0.24)  # 足 → 腹部
    if yn < 0.62:
        return 94  # 丰肩鼓腹
    if yn < 0.86:
        return 94 - 66 * ((yn - 0.62) / 0.24)  # 收束到颈
    if yn < 0.95:
        return 28  # 短颈
    return 42  # 口沿外撇


cx = W // 2
base_y = H - 70
top_y = 55

# 器物主体（米白釉）
for y in range(top_y, base_y + 1):
    yn = (base_y - y) / (base_y - top_y)
    r = radius(yn)
    # 简单侧光：左侧略暗
    d.line([cx - r, y, cx + r, y], fill=(236, 231, 216))

# 口沿高光 + 底部阴影
d.ellipse([cx - 46, top_y - 4, cx + 46, top_y + 12], fill=(222, 214, 196))
d.ellipse([cx - 110, base_y - 10, cx + 110, base_y + 8], fill=(160, 156, 146))

img.save("test_input.png")
print("saved test_input.png", img.size)
