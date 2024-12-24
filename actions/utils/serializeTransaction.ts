const serializeTransaction = (obj) => {
  const serialize = { ...obj };

  if (obj.balance) {
    serialize.balance = obj.balance.toNumber();
  }

  if (obj.amount) {
    serialize.amount = obj.amount.toNumber();
  }

  return serialize;
};

export default serializeTransaction;
