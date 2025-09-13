import { TrainingCenterDatabase } from '../../domain';

export interface ActivityDataRepository {
  /**
   * 指定された識別子から活動データを取得する
   * @param identifier データソースの識別子（ファイルパス、APIエンドポイント、IDなど）
   * @returns Promise<TrainingCenterDatabase> 活動データ
   */
  getActivityData(identifier: string): Promise<TrainingCenterDatabase>;

  /**
   * 利用可能な活動データソースの一覧を取得する
   * @returns Promise<string[]> 識別子の配列
   */
  getAvailableDataSources(): Promise<string[]>;
}
