import { EntityMap, QueryDatabaseParameters } from '@mountnotion/types';

export interface InfrastructureOptions<T = EntityMap> {
  id?: string;
  query?: Omit<QueryDatabaseParameters, 'database_id'>;
  data?: T;
}
