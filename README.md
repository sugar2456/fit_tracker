# Fit Tracker

Fitbitの活動データを管理・分析するためのアプリケーションです。

## アーキテクチャ

このプロジェクトは以下のレイヤーで構成されています：

### ドメインモデル (`src/domain/`)
- `Position`: 位置情報（緯度・経度）
- `HeartRate`: 心拍数データ
- `Trackpoint`: GPSトラックポイント（時間、位置、高度、距離、心拍数）
- `Lap`: ラップ情報（時間、距離、カロリー、強度など）
- `Activity`: 活動情報（スポーツ種別、ラップの集合）
- `TrainingCenterDatabase`: 全体のデータベース構造

### リポジトリ層 (`src/repository/`)
- **インターフェース** (`interfaces/`): `ActivityDataRepository` - データアクセスの抽象化
- **ファイル実装** (`file/`): `FileActivityDataRepository` - XMLファイルからのデータ読み込み

### サービス層 (`src/services/`)
- `ActivityDataService`: ビジネスロジックを担当
  - データの加工・集計
  - 画面表示用のデータ変換
  - 統計情報の計算

## 使用方法

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
```

## 拡張性

- リポジトリインターフェースにより、データソースの切り替えが容易
- ドメインモデルはビジネスロジックから独立
- サービス層で画面表示用のデータ変換を一元管理