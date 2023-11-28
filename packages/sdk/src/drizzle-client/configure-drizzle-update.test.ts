import configureDrizzleUpdate from './configure-drizzle-update';

describe.skip('configureDrizzleUpdate', () => {
  test('should update primary record and related join tables', async () => {
    // Mock the necessary dependencies
    const db = {
      update: jest.fn().mockReturnThis(),
      set: jest.fn().mockReturnThis(),
      returning: jest.fn().mockResolvedValue([{ id: 'primaryId' }]),
      delete: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
    };

    const config: any = {
      db,
      notionSchema: {
        projects: {
          title: 'title',
          relations: {
            '📝 invoices': 'invoices',
          },
          syncedColumns: {
            '📝 invoices': '🏗️ projects',
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

    const drizzleUpdate = configureDrizzleUpdate(
      config,
      'title',
      drizzleScheme
    );

    const result = await drizzleUpdate({
      id: 'recordId',
      invoices: ['value1'],
    } as any);

    // Assert the expected behavior
    expect(db.update).toHaveBeenCalledWith(drizzleScheme);
    expect(db.set).toHaveBeenCalledWith({
      id: 'recordId',
      column1: 'value1',
      column2: 'value2',
    });
    expect(db.returning).toHaveBeenCalled();
    expect(db.delete).toHaveBeenCalledWith(config.schema.relation1);
    expect(db.delete).toHaveBeenCalledWith(config.schema.relation2);
    expect(db.where).toHaveBeenCalledWith(expect.any(Function));
    expect(db.set).toHaveBeenCalledTimes(3);
    expect(db.returning).toHaveBeenCalledTimes(1);
    expect(db.delete).toHaveBeenCalledTimes(2);
    expect(result).toEqual({
      id: 'primaryId',
      relation1: ['relation1FirstId'],
      relation2: ['relation2FirstId'],
    });
  });
});
