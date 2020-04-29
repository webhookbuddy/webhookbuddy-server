export default {
  Query: {
    me: () => ({
      id: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      firstName: 'Lou',
      lastName: 'Ferigno',
      email: 'lou@email.com',
    }),
  },
};
