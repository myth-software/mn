import * as children from './children';
import { del } from './delete';
import { deleteAll } from './delete-all';

export const blocks = {
  delete: del,
  deleteAll,
  children,
};
