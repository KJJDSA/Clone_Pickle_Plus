const { BankAccount } = require("../models");

class MyPageRepository {
  lookupMyBankAccount = async ({ userId }) => {
    try {
      const myBankAccount = await BankAccount.findAll({ where: { userId } });
      return myBankAccount;
    } catch (error) {
      throw error;
    }
  };
  updateBankAccount = async ({ userId, ottService, ID, password }) => {
    try {
      const updateBankAccount = await BankAccount.update(
        { ottService, ID, password },
        { where: { userId } }
      );

      return updateBankAccount;
    } catch (error) {
      throw error;
    }
  };
}

module.exports = MyPageRepository;