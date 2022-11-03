const { Parties } = require("../models");
const { Members } = require("../models");
const { Users } = require("../models");
const { Op } = require("sequelize");

class MatchRepository {
  findLeadersParty = async ({ ottService }) => {
    try {
      const availbleParty = await Parties.findAll({
        where: {
          [Op.and]: [
            { ottService },
            { hasLeader: false },
            { numOfMembers: { [Op.lt]: 4 } },
          ],
        },
      });
      return availbleParty;
    } catch (error) {
      throw error;
    }
  };
  createLeadersParty = async ({ ottService }) => {
    try {
      const createdParty = await Parties.create({
        ottService,
      });
      return createdParty;
    } catch (error) {
      throw error;
    }
  };
  updateLeadersParty = async ({ partyId, ID, password, numOfMembers }) => {
    try {
      const updatedParty = await Parties.update(
        {
          ID,
          password,
          hasLeader: true,
          numOfMembers,
        },
        { where: { partyId } }
      );
      // console.log(updatedParty);
      return updatedParty;
    } catch (error) {
      throw error;
    }
  };
  createLeadersMember = async ({ userId, partyId }) => {
    try {
      const createdMember = await Members.create({
        userId,
        partyId,
        isLeader: true,
        isMatched: false // 매칭이 된 상태인지 체크. 없으면 한명 나갔다 다시 들어올때 또 문자 감.
      });
      return createdMember;
    } catch (error) {
      throw error;
    }
  };
  findByPartyId = async ({ partyId }) => {
    try {
      const finalParty = await Parties.findByPk(partyId);
      return finalParty;
    } catch (error) {
      throw error;
    }
  };
  /*##################### MEMBER #########################*/
  findMemberParty = async ({ ottService }) => {
    try {
      const availbleParty = await Parties.findAll({
        where: {
          [Op.and]: [
            { ottService },
            // { hasLeader: false },
            { numOfMembers: { [Op.lt]: 4 } },
          ],
        },
      });
      return availbleParty;
    } catch (error) {
      throw error;
    }
  };
  findHasLeaderParty = async ({ ottService }) => {
    try {
      const HasLeaderParty = await Parties.findAll({
        where: {
          [Op.and]: [
            { ottService },
            { hasLeader: true }, // 파티장이 있는 방을 찾아본다.
            { numOfMembers: { [Op.lt]: 4 } },
          ],
        },
      });
      return HasLeaderParty;
    } catch (error) {
      throw error;
    }
  };
  findNoLeaderParty = async ({ ottService }) => {
    try {
      const NoLeaderParty = await Parties.findAll({
        where: {
          [Op.and]: [
            { ottService },
            { hasLeader: false }, // 파티장 없고 2명 이하인 방
            { numOfMembers: { [Op.lt]: 3 } },
          ],
        },
      });
      return NoLeaderParty;
    } catch (error) {
      throw error;
    }
  };
  createMemberParty = async ({ ottService }) => {
    try {
      const createdParty = await Parties.create({
        ottService,
        numOfMembers: 1,
        ID: null,
        password: null,
        hasLeader: false,
      });
      return createdParty;
    } catch (error) {
      throw error;
    }
  };
  updateMemberParty = async ({ partyId, numOfMembers }) => {
    try {
      const updatedParty = await Parties.update(
        {
          numOfMembers,
        },
        { where: { partyId } }
      );
      return updatedParty;
    } catch (error) {
      throw error;
    }
  }; // ?
  createMember = async ({ userId, partyId }) => {
    try {
      const createdMember = await Members.create({
        userId,
        partyId,
        isLeader: false,
        isMatched: false
      });
      return createdMember;
    } catch (error) {
      throw error;
    }
  };

  findMembersByPartyId = async ({ partyId }) => {
    try {
      const partyMember = await Members.findAll({ where: {partyId}});
      return partyMember;
    } catch (error) {
      throw (error)
    }
  }
  findAndCheck = async ({ partyId }) => {
    try {
      const phones = []
      const members = await Members.findAll({
        where: {
          [Op.and]: [
            { partyId },
            { isMatched: false }, // 파티아이디 맞고 매칭이 안된 사람만
          ],
        },
        include: {
          model: Users,
          attributes: ['phone']
        }
      })
      // console.log(members[0].dataValues)
      members.map(async (member) => {
        phones.push(member.dataValues.User.dataValues.phone) //쥰내많노..
        member.isMatched = true
        return await member.save()
      })
      return phones;
    } catch (error) {
      throw error
    }
  }
}
module.exports = MatchRepository;
