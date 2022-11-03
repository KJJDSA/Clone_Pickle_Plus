const users = require("../models/users");
const MyPageRepository = require("../repositories/mypage");
const MyPartyService = require('./myparty');

class MyPageService {
  constructor() {
    this.myPageRepository = new MyPageRepository();
    this.myPartyService = new MyPartyService();
  }

  // 유저 닉네임과 폰 번호 조회
  nicknameAndPhone = async ({ userId }) => {
    try {
      const myInfo = await this.myPageRepository.nicknameAndPhone({ userId });
      return myInfo;
    } catch (error) {
      throw error;
    }
  }

  // 유저 닉네임과 폰 번호를 수정
  updateNicknameAndPhone = async ({ userId, nickname, phone }) => {
    try {
      const myInfo = await this.myPageRepository.updateNicknameAndPhone({
        userId,
        nickname,
        phone
      });
      return myInfo;

    } catch (error) {
      throw error;
    }
  }

  // 유저 회원 탈퇴
  deleteUserAccount = async ({ userId }) => {
    try {
      // myParty에 이미 있는 메서드를 끌고 와서 사용하도록 하자.
      const partyList = await this.myPartyService.lookupMyParty({ userId })
      // 탈퇴하는 것도 이미 만든 메서드가 있으니 애용하도록 하자.
      for (let i = 0; i < partyList.length; i++) {
        await this.myPartyService.exitParty({ userId, partyId: partyList[i].partyId })
      }
      // 마지막으로 회원탈퇴
      const myInfo = await this.myPageRepository.deleteUserAccount({ userId });
      return myInfo;
    } catch (error) {
      throw error;
    }
  }


  lookupMyBankAccount = async ({ userId }) => {
    try {
      const myBankAccount = await this.myPageRepository.lookupMyBankAccount({
        userId,
      });
      return myBankAccount;
    } catch (error) {
      throw error;
    }
  };

  registerBankAccount = async ({ userId, bank, account }) => {
    try {
      // 한개만 생성 가능
      const isExist = await this.myPageRepository.accountIsExist({ userId });
      // console.log(isExist)
      if (isExist) {
        throw { name: "account", message: "계좌가 이미 존재합니다." };
      }
      await this.myPageRepository.registerBankAccount({
        userId,
        bank,
        account,
      });
      const registerBankAccount =
        await this.myPageRepository.lookupMyBankAccount({
          userId,
        });

      return registerBankAccount;
    } catch (error) {
      throw error;
    }
  };

  updateBankAccount = async ({ userId, bank, account }) => {
    try {
      await this.myPageRepository.updateBankAccount({
        userId,
        bank,
        account,
      });
      const myBankAccount = await this.myPageRepository.lookupMyBankAccount({
        userId,
      });

      return myBankAccount;
    } catch (error) {
      throw error;
    }
  };

  deleteBankAccount = async ({ userId }) => {
    try {
      await this.myPageRepository.deleteBankAccount({
        userId,
      });

      const myBankAccount = await this.myPageRepository.lookupMyBankAccount({
        userId,
      });

      return myBankAccount;
    } catch (error) {
      throw error;
    }
  };


  /** ########################## 카드 ########################### */

  createCard = async ({ bank, card, MMYY, birth, password, userId }) => {
    try {
      const isExist = await this.myPageRepository.cardIsExist({ userId });
      if (isExist) {
        throw { name: "card", message: "카드가 이미 존재합니다." };
      }
      const createCard = await this.myPageRepository
        .createCard({ bank, card, MMYY, birth, password, userId });
      return createCard;
    } catch (error) {
      throw error;
    }
  };

  cardList = async ({ userId }) => {
    try {
      const cards = await this.myPageRepository.cardList({ userId });
      if (cards.length === 0) {
        return null;
      }
      return cards;
    } catch (error) {
      throw error;
    }
  };

  cardEdit = async ({ bank, card, MMYY, birth, password, userId, }) => {
    try {
      const cardedit = await this.myPageRepository
        .cardEdit({ bank, card, MMYY, birth, password, userId });

      if (cardedit < 1) throw { name: "card", message: "수정 실패" };
      return "수정 성공";
    } catch (error) {
      throw error;
    }
  };

  cardDelete = async ({ userId }) => {
    try {
      const isExist = await this.myPageRepository.cardIsExist({ userId });
      if (!isExist) {
        throw { name: "card", message: "카드가 존재하지 않습니다." };
      }

      const carddelete = await this.myPageRepository.cardDelete({ userId });
      if (carddelete < 1) throw { name: "card", message: "삭제할 수 없습니다." };
      return "삭제 성공";
    } catch (error) {
      throw error;
    }
  };
}

module.exports = MyPageService;
