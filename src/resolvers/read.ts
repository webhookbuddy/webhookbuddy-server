import { Read } from '../models/read';

export default {
  Read: {
    reader: async (read: Read, _: unknown, { loaders }: any) =>
      await loaders.user.load(read.userId),
  },
};
