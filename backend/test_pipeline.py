"""端到端重建测试：test_input.png -> TripoSR -> GLB + 热力图 + 报告。"""
import os
import sys
import time

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.triposr_engine import reconstruct  # noqa: E402
from app.uncertainty import (  # noqa: E402
    build_report,
    compute_coarse_shape,
    enhance_colors,
    make_heatmap_mesh,
    normalize_mesh,
    orient_upright,
    vertex_uncertainty,
)

with open("test_input.png", "rb") as f:
    image_bytes = f.read()

t0 = time.time()
print("[1/4] TripoSR 推理中（CPU，可能需要 1-3 分钟）…")
mesh = reconstruct(image_bytes)
print(f"[2/4] 重建完成：vertices={len(mesh.vertices)} faces={len(mesh.faces)}")

mesh = orient_upright(mesh)
mesh = normalize_mesh(mesh, 30.0)
unc = vertex_uncertainty(mesh)
mesh = enhance_colors(mesh, unc)
hm = make_heatmap_mesh(mesh, unc)
report = build_report(mesh, unc, (time.time() - t0) * 1000)
shape = compute_coarse_shape(mesh)

os.makedirs("outputs", exist_ok=True)
mesh.export("outputs/test.glb")
hm.export("outputs/test.heatmap.glb")

print("[3/4] 已导出 outputs/test.glb 与 outputs/test.heatmap.glb")
print("[4/4] report:", report)
print("shape 前 5 点:", shape[:5])
