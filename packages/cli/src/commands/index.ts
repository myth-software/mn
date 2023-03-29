import { MountnCommand } from '../types';
import applySchematics from './apply-schematics';
import applyStandardsColumns from './apply-standards-columns';
import applyStandardsRows from './apply-standards-rows';
import authIntegrationKey from './auth-integration-key';
import authOauth from './auth-oauth';
import configureStandardsColumns from './configure-standards-columns';
import configureStandardsRows from './configure-standards-rows';
import configureWorkspace from './configure-workspace';
import fetch from './fetch';
import gradeStandardsColumns from './grade-standards-columns';
import gradeStandardsRows from './grade-standards-rows';
import selectPagesIntegrationKey from './select-pages-integration-key';
import selectPagesOauth from './select-pages-oauth';

export const commands: Array<MountnCommand> = [
  applySchematics,
  applyStandardsColumns,
  applyStandardsRows,
  authIntegrationKey,
  authOauth,
  configureStandardsColumns,
  configureStandardsRows,
  configureWorkspace,
  fetch,
  gradeStandardsColumns,
  gradeStandardsRows,
  selectPagesIntegrationKey,
  selectPagesOauth,
];
