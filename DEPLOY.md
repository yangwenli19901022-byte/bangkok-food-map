# 曼谷美食地图 — 部署指南

项目已配置好自动部署，以下是几种发布方式，按推荐程度排序。

---

## 方案一：GitHub Pages（推荐，免费）

使用 GitHub Actions 自动构建 React 项目并部署到 GitHub Pages。每次推送代码到 GitHub 都会自动更新网站。

### 步骤

1. **在 GitHub 创建新仓库**
   - 登录 [github.com](https://github.com)
   - 点击右上角 `+` → `New repository`
   - 仓库名称建议：`bangkok-food-map`（可自定义）
   - 选择 `Public`（私有仓库无法使用免费 GitHub Pages）
   - 点击 `Create repository`

2. **把本地代码推送到 GitHub**
   ```bash
   cd /Users/bytedance/Documents/曼谷美食地图
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/你的用户名/你的仓库名.git
   git push -u origin main
   ```

3. **启用 GitHub Pages**
   - 进入仓库页面 → `Settings` → `Pages`
   - `Source` 选择 `GitHub Actions`
   - 无需其他操作，工作流文件已配置好

4. **等待部署完成**
   - 进入仓库的 `Actions` 标签页
   - 等待工作流运行完成（约 1-2 分钟）
   - 完成后访问：`https://你的用户名.github.io/你的仓库名/`

---

## 方案二：直接部署 preview.html（最快）

如果你不想配置 GitHub Actions，可以直接部署 `preview.html`。这是一个完全独立的静态文件，不依赖 npm 构建。

### 部署到 GitHub Pages（静态文件版）

```bash
cd /Users/bytedance/Documents/曼谷美食地图
git init
git add preview.html
git commit -m "deploy"
git branch -M main
git remote add origin https://github.com/你的用户名/你的仓库名.git
git push -u origin main
```

然后在仓库 `Settings` → `Pages` → `Source` 选择 `Deploy from a branch`，分支选 `main`，文件夹选 `/(root)`。

访问：`https://你的用户名.github.io/你的仓库名/preview.html`

### 部署到 Vercel（推荐国内访问）

1. 登录 [vercel.com](https://vercel.com)，用 GitHub 账号登录
2. 点击 `Add New Project`
3. 导入你的 GitHub 仓库
4. 框架预设选 `Vite`，点击 `Deploy`
5. 等待部署完成，获得 `xxx.vercel.app` 域名

### 部署到 Netlify

1. 登录 [netlify.com](https://netlify.com)
2. 拖拽 `dist-static/` 文件夹到 Netlify 部署页面
3. 自动获得 `xxx.netlify.app` 域名

---

## 方案三：使用自定义域名

如果你有自己的域名，可以在 GitHub Pages / Vercel / Netlify 中配置：

1. 在域名服务商添加 CNAME 记录：
   - 主机记录：`@` 或 `www`
   - 记录值：你的 Pages 域名（如 `你的用户名.github.io`）
2. 在托管平台设置中添加自定义域名
3. 等待 DNS 生效（通常 5-30 分钟）

---

## 常见问题

### Q：部署后地图不显示？
A：检查浏览器控制台是否有 CORS 错误。Leaflet 地图瓦片需要网络访问，确保你的网站是 HTTPS。

### Q：图片加载失败？
A：项目中使用了 Unsplash 的示例图片链接，这些链接长期有效。如果失效，可以替换为本地图片或自己的 CDN 链接。

### Q：如何更新网站内容？
A：
- 如果用了 GitHub Actions：修改代码 → `git push`，自动重新部署
- 如果直接部署静态文件：替换文件后重新上传

### Q：数据如何更新？
A：编辑 `src/data/places.json` 文件，添加或修改商家信息，然后重新推送。GitHub Actions 会自动重新构建。

---

## 项目结构说明

```
曼谷美食地图/
├── src/                    # React 源代码
│   ├── App.jsx             # 主应用组件
│   ├── components/         # 组件
│   └── data/places.json    # 商家数据
├── preview.html            # 独立静态预览版（可直接部署）
├── dist-static/            # 静态部署包
│   └── index.html
├── .github/workflows/      # GitHub Actions 配置
│   └── deploy.yml
├── vite.config.js          # Vite 构建配置
└── DEPLOY.md               # 本文件
```

- **`src/`**：React 正式版源代码，功能最全
- **`preview.html`** / **`dist-static/`**：独立静态版本，无需构建，适合快速部署

---

如需帮助，随时告诉我！
