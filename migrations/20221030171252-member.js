"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Members", {
      memberId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      partyId: {
        type: Sequelize.INTEGER,
        references: {
          model: "Parties", // Partys 모델에서
          key: "partyId", // 그 아이디 값을 참고합니다.
        },
      },
      userId: {
        type: Sequelize.INTEGER,
        references: {
          model: "Users", // User 모델에서
          key: "userId", // 그 아이디 값을 참고합니다.
        },
      },
      isLeader: {
        type: Sequelize.BOOLEAN,
      },
      isMatched: {
        type: Sequelize.BOOLEAN,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Members");
  },
};
