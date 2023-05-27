import { MountnCommand } from '@mountnotion/types';
import applySchematics from './apply-schematics';
import authIntegrationKey from './auth-integration-key';
import authOauth from './auth-oauth';
import configureStandardsColumns from './configure-standards-columns';
import configureStandardsRows from './configure-standards-rows';
import configureWorkspace from './configure-workspace';
import fetch from './fetch';
import fixColumns from './fix-columns';
import fixRows from './fix-rows';
import lintColumns from './lint-columns';
import lintRows from './lint-rows';
import selectPagesIntegrationKey from './select-pages-integration-key';
import selectPagesOauth from './select-pages-oauth';

export const commands: Array<MountnCommand> = [
  applySchematics,
  fixColumns,
  fixRows,
  authIntegrationKey,
  authOauth,
  configureStandardsColumns,
  configureStandardsRows,
  configureWorkspace,
  fetch,
  lintColumns,
  lintRows,
  selectPagesIntegrationKey,
  selectPagesOauth,
];
