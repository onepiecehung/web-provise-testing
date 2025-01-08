import axios from 'axios';

import { Test, TestingModule } from '@nestjs/testing';

import { CompanyService } from './company-tree.service';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('CompanyService', () => {
  let service: CompanyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CompanyService],
    }).compile();

    service = module.get<CompanyService>(CompanyService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return all root companies when no id is passed', async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: [
        { id: '1', parentId: '0', name: 'Company A' },
        { id: '2', parentId: '0', name: 'Company B' },
        { id: '3', parentId: '1', name: 'Company A Child' },
        { id: '4', parentId: '2', name: 'Company B Child' },
      ],
    });
    mockedAxios.get.mockResolvedValueOnce({ data: [] });

    const result = await service.getCompanyTree();

    expect(result).toHaveLength(2);
    expect(result[0].name).toBe('Company A');
    expect(result[1].name).toBe('Company B');
    expect(result[0].children).toHaveLength(1);
    expect(result[1].children).toHaveLength(1);
  });

  it('should return a specific company and its children when a valid id is passed', async () => {
    const companies = [
      { id: '1', parentId: '0', name: 'Company A' },
      { id: '2', parentId: '1', name: 'Company A Child' },
      { id: '3', parentId: '1', name: 'Company A Child 2' },
    ];
    mockedAxios.get.mockResolvedValueOnce({ data: companies });
    mockedAxios.get.mockResolvedValueOnce({ data: [] });

    const result = await service.getCompanyTree('1');

    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Company A');
    expect(result[0].children).toHaveLength(2);
    expect(result[0].children[0].name).toBe('Company A Child');
    expect(result[0].children[1].name).toBe('Company A Child 2');
  });

  it('should return companies with parentId "0" if an invalid id is passed', async () => {
    const companies = [
      { id: '1', parentId: '0', name: 'Company A' },
      { id: '2', parentId: '0', name: 'Company B' },
    ];
    mockedAxios.get.mockResolvedValueOnce({ data: companies });
    mockedAxios.get.mockResolvedValueOnce({ data: [] });

    const result = await service.getCompanyTree('non-existent-id');
    expect(result).toHaveLength(2);
    expect(result[0].name).toBe('Company A');
    expect(result[1].name).toBe('Company B');
    expect(result[0].children).toHaveLength(0);
    expect(result[1].children).toHaveLength(0);
  });
});
