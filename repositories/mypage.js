const { BankAccounts } = require("../models");
const { BankCards } = require("../models");

class MyPageRepository {
  lookupMyBankAccount = async ({ userId }) => {
    try {
      const myBankAccount = await BankAccounts.findAll({ where: { userId } });
      return myBankAccount;
    } catch (error) {
      throw error;
    }
  };
  updateBankAccount = async ({ userId, ottService, ID, password }) => {
    try {
      const updateBankAccount = await BankAccounts.update(
        { ottService, ID, password },
        { where: { userId } }
      );

      return updateBankAccount;
    } catch (error) {
      throw error;
    }
  };

  /** ############################### 카드 #################################### */

  createCard = async ({ bank, card, MMYY, birth, password, userId }) => {
    try {
      let createCard = await BankCards.create(
        { bank, card, MMYY, birth, password, userId }
      );
      return {
        bankcardId: createCard.dataValues.bankcardId,
        userId: createCard.dataValues.userId,
        bank: createCard.dataValues.bank,
        card: createCard.dataValues.card
      };
    } catch (error) {
      throw error
    }
  };

  cardList = async ({ userId }) => {
    try {
      const results = await BankCards.findAll({
        where: { userId },
        attributes: { exclude: ['birth', 'MMYY', 'password', 'createdAt', 'updatedAt'] }
      });
      return results;
    } catch (error) {
      throw error
    }
  };

  cardEdit = async ({ bank, card, MMYY, birth, password, userId, BankCardId }) => {
    try {
      const updateCount = await BankCards.update({ bank, card, MMYY, birth, password, userId }, {
        where: { BankCardId }
      });
      return updateCount;
    } catch (error) {
      throw error
    }
  };

  cardIsExist = async ({ BankCardId }) => {
    try {
      const isExist = await BankCards.findByPk(BankCardId);

      return isExist;
    } catch (error) {
      throw error
    }
  };
  cardDelete = async ({ BankCardId, userId }) => {
    try {
      const deleteCount = await BankCards.destroy({
        where: { BankCardId, userId },
      });

      return deleteCount;
    } catch (error) {
      throw error
    }
  };
}

module.exports = MyPageRepository;
