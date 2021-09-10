const products = [
  {
    name: "Children's beginner Suit",
    description:
      "The sizes quoted are based on height. Ideal first gi for students. Trousers have an elastic / tie waistband. White belt included. 65% polyester / 35% cotton. 7oz weight.",
    countInStock: {
      "100cm": 5,
      "110cm": 5,
      "120cm": 2,
      "130cm": 4,
      "140cm": 0,
      "150cm": 4,
    },
    price: 20.0,
    image: "/images/beginner-karate-suit.jpg",
    category: "uniform/gi",
  },
  {
    name: "Adult's beginner Suit",
    description:
      "The sizes quoted are based on height. Ideal first gi for students. Trousers have an elastic / tie waistband. White belt included. 65% polyester / 35% cotton. 7oz weight.",
    countInStock: {
      "160cm": 1,
      "170cm": 3,
      "180cm": 0,
      "190cm": 0,
      "200cm": 0,
    },
    price: 25.0,
    image: "/images/beginner-karate-suit.jpg",
    category: "uniform/gi",
  },
  {
    name: "Children's Kata Suit",
    description:
      "The sizes quoted are based on height.Approved by the World Karate Federation (WKF). Japanese cut: ¾ length sleeves and trouser legs. Heavy weight for shape and snap, perfect for kata performance. 100% brushed cotton canvas. 14oz weight.",
    countInStock: {
      "140cm": 1,
      "145cm": 1,
      "150cm": 1,
      "155cm": 0,
    },
    price: 60.0,
    image: "/images/odachi-wkf-approved-karate-suit.jpg",
    category: "uniform/gi",
  },
  {
    name: "Adult's Kata Suit",
    description:
      "The sizes quoted are based on height.Approved by the World Karate Federation (WKF). Japanese cut: ¾ length sleeves and trouser legs. Heavy weight for shape and snap, perfect for kata performance. 100% brushed cotton canvas. 14oz weight.",
    countInStock: {
      "160cm": 1,
      "170cm": 1,
      "180cm": 1,
    },
    price: 70.0,
    image: "/images/odachi-wkf-approved-karate-suit.jpg",
    category: "uniform/gi",
  },
  {
    name: "Children's Kumite Suit",
    description:
      "The sizes quoted are based on height. Approved by the World Karate Federation (WKF). Ventilated areas perfect for staying cool. Light weight for ease of movement, perfect for kumite. Trousers have an elastic/tie waist. 100% polyester / 8oz weight.",
    countInStock: {
      "100cm": 5,
      "110cm": 5,
      "120cm": 2,
      "130cm": 4,
      "140cm": 0,
      "150cm": 4,
    },
    price: 45.0,
    image: "/images/shuhari-wkf-approved-karate-suit.jpg",
    category: "uniform/gi",
  },
  {
    name: "Adult's Kumite Suit",
    description:
      "The sizes quoted are based on height. Approved by the World Karate Federation (WKF). Ventilated areas perfect for staying cool. Light weight for ease of movement, perfect for kumite. Trousers have an elastic/tie waist. 100% polyester / 8oz weight.",
    countInStock: {
      "160cm": 1,
      "170cm": 1,
      "180cm": 1,
      "190cm": 1,
    },
    price: 55.0,
    image: "/images/shuhari-wkf-approved-karate-suit.jpg",
    category: "uniform/gi",
  },
  {
    name: "Sparring Gloves",
    description:
      "Approved by the World Karate Federation (WKF). Absorbs knocks and blows associated with kumite. Additional thumb protection with shaped padding. Wide wrist strap ensures gloves stay in place. Made from Premium Synthetic Leather.",
    countInStock: {
      "Red Small": 3,
      "Red Medium": 3,
      "Red Large": 3,
      "Blue Small": 3,
      "Blue Medium": 3,
      "Blue Large": 3,
    },
    price: 20.0,
    image: "/images/gloves-with-thumb.jpg",
    category: "equipment",
  },
  {
    name: "Foot Pads",
    description:
      "Approved by the World Karate Federation (WKF). Guards can be worn together or separately. Removable foot is attached to the shin with Velcro. Securely fastens with Velcro straps. Made from Premium Synthetic Leather.",
    countInStock: {
      "Red Small": 3,
      "Red Medium": 3,
      "Red Large": 3,
      "Blue Small": 3,
      "Blue Medium": 3,
      "Blue Large": 3,
    },
    price: 40.0,
    image: "/images/footpads.jpg",
    category: "equipment",
  },
  {
    name: "Mouth Guard",
    description:
      "A conventional mouth guard. Moulds when submerged in boiling water. Comes with matching case. Latex free",
    countInStock: {
      Junior: 3,
      Senior: 3,
    },
    price: 3.0,
    image: "/images/mouth-guard.jpg",
    category: "equipment",
  },
  {
    name: "Focus Pads",
    description:
      "Designed to withstand countless training sessions. For coordination, speed work and power drills. Target circle demands fast and precise punches/kicks. Adjustable velcro wrist strap for perfect fit. 30cm x 20cm x 6cm.",
    countInStock: {
      "Focus Pads": 2,
    },
    price: 20.0,
    image: "/images/focus-pads.jpg",
    category: "equipment",
  },
  {
    name: "Break Boards",
    description:
      "Yellow: New Starter Board. Orange: Beginner Board. Green: Intermediate Board. Red: Advanced Board. Interchangeable colour-coded strength levels.",
    countInStock: {
      Yellow: 1,
      Orange: 1,
      Green: 1,
      Red: 1,
    },
    price: 32.0,
    image: "/images/smash-board.jpg",
    category: "equipment",
  },
  {
    name: "Children's Rain Jacket",
    description:
      "Light-weight rain jacket. Fully waterproof. Official club merchandise. Bespoke with name printed.",
    sizes: [
      "6xs (ages 4 - 5)",
      "5xs (ages 6 - 7)",
      "4xs (ages 8 - 9)",
      "3xs (ages 10 - 11)",
      "2xs (ages 12 - 13)",
      "xs (ages 14+)",
    ],
    price: 22.0,
    image: "/images/rainjacket.jpg",
    category: "clothing",
  },
  {
    name: "Adult's Rain Jacket",
    description:
      "Light-weight rain jacket. Fully waterproof. Official club merchandise. Bespoke with name printed.",
    sizes: ["Small", "Medium", "Large", "X-large", "XX-large"],
    price: 24.0,
    image: "/images/rainjacket.jpg",
    category: "clothing",
  },
  {
    name: "Children's Hoodie",
    description:
      "Warm hoodie, ideal for wearing over a karate suit. Official Club Merchandise. Bespoke with name printed",
    sizes: [
      "6xs (ages 4 - 5)",
      "5xs (ages 6 - 7)",
      "4xs (ages 8 - 9)",
      "3xs (ages 10 - 11)",
      "2xs (ages 12 - 13)",
      "xs (ages 14+)",
    ],
    price: 18.0,
    image: "/images/hoodie.jpg",
    category: "clothing",
  },
  {
    name: "Adult's Hoodie",
    description:
      "Warm hoodie, ideal for wearing over a karate suit. Official Club Merchandise. Bespoke with name printed",
    sizes: ["Small", "Medium", "Large", "X-large", "XX-large"],
    price: 21.0,
    image: "/images/hoodie.jpg",
    category: "clothing",
  },
  {
    name: "Children's T-shirt",
    description:
      "Club t-shirt, ideal for training in hot weather or casual wear. Official club merchandise. Bespoke with name printed.",
    sizes: [
      "6xs (ages 4 - 5)",
      "5xs (ages 6 - 7)",
      "4xs (ages 8 - 9)",
      "3xs (ages 10 - 11)",
      "2xs (ages 12 - 13)",
      "xs (ages 14+)",
    ],
    price: 18.0,
    image: "/images/tshirt.jpg",
    category: "clothing",
  },
  {
    name: "Adult's T-shirt",
    description:
      "Club t-shirt, ideal for training in hot weather or casual wear. Official club merchandise. Bespoke with name printed.",
    sizes: ["Small", "Medium", "Large", "X-large", "XX-large"],
    price: 21.0,
    image: "/images/tshirt.jpg",
    category: "clothing",
  },
  {
    name: "Kit Bag",
    description:
      "Large Kit Bag, perfect for carrying all of your training items. Official club merchandise.",
    price: 16.0,
    image: "/images/kitbag.jpg",
    category: "equipment",
  },
  {
    name: "Water Bottle",
    description:
      "Large water bottle, for those tough training sessions. Official club merchandise.",
    price: 4.0,
    image: "/images/waterbottle.jpg",
    category: "equipment",
  },
];

export default products;
