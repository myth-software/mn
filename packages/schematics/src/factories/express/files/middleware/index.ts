import create from './create.middleware';
import deleteById from './delete-by-id.middleware';
import getById from './get-by-id.middleware';
import query from './query.middleware';
import router from './router.middleware';
import updateById from './update-by-id.middleware';

export default {
  create,
  deleteById,
  getById,
  updateById,
  query,
  router,
};
