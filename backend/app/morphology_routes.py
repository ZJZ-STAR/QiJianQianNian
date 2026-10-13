"""历史轮廓和本服务生成 GLB 的测量与对比 API。"""
import json
import re
from functools import lru_cache
from pathlib import Path
from urllib.parse import urlparse

import trimesh
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from . import config
from .morphology import compare_measurements, measure_mesh, measure_profile

router = APIRouter(prefix="/api", tags=["形态对比"])


@lru_cache(maxsize=1)
def catalog():
    return json.loads(Path(__file__).with_name("morphology_catalog.json").read_text(encoding="utf-8"))


class MeasureRequest(BaseModel):
    modelUrl: str | None = None
    artifactId: str | None = None


class CompareRequest(BaseModel):
    leftId: str
    rightId: str
    leftModelUrl: str | None = None
    rightModelUrl: str | None = None


def local_model_path(model_url):
    # 只解析重建服务的模型标识，不访问 URL，避免下载任意地址或读取任意本地文件。
    path = urlparse(model_url).path
    match = re.fullmatch(r"/files/([0-9a-fA-F-]{36})/mesh\.glb", path)
    if not match:
        raise HTTPException(422, "modelUrl 必须为重建服务生成的 /files/{taskId}/mesh.glb")
    target = Path(config.OUTPUT_DIR) / f"{match[1]}.glb"
    if not target.is_file():
        raise HTTPException(404, "模型文件不存在")
    return target


def measure(artifact_id=None, model_url=None):
    try:
        if model_url:
            scene = trimesh.load(local_model_path(model_url), force="scene", process=False)
            # dump 合并应用每个节点的变换。
            return measure_mesh(scene.to_geometry())
        item = catalog().get(artifact_id)
        if item is None:
            raise HTTPException(404, "参考器物不存在")
        return measure_profile(item["shape"])
    except (ValueError, TypeError, IndexError) as exc:
        raise HTTPException(422, f"形态测量失败：{exc}") from exc


@router.post("/measure")
def api_measure(payload: MeasureRequest):
    if bool(payload.modelUrl) == bool(payload.artifactId):
        raise HTTPException(422, "请提供 modelUrl 或 artifactId 中的一项")
    return measure(payload.artifactId, payload.modelUrl)


@router.post("/compare")
def api_compare(payload: CompareRequest):
    left = measure(payload.leftId, payload.leftModelUrl)
    right = measure(payload.rightId, payload.rightModelUrl)
    left_label = "我的瓷器" if payload.leftModelUrl else catalog()[payload.leftId]["name"]
    right_label = "我的瓷器" if payload.rightModelUrl else catalog()[payload.rightId]["name"]
    result = compare_measurements(left, right, left_label, right_label)
    return {"id": f"{payload.leftId}-vs-{payload.rightId}",
            "leftId": payload.leftId, "rightId": payload.rightId, **result}
