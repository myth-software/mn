import { MountNotionConfig } from '@mountnotion/types';

export type CliInput = {
  args: string[];
};

export type OauthPagesChoices = {
  choices: string[];
};

// interface SelectedColumnConfig {
//   selections: [
//     | "consistent titles as 'name'"
//     | "automatic created_by"
//     | "automatic created_time"
//     | "automatic last_edited_by"
//     | "automatic last_edited_time"
//     | "consistent select colors using first color"
//     | "consistent multi_select colors using first color"
//     | "lowercase column names"
//     | "relations with leading emoji"
//   ];
// }

export const successActions = [
  'listing',
  'retrieving',
  'querying',
  'caching',
  'pass',
  'create',
  'update',
];
export const warnActions = ['warn'];
export const failActions = ['fail'];

export type LogInput = {
  action: string;
  page: {
    emoji: string;
    title: string;
  };
  message: string;
};

export type MountnCommand = {
  name: string;
  description: string;
  options?: Array<{ name: string; description: string }>;
  actionFactory: (
    config: MountNotionConfig
  ) => (...args: Array<unknown>) => void | Promise<void>;
};
