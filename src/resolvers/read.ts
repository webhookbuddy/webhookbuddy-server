export default {
  Read: {
    reader: async (read, _, { loaders }) =>
      await loaders.user.load(read.userId),
  },
};
