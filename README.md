# Fit Tracker

フィットネス目標を追跡し、健康的な生活をサポートするNext.jsアプリケーションです。

## 機能

- 🏃‍♂️ 運動記録: 日々の運動を記録し、進捗を可視化
- 📊 データ分析: 詳細な統計とグラフで成果を確認
- 🎯 目標設定: 個人の目標を設定し、達成をサポート

## 技術スタック

- **フレームワーク**: Next.js 15
- **言語**: TypeScript
- **スタイリング**: Tailwind CSS
- **リンター**: ESLint
- **コンテナ**: Docker

## セットアップ

### Dockerを使用した開発

1. Docker Composeを使用してアプリケーションを起動:
```bash
docker compose up --build
```

2. ブラウザで `http://localhost:3000` にアクセス

### ローカル開発

1. 依存関係をインストール:
```bash
npm install
```

2. 開発サーバーを起動:
```bash
npm run dev
```

3. ブラウザで `http://localhost:3000` にアクセス

## 利用可能なスクリプト

- `npm run dev`: 開発サーバーを起動
- `npm run build`: 本番用ビルドを作成
- `npm run start`: 本番サーバーを起動
- `npm run lint`: ESLintでコードをチェック

## プロジェクト構造

```
fit_tracker/
├── src/
│   └── app/
│       ├── layout.tsx
│       ├── page.tsx
│       └── globals.css
├── public/
├── Dockerfile
├── docker-compose.yml
└── package.json
```
