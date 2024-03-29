import { MountnCommand } from '@mountnotion/types';
import authIntegrationKey from './auth-integration-key';
import authOauth from './auth-oauth';
import camp from './camp';
import campInteractive from './camp-interactive';
import configureLintColumns from './configure-lint-columns';
import configureLintRows from './configure-lint-rows';
import configureSchematics from './configure-schematics';
import configureWorkspace from './configure-workspace';
import copyColumnsValues from './copy-columns-values';
import createColumns from './create-columns';
import deleteRecursive from './delete-recursive';
import exportData from './export-data';
import fetch from './fetch';
import fixColumns from './fix-columns';
import fixRows from './fix-rows';
import lintColumns from './lint-columns';
import lintRows from './lint-rows';
import migrations from './migrations';
import renameColumns from './rename-columns';
import schematics from './scheme';
import selectPagesIntegrationKey from './select-pages-integration-key';
import selectPagesOauth from './select-pages-oauth';
import setup from './setup';

export const commands: Array<MountnCommand<any>> = [
  authIntegrationKey,
  authOauth,
  campInteractive,
  camp,
  configureLintColumns,
  configureLintRows,
  configureSchematics,
  configureWorkspace,
  copyColumnsValues,
  createColumns,
  deleteRecursive,
  exportData,
  fetch,
  fixColumns,
  fixRows,
  lintColumns,
  lintRows,
  migrations,
  renameColumns,
  schematics,
  selectPagesIntegrationKey,
  selectPagesOauth,
  setup,
];
