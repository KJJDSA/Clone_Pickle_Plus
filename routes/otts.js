const express = require("express");
const router = express.Router();
const OTTS = [
  {
    ottService: "Netflix",
    price: 170000,
    hostCommision: 490,
    memberCommision: 990,
  },
  {
    ottService: "Wavve",
    price: 139000,
    hostCommision: 490,
    memberCommision: 990,
  },
  {
    ottService: "Watcha",
    price: 129000,
    hostCommision: 490,
    memberCommision: 990,
  },
  {
    ottService: "Laftel",
    price: 149000,
    hostCommision: 490,
    memberCommision: 990,
  },
  {
    ottService: "Tving",
    price: 139000,
    hostCommision: 490,
    memberCommision: 990,
  },
  {
    ottService: "DisneyPlus",
    price: 99000,
    hostCommision: 490,
    memberCommision: 990,
  }
]

const price = {
  Netflix: 170000,
  Wavve: 139000,
  Watcha: 129000,
  Laftel: 149000,
  Tving: 99000,
  DisneyPlus: 99000,
}

router.get("/:ottId", (req, res) => {
  try {
    const { ottId } = req.params
    const ott = OTTS[ottId - 1]
    res.status(200).json({ data: ott })
  } catch (error) {
    console.log(error);
  }
});

router.post("/", (req, res) => {
  try {
    let result = {}
    const { ottServices } = req.body;
    for (const ottService of ottServices) {
      result[ottService] = price[ottService]
    }
    res.status(200).json({ data: result })
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;