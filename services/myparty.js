const MyPartyRepository = require("../repositories/myparty");
const Sens = require("./sendMessege");

class MyPartyService {
  constructor() {
    this.myPartyRepository = new MyPartyRepository();
    this.sens = new Sens();
  }

  lookupMyParty = async ({ userId }) => {
    try {
      const findMember = await this.myPartyRepository.findMember({ userId });
      // console.log(findMember);
      const lookupMyParty = [];
      for (let i = 0; i < findMember.length; i++) {
        let partyId = findMember[i].partyId;
        // console.log(partyId);
        let myParty = await this.myPartyRepository.lookupMyParty(partyId);
        myParty = {
          ...myParty.dataValues,
          isLeader: findMember[i].isLeader
        }
        lookupMyParty.push(myParty);
      }

      return lookupMyParty;
    } catch (error) {
      throw error;
    }
  };

  changeOttInfo = async ({ userId, partyId, ID, password }) => {
    try {
      const findMember = await this.myPartyRepository.findMemberWithParty({
        userId,
        partyId,
      });

      if (findMember.isLeader == false)
        throw {
          name: "권한",
          message: "아이디 비밀번호 수정은 리더만 가능합니다.",
        };

      const changedPartyData = await this.myPartyRepository.updateParty({
        partyId,
        ID,
        password,
      });

      return changedPartyData;
    } catch (err) {
      throw err;
    }
  };


  getOttInfo = async (partyId) => {
    try {
      const getOttInfoData = await this.myPartyRepository.findOneParty(partyId);
      return getOttInfoData;
    } catch (err) {
      throw err
    }
  };

  exitParty = async ({ userId, partyId }) => {
    try {
      // 일단 탈퇴 해주기
      const result = await this.myPartyRepository.exitParty({ userId, partyId });

      // 다른팀원들에게 메시지 보내기
      const otherMembers = await this.myPartyRepository.findOtherMember({ partyId });
      if (!otherMembers.length) {
        await this.myPartyRepository.destroyParty({ partyId });
        return console.log('남은 파티원이 없어 파티 삭제');
      };
      const ottService = otherMembers[0].dataValues.Party.dataValues.ottService;
      const messageLeader =
        `[티끌플러스] ${ottService} 탈퇴자 발생! 비밀번호 변경해주세요!`
      const messageMember =
        `[티끌플러스] 파티장이 ${ottService} 아이디 혹은 비밀번호를 변경할거예요!`
      for (let i = 0; i < otherMembers.length; i++) { // for of 보다 쪼끔 더 빠르넹
        if (otherMembers[i].dataValues.isLeader) {
          // this.sens.send_message(otherMembers[i].dataValues.User.dataValues.phone, messageLeader)
          console.log(messageLeader);
        } else {
          // this.sens.send_message(otherMembers[i].dataValues.User.dataValues.phone, messageMember)
          console.log(messageMember);
        }
      }
      return;
    } catch (error) {
      throw error;
    }
  }

}

module.exports = MyPartyService;
