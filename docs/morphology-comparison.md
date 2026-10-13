# 形态对比

形态对比页面通过后端自动计算六组参数：高度、最大腹径、口径、足径、高腹径比和最大腹径的相对高度。左侧可选择历史器物或使用当前上传的重建模型，右侧可选择五件历史参考器物。两个查看器支持同步旋转和缩放。

## 运行

形态对比可独立运行，不需要下载 TripoSR 或安装 PyTorch。在项目根目录使用 PowerShell：

```powershell
python -m venv backend/.venv
backend/.venv/Scripts/python.exe -m pip install -r backend/requirements-morphology.txt
backend/.venv/Scripts/python.exe -m uvicorn app.main:app --app-dir backend --host 127.0.0.1 --port 8000
```

另开终端启动前端：

```powershell
npm ci
npm run dev
```

打开 `http://localhost:5173/comparison`。前端默认访问 `http://localhost:8000`，可通过 `.env.local` 中的 `VITE_COMPARISON_BASE` 单独配置对比服务地址，未设置时使用 `VITE_RECONSTRUCT_BASE`。本模块始终调用真实测量接口。

## 测量方法

- 竖直轴为 Y 轴，所有参数按器物高度统一缩放至 30，单位为归一化单位。
- GLB：合并场景节点并应用节点变换，在高度的 0.5%–99.5% 之间取 101 个水平截面。每个截面的外径为其凸包上两点的最大距离。
- 最大腹径：采样截面外径的最大值。腹部位置为该截面距底部的高度占比；多个相近最大截面取平均位置。
- 口径、足径：分别取顶部、底部邻近 3% 高度范围内截面外径的中位数，因此为外轮廓估计，不测量内孔或胎壁厚度。
- 历史器物：从现有 `[半径, 高度]` 轮廓自动计算，最大半径的两倍为腹径，首尾端半径的两倍为足径、口径。
- 腹部位置小于 40% 为偏下，大于 60% 为偏上，其余为居中。
- 差异洞察由归一化口径、足径、高腹径比及腹部位置的差值生成。

历史参考轮廓位于 `backend/app/morphology_catalog.json`，来自 `src/mock/data.ts` 中的五件现有样例。新增或修改参考器物时，应同步两端目录数据。

## 接口

### POST /api/measure

请求二选一：

```json
{"artifactId": "song-ruyao"}
```

```json
{"modelUrl": "http://localhost:8000/files/11ae72b9-178f-473f-bba8-609258ecd712/mesh.glb"}
```

返回字段：`height`、`maxBellyDiameter`、`mouthDiameter`、`footDiameter`、`heightBellyRatio`、`bellyPosition`、`bellyPositionLabel`、`shape`、`source`、`method`、`unit`。`source` 为 `mesh` 或 `profile`，`method` 为 `自动提取`。

`modelUrl` 解析为本服务 `backend/outputs/{taskId}.glb` 文件，不下载远程 URL。模型必须处于 Y 轴竖直坐标系；三维重建流程已按此坐标系导出。

### POST /api/compare

```json
{"leftId": "song-ruyao", "rightId": "ming-qinghua"}
```

上传模式额外传 `leftModelUrl`，此时测量实际 GLB，`leftId` 仅作为对比标识。接口也支持 `rightModelUrl`。

返回：`id`、`leftId`、`rightId`、`rows`、`insight`、`leftLabel`、`rightLabel`、`leftMeasurement`、`rightMeasurement`。

未知器物或不存在的模型返回 404；无效请求或无法测量的几何返回 422。

## 验证

```powershell
Push-Location backend
.venv/Scripts/python.exe -m unittest test_morphology -v
Pop-Location
npm run build
```

测试覆盖圆柱尺寸、缩放和平移不变性、轮廓腹部位置、无效几何、历史对比、GLB 场景变换及上传对比、接口异常输入。
