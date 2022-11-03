const MatchRepository = require("../repositories/match");
const Sens = require("./sendMessege");

class MatchService {
  constructor() {
    this.matchRepository = new MatchRepository();
    this.sens = new Sens();
  }

  matchLeader = async ({ userId, ottService, ID, password }) => {
    try {
      const availableParty = await this.matchRepository.findLeadersParty({
        ottService,
      });
      if (availableParty.length > 0) {
        availableParty.sort((a, b) => {
          return a.createdAt - b.createdAt;
        });
        
        // 리더가 없는 방의 수 만큼 for문 돌림
        for ( let i = 0; i < availableParty.length; i++ ) {

          // 이 파티 아이디
          const partyId = availableParty[i].dataValues.partyId;

          // 이 파티 아이디에 해당하는 파티의 파티원 불러오기
          const hasSamePartyIdUser = 
            (await MatchRepository.findMembersByPartyId({partyId}))
              .map(x => x.dataValues.userId);
          console.log('해당 파티에 있는 유저들: ', hasSamePartyIdUser);

          // 지금 로그인 한 유저 아이디 정보 받아오기
          const thisUserId = userId;
          console.log('로그인 된 유저의 아이디: ', thisUserId);
          
          for ( let j = 0 ; j < hasSamePartyIdUser.length; j++ ) {
            // 만약 현재 유저 아이디와 중복되는 유저가 파티에 있다면
            if ( thisUserId === hasSamePartyIdUser[j] )
              // 에러 발생
              throw Error("이미 파티원으로 가입된 파티에는 파티장으로 가입하실 수 없습니다.");
          }

        }

        const partyId = availableParty[0].partyId;
        console.log(partyId)
        const numOfMembers = (availableParty[0].numOfMembers += 1);
        await this.matchRepository.updateLeadersParty({
          partyId,
          ID,
          password,
          numOfMembers,
        });
        const updateLeadersParty = await this.matchRepository.findByPartyId({
          partyId,
        });
        const createLeadersMember =
          await this.matchRepository.createLeadersMember({ userId, partyId });

        //(주의!!!!!)매칭되면 문자 가게 하는 메서드 1/2
        if (numOfMembers === 4) {
          const phone_numbers = await this.matchRepository.findAndCheck({ partyId })
          // const message = 
          // `[티끌플러스]
          // 축하드립니다 매칭에 성공했어요!
          // 마이페이지는 검색으로^^`
          // for (const phone of phone_numbers) {
          //   this.sens.send_message(phone, message)
          // }
        }
        return `${partyId + 5030}번 파티의 매칭이 성공했어요! 마이페이지를 확인하세요.`;
      } else {
        const newParty = await this.matchRepository.createLeadersParty({
          ottService,
        });
        const partyId = newParty.partyId;
        const numOfMembers = (newParty.numOfMembers += 1);
        await this.matchRepository.updateLeadersParty({
          partyId,
          ID,
          password,
          numOfMembers,
        });
        const updateLeadersParty = await this.matchRepository.findByPartyId({
          partyId,
        });
        const createLeadersMember =
          await this.matchRepository.createLeadersMember({ userId, partyId });
        // return { party: updateLeadersParty, member: createLeadersMember }
        return ` ${partyId}번 파티에 매칭 / ${numOfMembers - 1} -> ${numOfMembers} / 파티장 O`;
      }
    } catch (error) {
      throw error;
    }
  };

  matchMember = async ({ userId, ottService }) => {
    try {
      // 3명 이하인 방만 찾아옴
      const availableParty = await this.matchRepository.findMemberParty({
        //복수 오타 수정
        ottService,
      });
      // 3명이하인 방이 있을경우
      if (availableParty.length) {
        // 3명 이하고 파티장 존재하는 방을 찾아봄
        const hasLeaderParty = await this.matchRepository.findHasLeaderParty({
          ottService,
        });
        console.log(hasLeaderParty);
        // 3명이하 파티장 있는 방이 있을경우
        if (hasLeaderParty.length) {
          hasLeaderParty.sort((a, b) => {
            return a.createdAt - b.createdAt;
          });

          // 리더가 있는 방의 수 만큼 for문 돌림
          for ( let i = 0 ; i < hasLeaderParty.length ; i++ ) {
            // 이 파티 아이디
            const partyId = hasLeaderParty[i].dataValues.partyId;

            // 이 파티와 같은 파티 아이디를 가진 유저 모두 찾아 배열에 해당 유저 아이디 값 받아오기
            const hasSamePartyIdUser = 
              (await this.matchRepository.findMembersByPartyId({partyId}))
                .map(x => x.dataValues.userId);
            console.log('해당 파티에 있는 유저들: ', hasSamePartyIdUser);

            // 지금 로그인 한 유저 아이디 받아오기
            const thisUserId = userId; 
            console.log('로그인 된 유저의 아이디 : ',thisUserId);

            for ( let j = 0 ; j < hasSamePartyIdUser.length; j++ ) {
              // 만약 현재 유저 아이디와 중복되는 유저가 파티에 있다면
              if ( thisUserId === hasSamePartyIdUser[j] ) 
                // 에러 발생
                throw Error("이미 가입된 파티에는 파티원으로 가입하실 수 없습니다.");
            }
          }
          
          const partyId = hasLeaderParty[0].partyId;
          const numOfMembers = hasLeaderParty[0].numOfMembers + 1;
          // 해당 파티 레코드의 numOfMembers 를 1늘려줌
          await this.matchRepository.updateMemberParty({
            partyId,
            numOfMembers,
          });
          // Members 테이블에 매칭한 유저 생성함
          await this.matchRepository.createMember({ userId, partyId });
          console.log(
            ` ${partyId}번 파티에 매칭 / ${numOfMembers - 1
            } -> ${numOfMembers} / 파티장 O`
          );

          //(주의!!!!!)매칭되면 문자 가게 하는 메서드 2/2 
          if (numOfMembers === 4) {
            const phone_numbers = await this.matchRepository.findAndCheck({ partyId })
            // const message =
            //   `[티끌플러스]
            // 축하드립니다 매칭에 성공했어요!
            // 마이페이지는 검색으로^^`
            // for (const phone of phone_numbers) {
            //   this.sens.send_message(phone, message)
            // }
            return `${partyId + 5030} 번 파티의 매칭이 성공했어요! 마이페이지를 확인하세요.`;
          }
          return ` ${partyId}번 파티에 매칭 / ${
            numOfMembers - 1
          } -> ${numOfMembers} / 파티장 O`;

          // 파티장 있는 방이 없는 경우
        } else {
          // 파티장 없고 2명 이하인 방 찾기(하나는 파티장 자리)
          const noLeaderParty = await this.matchRepository.findNoLeaderParty({
            ottService,
          });
          if (noLeaderParty.length) {
            noLeaderParty.sort((a, b) => {
              return a.createdAt - b.createdAt;
            });
            const partyId = noLeaderParty[0].partyId;
            const numOfMembers = noLeaderParty[0].numOfMembers + 1;
            // 가장 오래된 파티 numOfMembers를 1 늘려줌
            await this.matchRepository.updateMemberParty({
              partyId,
              numOfMembers,
            });
            // Members 테이블에 매칭한 유저 생성함
            await this.matchRepository.createMember({ userId, partyId });
            console.log(
              `${partyId}번 파티에 매칭 / ${numOfMembers - 1} -> ${numOfMembers} / 파티장 X `
            );
            return `${partyId}번 파티에 매칭 / ${numOfMembers - 1} -> ${numOfMembers} / 파티장 X `;
            // 3명 이하인 파티는 있는데 파티장이 들어가야 하는 방만 있는 경우
          } else {
            const noLeaderParty = await this.matchRepository.createMemberParty({
              ottService,
            });
            const partyId = noLeaderParty.partyId;
            await this.matchRepository.createMember({ userId, partyId });
            console.log(
              `모든 파티가 꽉 차서 ${partyId}번 파티를 하나 만들었어요. 파티장X`
            );
            return `모든 파티가 꽉 차서 ${partyId}번 파티를 하나 만들었어요. 파티장X`;
          }
        }
        // 모든 파티가 4명씩 꽉 차있을 경우
      } else {
        const noLeaderParty = await this.matchRepository.createMemberParty({
          ottService,
        });
        const partyId = noLeaderParty.partyId;
        await this.matchRepository.createMember({ userId, partyId });
        console.log(
          `모든 파티가 꽉 차서 ${partyId}번 파티를 하나 만들었어요. 파티장X`
        );
        return `모든 파티가 꽉 차서 ${partyId}번 파티를 하나 만들었어요. 파티장X`;
      }
    } catch (error) {
      throw error;
    }
  };
}

module.exports = MatchService;
