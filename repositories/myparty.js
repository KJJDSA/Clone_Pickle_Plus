const { Parties } = require("../models");
const { Members } = require("../models");
const { Users } = require("../models");
const { Op } = require("sequelize");

class MyPartyRepository {
  findMember = async ({ userId }) => {
    try {
      const member = await Members.findAll({
        where: { userId },
      });
      return member;
    } catch (error) {
      throw error;
    }
  };

  // 모든 파티 정보를 db에서 조회하는 함수
  lookupMyParty = async (partyId) => {
    try {
      const myParty = await Parties.findByPk(partyId);
      return myParty;
    } catch (error) {
      throw error;
    }
  };

  findMemberWithParty = async ({ userId, partyId }) => {
    try {
      const member = await Members.findOne({
        where: { userId, partyId },
      });
      return member;
    } catch (err) {
      throw error;
    }
  };

  // 특정 파티의 정보를 바꿈
  updateParty = async (partyId, ID, password) => {
    try {
      const updatePartyData = await Parties.update(
        { ID, password },
        { where: { partyId } }
      );

      return updatePartyData;
    } catch (error) {
      console.log(error);

      res.status(err.status || 400);
    }
  };

  findOtherMember = async ({ partyId }) => {
    try {
      const otherMembers = await Members.findAll({
        where: {
          [Op.and]: [
            { partyId },
          ]
        },
        // 폰번도 가져오고 ottService 도 가져오기!! 배열쓰면됨.
        include: [{
          model: Parties,
          attributes: ['ottService']
        },
        {
          model: Users,
          attributes: ['phone']
        }]
      });
      return otherMembers;
    } catch (error) {
      throw error
    }
  }
  exitParty = async ({ userId, partyId }) => {
    // 일단 테이블에서 삭☆제
    await Members.destroy({ where: { userId, partyId } })
    // numofMembers 가져오기(수정해야함)
    const party = await Parties.findByPk(partyId)
    const result = await Parties.update(
      { numOfMembers: party.numOfMembers - 1 },
      { where: { partyId } }
    );
    return result;
  }

  destroyParty = async ({ partyId }) => { // 파티원이 더 없으면 파티를 삭제
    await Parties.destroy({ where: { partyId } })
    return;
  }
}

module.exports = MyPartyRepository;
