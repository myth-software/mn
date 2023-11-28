import { getJoinTable } from './get-join-table.util';

describe('getJoinTable', () => {
  const relatedColumn = '📝 invoices';
  const SCHEME = {
    title: 'projects',
    id: '85e460aa-8a71-4193-99e5-ed89180a5b2e',
    icon: '🏗️',
    cover: '',
    description: '',
    columns: {
      '👥 project managers': 'relation',
      '📝 invoices': 'relation',
      name: 'title',
    },
    options: null,
    relations: {
      '👥 project managers': 'team members',
      '📝 invoices': 'invoices',
    },
    syncedColumns: {
      '👥 project managers': '🏗️ project manager on projects',
      '📝 invoices': '🏗️ projects',
    },
    mappings: {},
    rollups: null,
    rollupsOptions: null,
  } as const;
  const values = {
    id: '137ba09a-0570-4d03-865c-c9c3359656a5',
    invoices: [
      'b78fc9a9-d42d-4cd4-ba78-949f43d1f409',
      '9faf06c1-f5fb-4b74-ba1d-75253509ba74',
    ],
  };
  test('returns correct values', () => {
    const result = getJoinTable(relatedColumn, SCHEME, {
      primaryId: values.id,
      relatedIds: values.invoices,
    });

    expect(result.constName).toBe('invoicesProjects');
    expect(result.tableName).toBe('invoices_projects');
    expect(result.first).toBe('invoices');
    expect(result.second).toBe('projects');
    expect(result.firstId).toBe('invoicesId');
    expect(result.secondId).toBe('projectsId');
    expect(result.firstName).toBe('invoices');
    expect(result.secondName).toBe('projects');
    expect(result.relatedColumn).toBe('📝 invoices');
    expect(result.baseTable).toBe('projects');
    expect(result.firstValue).toEqual(values.invoices);
    expect(result.secondValue).toBe(values.id);
    expect(result.primaryId).toBe(values.id);
    expect(result.relatedIds).toEqual(values.invoices);
  });

  test('throws error when relations are missing', () => {
    const relationlessScheme = {
      ...SCHEME,
      relations: null,
    } as const;

    expect(() => {
      getJoinTable(relatedColumn, relationlessScheme, {
        primaryId: values.id,
        relatedIds: values.invoices,
      });
    }).toThrow('unexpected missing relations');
  });
});
