"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Members extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Members.belongsTo(models.Users, {
        foreignKey: "userId",
        sourceKey: "userId",
      });
      Members.belongsTo(models.Parties, {
        foreignKey: "partyId",
        sourceKey: "partyId",
      });
    }
  }
  Members.init(
    {
      memberId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      partyId: DataTypes.INTEGER,
      userId: DataTypes.INTEGER,
      isLeader: DataTypes.BOOLEAN,
      isMatched: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Members",
    }
  );

  // matchuser.associate = models => {
  //   /**
  //    * CompanyInformation안에 있는 "id값"을 "company_id라는 컬럼 이름"으로 Users모델에 새로운 컬럼으로 추가한다.
  //    */
  //   matchuser.hasMany(models.User, { foreignKey: "userId", sourceKey: "userId" });
  //   matchuser.hasMany(models.matchroom, { foreignKey: "matchroomId", sourceKey: "matchroomId" });
  // };
  return Members;
};
