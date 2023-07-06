import { EmojiRequest } from './api-endpoints';
import { ColumnsLintRules, RowsLintRules } from './lint-rules';

export declare type AuthOptions = {
  strategies: Array<string>;
  usersDatabase: string;
  userColumn: string;
};

export declare type BasicOptions = {
  pageId: string;
  excludes: Array<string>;
  outDir: string;
  baseUrl: string;
  entities: string;
  javascriptizeColumns: boolean;
  debug: boolean;
};

export declare type MirageOptions = { locals: string } & BasicOptions &
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
  drizzle: string;
} & BasicOptions &
  AuthOptions;

export declare type ExpressOptions = ControllersOptions;

export declare type LocalsOptions = BasicOptions & {
  all?: string[];
};

export declare type I18nOptions = BasicOptions & {
  languages: ('en' | 'es')[];
};

export declare type Schematics = {
  name: string;
  disable?: boolean;
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
    lint: {
      columns: Partial<ColumnsLintRules>;
      rows: Partial<RowsLintRules>;
    };
  };
  options: { auth: AuthOptions; basic: BasicOptions };
  schematics: Schematics[];
};
