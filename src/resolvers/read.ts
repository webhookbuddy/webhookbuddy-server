import { Read } from '../models/read';

export default {
  Read: {
    reader: async (read: Read, _, { loaders }) =>
      await loaders.user.load(read.userId),
  },
};
