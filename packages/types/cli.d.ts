import { MountNotionConfig } from './schematics';

export declare type LogInput = {
  action: string;
  page?: {
    emoji: string;
    title: string;
  };
  message: string;
};

export declare type CliInput = {
  args: Array<string>;
};

export declare type MountnCommand<T = void> = {
  name: string;
  description: string;
  options?: Array<{ name: string; description: string }>;
  actionFactory: (
    config: MountNotionConfig
  ) => (...args: Array<unknown>) => T | Promise<T>;
};
