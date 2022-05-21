const formContractQuery = (user) => {
  const { id: userId, type: userType } = user;

  if (userType === 'client') {
    return { ClientId: userId };
  }

  return { ContractorId: userId };
};

module.exports = { formContractQuery };
