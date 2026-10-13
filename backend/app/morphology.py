"""Y 轴为竖直轴，按高度 30 统一尺度的形态测量。"""
import numpy as np
import trimesh
from scipy.spatial import ConvexHull, QhullError
from scipy.spatial.distance import pdist

DISPLAY_HEIGHT = 30.0


def _result(height, diameter, mouth, foot, position, shape, source):
    if height <= 0 or diameter <= 0:
        raise ValueError("模型高度和腹径必须大于零")
    scale = DISPLAY_HEIGHT / height
    return {
        "height": DISPLAY_HEIGHT,
        "maxBellyDiameter": float(diameter * scale),
        "mouthDiameter": float(mouth * scale),
        "footDiameter": float(foot * scale),
        "heightBellyRatio": float(height / diameter),
        "bellyPosition": float(position),
        "bellyPositionLabel": "偏下" if position < .4 else "偏上" if position > .6 else "居中",
        "shape": [[float(r * scale), float(y * scale)] for r, y in shape],
        "source": source,
        "method": "自动提取",
        "unit": "归一化单位（高度=30）",
    }


def measure_profile(profile):
    points = np.asarray(profile, dtype=float)
    if points.ndim != 2 or points.shape[1] != 2 or len(points) < 2:
        raise ValueError("轮廓至少需要两个 [半径, 高度] 点")
    if not np.isfinite(points).all() or (points[:, 0] < 0).any():
        raise ValueError("轮廓必须为有限数值，半径不得小于零")
    points = points[np.argsort(points[:, 1])]
    if (np.diff(points[:, 1]) <= 0).any():
        raise ValueError("轮廓高度必须互不重复")
    points[:, 1] -= points[0, 1]
    height = points[-1, 1]
    widest = np.flatnonzero(np.isclose(points[:, 0], points[:, 0].max()))
    position = float(np.mean(points[widest, 1]) / height) if height > 0 else 0
    return _result(height, points[:, 0].max() * 2, points[-1, 0] * 2,
                   points[0, 0] * 2, position, points, "profile")


def _diameter(points):
    points = np.unique(points[:, [0, 2]], axis=0)
    if len(points) < 2:
        return 0.0
    if len(points) > 2:
        try:
            points = points[ConvexHull(points).vertices]
        except QhullError:
            return float(np.linalg.norm(points.max(axis=0) - points.min(axis=0)))
    return float(pdist(points).max())


def measure_mesh(mesh):
    if not isinstance(mesh, trimesh.Trimesh) or len(mesh.faces) == 0:
        raise ValueError("文件中没有三角网格")
    if not np.isfinite(mesh.vertices).all():
        raise ValueError("网格包含无效坐标")
    low, high = mesh.bounds[:, 1]
    height = high - low
    if height <= 1e-9:
        raise ValueError("模型 Y 轴高度为零，请使用竖直模型")
    samples = []
    # 切平面与三角形求交；不依赖顶点密度，也适用于非水密重建网格。
    for fraction in np.linspace(.005, .995, 101):
        lines = trimesh.intersections.mesh_plane(
            mesh, plane_normal=[0, 1, 0], plane_origin=[0, low + fraction * height, 0])
        if len(lines):
            diameter = _diameter(lines.reshape(-1, 3))
            if diameter > 0:
                samples.append((float(fraction), diameter))
    if len(samples) < 5:
        raise ValueError("有效截面不足，无法提取器型参数")
    fractions, diameters = np.asarray(samples).T
    bottom = diameters[fractions <= .03]
    top = diameters[fractions >= .97]
    if len(bottom) == 0 or len(top) == 0:
        raise ValueError("器口或器足截面缺失")
    maximum = diameters.max()
    position = float(np.mean(fractions[np.isclose(diameters, maximum, rtol=.001)]))
    shape = [(float(d / 2), float(f * height)) for f, d in samples]
    # 顶/底端的截面容易退化，取邻近 3% 高度截面的中位外径。
    mouth, foot = float(np.median(top)), float(np.median(bottom))
    shape = [(foot / 2, 0), *shape, (mouth / 2, height)]
    return _result(height, maximum, mouth, foot, position, shape, "mesh")


def compare_measurements(left, right, left_label, right_label):
    rows = [
        {"label": label, "left": f"{left[key]:.2f}", "right": f"{right[key]:.2f}"}
        for label, key in [("高度（归一化）", "height"), ("最大腹径", "maxBellyDiameter"),
                           ("口径", "mouthDiameter"), ("足径", "footDiameter"),
                           ("高 / 腹径", "heightBellyRatio")]
    ]
    rows.append({"label": "腹部位置（距底部）",
                 "left": f"{left['bellyPosition']:.1%} · {left['bellyPositionLabel']}",
                 "right": f"{right['bellyPosition']:.1%} · {right['bellyPositionLabel']}"})
    difference = left["heightBellyRatio"] - right["heightBellyRatio"]
    form = "比例相近" if abs(difference) < .03 else "更修长" if difference > 0 else "更敦实"
    insight = f"统一高度后，{left_label}相较于{right_label}{form}。"
    for key, title in [("mouthDiameter", "口径"), ("footDiameter", "足径")]:
        delta = (left[key] / right[key] - 1) * 100 if right[key] > 0 else None
        if delta is not None:
            insight += f"{title}{'大' if delta >= 0 else '小'}约 {abs(delta):.1f}%。"
    shift = (left["bellyPosition"] - right["bellyPosition"]) * 100
    insight += f"最大腹径位置{'高' if shift >= 0 else '低'} {abs(shift):.1f} 个高度百分点。"
    return {"rows": rows, "insight": insight, "leftLabel": left_label, "rightLabel": right_label,
            "leftMeasurement": left, "rightMeasurement": right}
