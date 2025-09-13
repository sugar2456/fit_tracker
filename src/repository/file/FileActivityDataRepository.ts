import * as fs from 'fs/promises';
import * as path from 'path';
import * as xml2js from 'xml2js';
import { Dirent } from 'fs';
import { ActivityDataRepository } from '../interfaces';
import { TrainingCenterDatabase, TrainingCenterDatabaseImpl } from '../../domain';

export class FileActivityDataRepository implements ActivityDataRepository {
  private readonly dataDirectory: string;

  constructor(dataDirectory: string = '/home/butterfly/source/fit_tracker/src/app/data') {
    this.dataDirectory = dataDirectory;
  }

  async getActivityData(identifier: string): Promise<TrainingCenterDatabase> {
    try {
      const xmlContent = await fs.readFile(identifier, 'utf-8');
      const parser = new xml2js.Parser({
        explicitArray: true,
        mergeAttrs: false,
        explicitRoot: true
      });

      const result = await parser.parseStringPromise(xmlContent);
      return TrainingCenterDatabaseImpl.fromXmlData(result);
    } catch (error) {
      throw new Error(`Failed to read activity data from file: ${identifier}. Error: ${error}`);
    }
  }

  async getAvailableDataSources(): Promise<string[]> {
    try {
      const files = await fs.readdir(this.dataDirectory) as (string | Dirent)[];
      return files
        .filter(file => {
          const fileName = typeof file === 'string' ? file : file.name;
          return fileName.endsWith('.xml');
        })
        .map(file => {
          const fileName = typeof file === 'string' ? file : file.name;
          return path.join(this.dataDirectory, fileName);
        });
    } catch (error) {
      throw new Error(`Failed to read data directory: ${this.dataDirectory}. Error: ${error}`);
    }
  }
}
