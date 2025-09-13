import { TrainingCenterDatabase } from '../../domain';

export interface ActivityDataRepository {
  /**
   * 指定されたファイルパスから活動データを取得する
   * @param filePath ファイルパス
   * @returns Promise<TrainingCenterDatabase> 活動データ
   */
  getActivityData(filePath: string): Promise<TrainingCenterDatabase>;

  /**
   * 利用可能な活動データファイルの一覧を取得する
   * @returns Promise<string[]> ファイルパスの配列
   */
  getAvailableDataFiles(): Promise<string[]>;
}
