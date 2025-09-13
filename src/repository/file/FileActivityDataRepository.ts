import * as fs from 'fs/promises';
import * as path from 'path';
import * as xml2js from 'xml2js';
import { ActivityDataRepository } from '../interfaces';
import { TrainingCenterDatabase, TrainingCenterDatabaseImpl } from '../../domain';

export class FileActivityDataRepository implements ActivityDataRepository {
  private readonly dataDirectory: string;

  constructor(dataDirectory: string = '/home/butterfly/source/fit_tracker/src/app/data') {
    this.dataDirectory = dataDirectory;
  }

  async getActivityData(filePath: string): Promise<TrainingCenterDatabase> {
    try {
      const xmlContent = await fs.readFile(filePath, 'utf-8');
      const parser = new xml2js.Parser({
        explicitArray: true,
        mergeAttrs: false,
        explicitRoot: true
      });

      const result = await parser.parseStringPromise(xmlContent);
      return TrainingCenterDatabaseImpl.fromXmlData(result);
    } catch (error) {
      throw new Error(`Failed to read activity data from file: ${filePath}. Error: ${error}`);
    }
  }

  async getAvailableDataFiles(): Promise<string[]> {
    try {
      const files = await fs.readdir(this.dataDirectory);
      return files
        .filter(file => file.endsWith('.xml'))
        .map(file => path.join(this.dataDirectory, file));
    } catch (error) {
      throw new Error(`Failed to read data directory: ${this.dataDirectory}. Error: ${error}`);
    }
  }
}
