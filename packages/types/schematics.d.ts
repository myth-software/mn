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
  caches: string;
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

export declare type ExpressOptions = ControllersOptions & {
  actionRouter: booelan;
  eject: boolean;
};

export declare type LocalsOptions = BasicOptions & {
  all?: string[];
};

export declare type I18nOptions = BasicOptions & {
  languages: ('en' | 'es')[];
};

export declare type DrizzleOptions = BasicOptions;

export declare type Schematics =
  | {
      name: string;
      disable?: boolean;
    } & DrizzleOptions &
      I18nOptions &
      LocalsOptions &
      ExpressOptions &
      ControllersOptions &
      RtkQueryOptions &
      MirageOptions &
      BasicOptions &
      AuthOptions;

export type MountNotionConfig = {
  extends?: string;
  selectedPages: string[];
  lint: {
    [P in keyof ColumnsLintRules | RowsLintRules]?: 'error' | 'warn';
  };
  auth: 'key' | 'oauth';
  schematicDefaults: {
    baseUrl?: string;
    caches?: string;
    strategies?: string[];
    userColumn?: string;
    excludes?: string[];
  };
  schematics: Schematics[];
};
