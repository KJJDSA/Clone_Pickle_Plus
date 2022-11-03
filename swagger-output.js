require('dotenv').config();
module.exports = {
  "swagger": "2.0",
  "info": {
    "version": "1.0.0",
    "title": "클론프로젝트 API모음",
    "description": "근데 배포할때는 못해봤어서 문제임"
  },
  "host": "localhost:3000",
  "basePath": "/",
  "tags": [
    {
      "name": "회원가입/로그인API",
      "description": ""
    },
    {
      "name": "마이페이지API - 유저관리",
      "description": ""
    },
    {
      "name": "마이페이지API - 계좌관리",
      "description": ""
    },
    {
      "name": "마이페이지API - 카드관리",
      "description": ""
    },
    {
      "name": "매칭시스템API",
      "description": ""
    },
    {
      "name": "마이파티API",
      "description": ""
    }
  ],
  "schemes": [
    "http"
  ],
  "securityDefinitions": {
    "apiKeyAuth": {
      "type": "apiKey",
      "in": "cookie",
      "name": "Authorization",
      "description": "yes"
    }
  },
  "consumes": [
    "application/json"
  ],
  "produces": [
    "application/json"
  ],
  "paths": {
    "/": {
      "get": {
        "description": "hello world!",
        "tags": ["기타API"],
        "parameters": [],
        "responses": {
          "200": {
            "description": "OK"
          }
        }
      }
    },
    "/token/{userId}": {
      "get": {
        "description": "바로 토큰 받고 싶을 때 쓰는 API",
        "tags": ["기타API"],
        "parameters": [
          {
            "name": "userId",
            "in": "path",
            "required": true,
            "type": "string"
          }
        ],
        "responses": {
          "200": {
            "description": "OK"
          }
        }
      }
    },
    "/api/user/login": {
      "post": {
        "description": "로그인 하는 기능입니다.",
        "tags": ["회원가입/로그인API"],
        "parameters": [
          {
            "name": "body",
            "in": "body",
            "schema": {
              "type": "object",
              "properties": {
                "nickname": {
                  "type": "string",
                  "example": "아이디"
                },
                "password": {
                  "type": "string",
                  "example": "1234"
                },
              }
            }
          }
        ],
        "responses": {
          "401": {
            "description": "닉네임 혹은 패스워드가 틀림"
          },
          "400": {
            "description": "로그인에 실패하였습니다."
          }
        }
      }
    },
    "/api/user/": {
      "post": {
        "description": "회원가입하는 기능입니다",
        "tags": ["회원가입/로그인API"],
        "parameters": [
          {
            "name": "body",
            "in": "body",
            "schema": {
              "type": "object",
              "properties": {
                "nickname": {
                  "type": "string",
                  "example": "아이디"
                },
                "password": {
                  "type": "string",
                  "example": "1234"
                },
                "confirm": {
                  "type": "string",
                  "example": "1234"
                },
                "phone": {
                  "type": "string",
                  "example": "폰번"
                }
              }
            }
          }
        ],
        "responses": {
          "400": {
            "description": "Bad Request"
          },
          "412": {
            "description": "패스워드 확인이 일치하지 않음 or 패스워드에 닉네임이 포함됨 or 중복된 닉네임"
          }
        }
      }
    },
    "/api/mypage/": {
      "get": {
        "description": "내 정보를 불러오는 기능입니다.",
        "tags": ["마이페이지API - 유저관리"],
        "parameters": [],
        "responses": {}
      },
      "put": {
        "description": "내 정보 수정하는 기능입니다",
        "tags": ["마이페이지API - 유저관리"],
        "parameters": [
          {
            "name": "body",
            "in": "body",
            "schema": {
              "type": "object",
              "properties": {
                "nickname": {
                  "type": "string",
                  "example": "sparta"
                },
                "phone": {
                  "type": "string",
                  "example": "1234-5678-9123-4567"
                }
              }
            }
          }
        ],
        "responses": {}
      },
      "delete": {
        "description": "회원탈퇴 기능입니다.",
        "tags": ["마이페이지API - 유저관리"],
        "parameters": [],
        "responses": {}
      }
    },
    "/api/mypage/account": {
      "get": {
        "description": "내 계좌를 불러오는 기능입니다.",
        "tags": ["마이페이지API - 계좌관리"],
        "parameters": [],
        "responses": {}
      },
      "post": {
        "description": "내 계좌를 생성하는 기능입니다.",
        "tags": ["마이페이지API - 계좌관리"],
        "parameters": [
          {
            "name": "body",
            "in": "body",
            "schema": {
              "type": "object",
              "properties": {
                "bank": {
                  "type": "string",
                  "example": "KB"
                },
                "account": {
                  "type": "string",
                  "example": "1234-5678-9123-4567"
                },
              }
            }
          }
        ],
        "responses": {}
      },
      "put": {
        "description": "내 계좌를 변경하는 기능입니다.",
        "tags": ["마이페이지API - 계좌관리"],
        "parameters": [
          {
            "name": "body",
            "in": "body",
            "schema": {
              "type": "object",
              "properties": {
                "bank": {
                  "type": "string",
                  "example": "KB"
                },
                "account": {
                  "type": "string",
                  "example": "1234-5678-9123-4567"
                }
              }
            }
          }
        ],
        "responses": {}
      },
      "delete": {
        "description": "내 계좌를 삭제하는 기능입니다.",
        "tags": ["마이페이지API - 계좌관리"],
        "parameters": [],
        "responses": {}
      }
    },
    "/api/mypage/card": {
      "get": {
        "description": "내가 등록한 카드를 불러오는 기능입니다",
        "tags": ["마이페이지API - 카드관리"],
        "parameters": [],
        "responses": {}
      },
      "post": {
        "description": "카드 등록할 떄 쓰는 API입니다",
        "tags": ["마이페이지API - 카드관리"],
        "parameters": [
          {
            "name": "body",
            "in": "body",
            "schema": {
              "type": "object",
              "properties": {
                "bank": {
                  "type": "string",
                  "example": "KB"
                },
                "card": {
                  "type": "string",
                  "example": "1234-5678-9123-4567"
                },
                "MMYY": {
                  "type": "string",
                  "example": "11/11"
                },
                "brith": {
                  "type": "string",
                  "example": "20001010"
                },
                "password": {
                  "type": "string",
                  "example": "1234"
                }
              }
            }
          }
        ],
        "responses": {}
      },
      "put": {
        "description": "내 카드정보를 변경하는 기능입니다.",
        "tags": ["마이페이지API - 카드관리"],
        "parameters": [
          {
            "name": "body",
            "in": "body",
            "schema": {
              "type": "object",
              "properties": {
                "bank": {
                  "type": "string",
                  "example": "KB"
                },
                "card": {
                  "type": "string",
                  "example": "1234-5678-9123-4567"
                },
                "MMYY": {
                  "type": "string",
                  "example": "11/11"
                },
                "brith": {
                  "type": "string",
                  "example": "20001010"
                },
                "password": {
                  "type": "string",
                  "example": "1234"
                }
              }
            }
          }
        ],
        "responses": {}
      },
      "delete": {
        "description": "내 카드를 삭제하는 기능입니다.",
        "tags": ["마이페이지API - 카드관리"],
        "parameters": [],
        "responses": {}
      }
    },
    "/api/myparty/": {
      "get": {
        "description": "매칭된 파티 정보를 불러오는 기능입니다.",
        "tags": ["마이파티API"],
        "parameters": [],
        "responses": {
          "401": {
            "description": "Unauthorized"
          }
        }
      }
    },
    "/api/myparty/{partyId}": {
      "put": {
        "description": "파티의 ott 계정을 수정하는 기능입니다.",
        "tags": ["마이파티API"],
        "parameters": [
          {
            "name": "partyId",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "body",
            "in": "body",
            "schema": {
              "type": "object",
              "properties": {
                "ID": {
                  "type": "string",
                  "example": "sparta"
                },
                "password": {
                  "type": "string",
                  "example": "1234"
                }
              }
            }
          }
        ],
        "responses": {
          "401": {
            "description": "Unauthorized"
          }
        }
      },
      "delete": {
        "description": "파티를 탈퇴하는 기능입니다. 마지막 멤버였다면 파티가 삭제됩니다.",
        "tags": ["마이파티API"],
        "parameters": [
          {
            "name": "partyId",
            "in": "path",
            "required": true,
            "type": "string"
          }
        ],
        "responses": {
          "400": {
            "description": "Bad Request"
          },
          "401": {
            "description": "Unauthorized"
          }
        }
      }
    },
    "/api/ott/{ottId}": {
      "get": {
        "description": "ott 정보 받아오는 API입니다.",
        "tags": ["기타API"],
        "parameters": [
          {
            "name": "ottId",
            "in": "path",
            "required": true,
            "type": "string"
          }
        ],
        "responses": {
          "200": {
            "description": "OK"
          }
        }
      }
    },
    "/api/addparty/leader": {
      "post": {
        "description": "파티장으로 매칭신청을 하는 API입니다.",
        "tags": ["매칭시스템API"],
        "parameters": [
          {
            "name": "body",
            "in": "body",
            "schema": {
              "type": "object",
              "properties": {
                "ottService": {
                  "type": "string",
                  "example": "Netflix"
                },
                "ID": {
                  "type": "string",
                  "example": "sparta"
                },
                "password": {
                  "type": "string",
                  "example": "1234"
                }
              }
            }
          }
        ],
        "responses": {
          "401": {
            "description": "Unauthorized"
          }
        }
      }
    },
    "/api/addparty/member": {
      "post": {
        "description": "파티원으로 매칭신청을 하는 API입니다.",
        "tags": ["매칭시스템API"],
        "parameters": [
          {
            "name": "body",
            "in": "body",
            "schema": {
              "type": "object",
              "properties": {
                "ottService": {
                  "type": "string",
                  "example": "Netflix"
                }
              }
            }
          }
        ],
        "responses": {
          "401": {
            "description": "Unauthorized"
          }
        }
      }
    },
    "/api/count/": {
      "get": {
        "description": "매칭된 파티가 몇개인지 세줍니다(과장 좀 곁들임)",
        "tags": ["기타API"],
        "parameters": [],
        "responses": {
          "200": {
            "description": "OK"
          }
        }
      }
    }
  }
}
