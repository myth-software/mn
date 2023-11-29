import 'dotenv/config;';
import * as postgres from 'postgres';
import configureDrizzleCreate from './configure-drizzle-create';

describe.skip('configureDrizzleCreate', () => {
  const sql = postgres();

  beforeAll(async () => {
    // Create the test table
    await sql`
      CREATE TABLE IF NOT EXISTS test_table (
        id SERIAL PRIMARY KEY,
        column1 TEXT,
        column2 TEXT,
        invoices TEXT[]
      );
    `;
  });

  afterAll(async () => {
    // Drop the test table
    await sql`DROP TABLE IF EXISTS test_table`;
  });

  test('should create primary record and related join tables', async () => {
    // Mock the necessary dependencies
    const config: any = {
      db,
      notionSchema: {
        projects: {
          title: 'title',
          relations: {
            '📝 invoices': 'invoices',
          },
        },
      },
      schema: {
        projects: {},
        invoices: {},
        invoicesProjects: {
          invoicesId: null,
          projectsId: null,
        },
      },
    };

    const drizzleScheme = {
      id: 'drizzleSchemeId',
      type: 'drizzleSchemeType',
    };

    const drizzleCreate = configureDrizzleCreate(
      config,
      'title',
      drizzleScheme
    );

    const result = await drizzleCreate({
      column1: 'value1',
      column2: 'value2',
      invoices: ['value3'],
    } as any);

    // Assert the expected behavior
    expect(result).toEqual({
      id: 'primaryId',
      invoices: ['relation1FirstId', 'relation2FirstId'],
    });
  });
});
