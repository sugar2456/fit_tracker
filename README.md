# Fit Tracker

Fitbitの活動データを管理・分析するためのアプリケーションです。

## 機能

### 🗺️ 3D地図表示
- **CesiumJS**: 高品質な3D地球儀と地図表示
- **活動ルート**: GPSトラックポイントを3D地図上に可視化
- **インタラクティブ**: ズーム、回転、傾斜などの操作が可能
- **リアルタイム**: 活動データを動的に読み込み・表示

### 📊 データ分析
- 活動の総数、総距離、総カロリー、総時間
- 平均心拍数、最大心拍数
- 個別活動の詳細情報
- トラックポイントの詳細データ

### 🏗️ アーキテクチャ
- **ドメインモデル**: ビジネスロジックから独立
- **リポジトリ層**: データアクセスの抽象化
- **サービス層**: ビジネスロジックとデータ加工
- **テスト**: 包括的なテストスイート（97%カバレッジ）

## 使用方法

### 🌐 Webアプリケーション
1. 開発サーバーを起動: `npm run dev`
2. ブラウザで `http://localhost:3000` にアクセス
3. 「3D地図を見る」ボタンをクリックして `/map` ページに移動
4. 活動データが3D地図上に表示されます

### 💻 プログラムでの使用
```typescript
import { FileActivityDataRepository } from './repository/file';
import { ActivityDataService } from './services';

// リポジトリとサービスのインスタンスを作成
const repository = new FileActivityDataRepository();
const service = new ActivityDataService(repository);

// 活動データのサマリーを取得
const summary = await service.getActivitySummary('/path/to/data.xml');

// 利用可能なデータソース一覧を取得
const sources = await service.getAvailableDataSources();
```

## データ形式

現在はGarminのTrainingCenterDatabase形式（XML）をサポートしています。将来的にはFitbit REST APIからのデータ取得にも対応予定です。

## 開発

```bash
# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev

# ビルド
npm run build

# テスト実行
npm test

# テスト（ウォッチモード）
npm run test:watch

# テストカバレッジ
npm run test:coverage
```

## テスト

このプロジェクトには包括的なテストスイートが含まれています：

- **FileActivityDataRepository**: XMLファイルの読み込み、パース、エラーハンドリングのテスト
- **ActivityDataService**: ビジネスロジック、データ加工、統計計算のテスト

### テストカバレッジ
- 文のカバレッジ: 97.01%
- ブランチのカバレッジ: 70.74%
- 関数のカバレッジ: 100%
- 行のカバレッジ: 96.8%

## 拡張性

- リポジトリインターフェースにより、データソースの切り替えが容易
- ドメインモデルはビジネスロジックから独立
- サービス層で画面表示用のデータ変換を一元管理