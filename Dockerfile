# Node.js 23の公式イメージを使用
FROM node:23-slim

# 開発に必要なパッケージをインストール
RUN apt-get update && apt-get install -y --no-install-recommends \
    git \
    curl \
    bash \
    openssh-client \
    ca-certificates

# 作業ディレクトリを設定
WORKDIR /app

# package.jsonとpackage-lock.jsonをコピー
COPY package*.json ./

# 依存関係をインストール
RUN npm ci

# アプリケーションのソースコードをコピー
COPY . .

# 既存のnodeユーザー・グループのIDを調整し、権限を設定
RUN chown -R node:node /app

USER node

# ポート3000を公開
EXPOSE 3000

# 開発用コマンド（dev container用）
CMD ["npm", "run", "dev"]
