import { MountnCommand } from '@mountnotion/types';
import applyMigrations from './apply-migrations';
import applySchematics from './apply-schematics';
import authIntegrationKey from './auth-integration-key';
import authOauth from './auth-oauth';
import camp from './camp';
import campInteractive from './camp-interactive';
import configureLintColumns from './configure-lint-columns';
import configureLintRows from './configure-lint-rows';
import configureSchematics from './configure-schematics';
import configureWorkspace from './configure-workspace';
import deleteRecursive from './delete-recursive';
import fetch from './fetch';
import fixColumns from './fix-columns';
import fixRows from './fix-rows';
import lintColumns from './lint-columns';
import lintRows from './lint-rows';
import renameColumns from './rename-columns';
import selectPagesIntegrationKey from './select-pages-integration-key';
import selectPagesOauth from './select-pages-oauth';
import setup from './setup';

export const commands: Array<MountnCommand> = [
  applyMigrations,
  applySchematics,
  authIntegrationKey,
  authOauth,
  campInteractive,
  camp,
  configureLintColumns,
  configureLintRows,
  configureSchematics,
  configureWorkspace,
  deleteRecursive,
  fetch,
  fixColumns,
  fixRows,
  lintColumns,
  lintRows,
  renameColumns,
  selectPagesIntegrationKey,
  selectPagesOauth,
  setup,
];
