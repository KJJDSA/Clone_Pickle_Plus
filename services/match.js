const MatchRepository = require("../repositories/match");

class MatchService {
  constructor() {
    this.matchRepository = new MatchRepository();
  }

  matchLeader = async ({ userId, ottService, ID, password }) => {
    try {
      const availbleParty = await this.matchRepository.findLeadersParty({
        ottService,
      });
      if (availbleParty) {
        availbleParty.sort((a, b) => {
          return a.createdAt - b.createdAt;
        });
      } else {
        availbleParty = await this.matchRepository.createLeadersParty({
          ottService,
        });
      }
      const partyId = availbleParty[0].partyId;
      const numOfMembers = availbleParty[0].numOfMembers + 1;
      const updateLeadersParty = await this.matchRepository.updateLeadersParty({
        partyId,
        ID,
        password,
        numOfMembers,
      });
      const createLeadersMember =
        await this.matchRepository.createLeadersMember({ userId, partyId });
      return updateLeadersParty, createLeadersMember;
    } catch (error) {
      throw error;
    }
  };


  matchMember = async ({ userId, ottService }) => {
    try {
      // 3명 이하인 방만 찾아옴
      const availbleParty = await this.matchRepository.findMemberParty({ //복수 오타 수정
        ottService,
      });
      // 3명이하인 방이 있을경우
      if (availbleParty.length) {
        // 3명 이하고 파티장 존재하는 방을 찾아봄
        const hasLeaderParty = await this.matchRepository.findHasLeaderParty({
          ottService,
        });
        console.log(hasLeaderParty)
        // 3명이하 파티장 있는 방이 있을경우
        if (hasLeaderParty.length) {
          hasLeaderParty.sort((a, b) => {
            return a.createdAt - b.createdAt;
          });
          console.log(hasLeaderParty);
          const partyId = hasLeaderParty[0].partyId
          const numOfMembers = hasLeaderParty[0].numOfMembers + 1;
          // 해당 파티 레코드의 numOfMembers 를 1늘려줌
          await this.matchRepository.updateMemberParty({
            partyId,
            numOfMembers
          });
          // Members 테이블에 매칭한 유저 생성함
          await this.matchRepository.createMember({ userId, partyId })
          console.log(` ${partyId}번 파티에 매칭 / ${numOfMembers - 1} -> ${numOfMembers} / 파티장 O`)
          if (numOfMembers === 4) {
            console.log(`${partyId} 번 파티의 매칭이 성공했어요!`)
            return `${partyId} 번 파티의 매칭이 성공했어요!`
          }
          return ` ${partyId}번 파티에 매칭 / ${numOfMembers - 1} -> ${numOfMembers} / 파티장 O`;

          // 파티장 있는 방이 없는 경우
        } else {
          // 파티장 없고 2명 이하인 방 찾기(하나는 파티장 자리)
          const noLeaderParty = await this.matchRepository.findNoLeaderParty({ ottService })
          if (noLeaderParty.length) {
            noLeaderParty.sort((a, b) => {
              return a.createdAt - b.createdAt;
            });
            const partyId = noLeaderParty[0].partyId
            const numOfMembers = noLeaderParty[0].numOfMembers + 1;
            // 가장 오래된 파티 numOfMembers를 1 늘려줌
            await this.matchRepository.updateMemberParty({
              partyId,
              numOfMembers
            });
            // Members 테이블에 매칭한 유저 생성함
            await this.matchRepository.createMember({ userId, partyId })
            console.log(`${partyId}번 파티에 매칭 / ${numOfMembers - 1} -> ${numOfMembers} / 파티장 X `)
            return `${partyId}번 파티에 매칭 / ${numOfMembers - 1} -> ${numOfMembers} / 파티장 X `
            // 3명 이하인 파티는 있는데 파티장이 들어가야 하는 방만 있는 경우
          } else {
            const noLeaderParty = await this.matchRepository.createMemberParty({
              ottService,
            });
            const partyId = noLeaderParty.partyId;
            await this.matchRepository.createMember({ userId, partyId })
            console.log(`모든 파티가 꽉 차서 ${partyId}번 파티를 하나 만들었어요. 파티장X`)
            return `모든 파티가 꽉 차서 ${partyId}번 파티를 하나 만들었어요. 파티장X`;
          }
        }
        // 모든 파티가 4명씩 꽉 차있을 경우
      } else {
        const noLeaderParty = await this.matchRepository.createMemberParty({
          ottService,
        });
        const partyId = noLeaderParty.partyId;
        await this.matchRepository.createMember({ userId, partyId })
        console.log(`모든 파티가 꽉 차서 ${partyId}번 파티를 하나 만들었어요. 파티장X`)
        return `모든 파티가 꽉 차서 ${partyId}번 파티를 하나 만들었어요. 파티장X`;
      }
    } catch (error) {
      throw error;
    }
  };
}


module.exports = MatchService;
