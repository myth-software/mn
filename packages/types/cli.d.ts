import { EmojiRequest } from './api-endpoints';
import { ColumnsStandards, RowsStandards } from './lint-rules';

export declare type AuthOptions = {
  strategies: Array<string>;
  usersDatabase: string;
  userColumn: string;
};

export declare type BasicOptions = {
  pageId: string;
  excludes: Array<string>;
  cacheFile: string;
  outDir: string;
  baseUrl: string;
  entities: string;
  javascriptizeColumns: boolean;
  debug: boolean;
};

export declare type MockApiOptions = { locals: string } & BasicOptions &
  AuthOptions;

export declare type RtkQueryOptions = BasicOptions & AuthOptions;

export declare type ControllersOptions = {
  /**
   * organization to import in loopback repository
   */
  org: string;
  accessorProperty: string;
  locals: string;
  public: Array<string>;
} & BasicOptions &
  AuthOptions;

export declare type ExpressOptions = {
  drizzle: string;
} & ControllersOptions &
  BasicOptions &
  AuthOptions;

export declare type LocalsOptions = BasicOptions & {
  all?: string[];
};

export declare type I18nOptions = BasicOptions & {
  languages: ('en' | 'es')[];
};

export declare type Schematics = {
  name: string;
  options: { auth: AuthOptions; basic: BasicOptions };
};

export type MountNotionConfig = {
  auth:
    | {
        strategy: 'integration-key';
        key: string;
      }
    | {
        strategy: 'oauth';
        key: string;
        availablePages: {
          page_id: string;
          title: string;
          icon: EmojiRequest;
        }[];
      };
  workspace: {
    selectedPages: string[];
    standards: {
      columns: Partial<ColumnsStandards>;
      rows: Partial<RowsStandards>;
    };
  };
  options: { auth: AuthOptions; basic: BasicOptions };
  schematics: Schematics[];
};
