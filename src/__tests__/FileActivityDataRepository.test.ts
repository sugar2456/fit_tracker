import * as fs from 'fs/promises';
import * as path from 'path';
import { FileActivityDataRepository } from '../repository/file';
import { mockXmlData } from './mocks/mockData';

// fs/promises をモック
jest.mock('fs/promises');
const mockedFs = fs as jest.Mocked<typeof fs>;

// xml2js をモック
jest.mock('xml2js');
const xml2js = require('xml2js');

describe('FileActivityDataRepository', () => {
  let repository: FileActivityDataRepository;
  const mockDataDirectory = '/mock/data/directory';

  beforeEach(() => {
    repository = new FileActivityDataRepository(mockDataDirectory);
    jest.clearAllMocks();
  });

  describe('getActivityData', () => {
    it('should successfully parse XML file and return TrainingCenterDatabase', async () => {
      // Arrange
      const filePath = '/path/to/test.xml';
      const xmlContent = '<?xml version="1.0"?><TrainingCenterDatabase>...</TrainingCenterDatabase>';
      const mockParser = {
        parseStringPromise: jest.fn().mockResolvedValue(mockXmlData)
      };
      
      mockedFs.readFile.mockResolvedValue(xmlContent);
      xml2js.Parser.mockImplementation(() => mockParser);

      // Act
      const result = await repository.getActivityData(filePath);

      // Assert
      expect(mockedFs.readFile).toHaveBeenCalledWith(filePath, 'utf-8');
      expect(mockParser.parseStringPromise).toHaveBeenCalledWith(xmlContent);
      expect(result.activities).toHaveLength(1);
      expect(result.activities[0].sport).toBe('Running');
      expect(result.activities[0].id).toBe('2025-01-01T10:00:00.000Z');
    });

    it('should throw error when file reading fails', async () => {
      // Arrange
      const filePath = '/path/to/nonexistent.xml';
      const error = new Error('File not found');
      
      mockedFs.readFile.mockRejectedValue(error);

      // Act & Assert
      await expect(repository.getActivityData(filePath)).rejects.toThrow(
        'Failed to read activity data from file: /path/to/nonexistent.xml. Error: Error: File not found'
      );
    });

    it('should throw error when XML parsing fails', async () => {
      // Arrange
      const filePath = '/path/to/invalid.xml';
      const xmlContent = 'invalid xml content';
      const mockParser = {
        parseStringPromise: jest.fn().mockRejectedValue(new Error('Invalid XML'))
      };
      
      mockedFs.readFile.mockResolvedValue(xmlContent);
      xml2js.Parser.mockImplementation(() => mockParser);

      // Act & Assert
      await expect(repository.getActivityData(filePath)).rejects.toThrow(
        'Failed to read activity data from file: /path/to/invalid.xml. Error: Error: Invalid XML'
      );
    });
  });

  describe('getAvailableDataSources', () => {
    it('should return list of XML files in data directory', async () => {
      // Arrange
      const mockFiles = ['activity1.xml', 'activity2.xml', 'readme.txt', 'activity3.xml'];
      mockedFs.readdir.mockResolvedValue(mockFiles as any);

      // Act
      const result = await repository.getAvailableDataSources();

      // Assert
      expect(mockedFs.readdir).toHaveBeenCalledWith(mockDataDirectory);
      expect(result).toEqual([
        path.join(mockDataDirectory, 'activity1.xml'),
        path.join(mockDataDirectory, 'activity2.xml'),
        path.join(mockDataDirectory, 'activity3.xml')
      ]);
    });

    it('should return empty array when no XML files exist', async () => {
      // Arrange
      const mockFiles = ['readme.txt', 'config.json'];
      mockedFs.readdir.mockResolvedValue(mockFiles as any);

      // Act
      const result = await repository.getAvailableDataSources();

      // Assert
      expect(result).toEqual([]);
    });

    it('should throw error when directory reading fails', async () => {
      // Arrange
      const error = new Error('Permission denied');
      mockedFs.readdir.mockRejectedValue(error);

      // Act & Assert
      await expect(repository.getAvailableDataSources()).rejects.toThrow(
        `Failed to read data directory: ${mockDataDirectory}. Error: Error: Permission denied`
      );
    });
  });

  describe('constructor', () => {
    it('should use default data directory when not provided', () => {
      // Act
      const defaultRepository = new FileActivityDataRepository();

      // Assert
      expect(defaultRepository).toBeInstanceOf(FileActivityDataRepository);
    });

    it('should use provided data directory', () => {
      // Arrange
      const customDirectory = '/custom/data/path';

      // Act
      const customRepository = new FileActivityDataRepository(customDirectory);

      // Assert
      expect(customRepository).toBeInstanceOf(FileActivityDataRepository);
    });
  });
});
