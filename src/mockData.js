export const communityImpactStats = {
  recycledKg: "12,480 kg",
  co2SavedKg: "8,240 kg",
  waterSavedLiters: "4.2M L",
  usersCount: "3,420",
  monthlyGrowthPercent: "18%"
};

export const recyclingCategories = [
  {
    id: "paper",
    name: "Paper",
    icon: "📄",
    color: "bg-amber-100/70 text-amber-900 border-amber-200",
    description: "Newspapers, cardboard boxes, office paper, magazines, envelopes.",
    status: "Recyclable ✓",
    points: "+30 pts / kg",
    prepSteps: [
      "Remove any plastic tape or bindings",
      "Keep paper dry and free of grease",
      "Flatten cardboard boxes for transport"
    ],
    dontRecycle: [
      "Greasy pizza boxes (bottom oil stain)",
      "Used paper towels or tissues",
      "Wax-coated paper cups"
    ]
  },
  {
    id: "plastic",
    name: "Plastic",
    icon: "🧴",
    color: "bg-emerald-100/70 text-emerald-900 border-emerald-200",
    description: "PET bottles, HDPE milk jugs, shampoo bottles, clean food tubs.",
    status: "Recyclable ✓",
    points: "+40 pts / kg",
    prepSteps: [
      "Rinse out food or liquid residue",
      "Keep bottle caps on or separate as guided",
      "Crush bottles to save bin space"
    ],
    dontRecycle: [
      "Dirty plastic food wrappers",
      "Styrofoam packaging",
      "Medical tubing"
    ]
  },
  {
    id: "glass",
    name: "Glass",
    icon: "🍾",
    color: "bg-teal-100/70 text-teal-900 border-teal-200",
    description: "Beverage bottles, food jars, olive oil bottles, cosmetic glass.",
    status: "Recyclable ✓",
    points: "+25 pts / kg",
    prepSteps: [
      "Empty liquids completely and rinse",
      "Remove metal or plastic caps",
      "Separate clear, green, and brown glass"
    ],
    dontRecycle: [
      "Broken window panes or mirrors",
      "Ceramic plates or clay pots",
      "Drinking crystal glassware"
    ]
  },
  {
    id: "metal",
    name: "Metal",
    icon: "🥫",
    color: "bg-stone-200/70 text-stone-900 border-stone-300",
    description: "Aluminum beverage cans, steel food tins, clean foil trays.",
    status: "Recyclable ✓",
    points: "+50 pts / kg",
    prepSteps: [
      "Rinse food cans clean",
      "Place tin lids inside empty cans",
      "Wipe clean aluminum foil into a ball"
    ],
    dontRecycle: [
      "Paint cans with wet chemical paint",
      "Pressurized aerosol cans with liquid",
      "Rusty barbed wire"
    ]
  },
  {
    id: "electronics",
    name: "Electronics",
    icon: "💻",
    color: "bg-indigo-100/70 text-indigo-900 border-indigo-200",
    description: "Laptops, phones, monitors, chargers, circuit boards.",
    status: "Special Drop-off ⚡",
    points: "+120 pts / item",
    prepSteps: [
      "Wipe personal data & perform factory reset",
      "Bundle charging cables neatly",
      "Store in a dry shockproof box"
    ],
    dontRecycle: [
      "Swollen or leaking lithium battery units",
      "Items with exposed high-voltage wiring"
    ]
  },
  {
    id: "batteries",
    name: "Batteries",
    icon: "🔋",
    color: "bg-yellow-100/70 text-yellow-900 border-yellow-200",
    description: "AA/AAA alkaline batteries, lithium-ion, laptop battery packs.",
    status: "Hazardous Drop-off ⚠️",
    points: "+60 pts / kg",
    prepSteps: [
      "Tape battery terminals with clear tape",
      "Keep in a dry, non-conductive plastic container",
      "Keep away from direct heat"
    ],
    dontRecycle: [
      "Damaged or leaking battery units in trash bins",
      "Loose un-taped industrial batteries"
    ]
  },
  {
    id: "textiles",
    name: "Textiles",
    icon: "👕",
    color: "bg-rose-100/70 text-rose-900 border-rose-200",
    description: "Clean clothes, towels, bedsheets, shoes, curtains.",
    status: "Donate / Recycle 👕",
    points: "+35 pts / kg",
    prepSteps: [
      "Wash and thoroughly dry all fabrics",
      "Pair shoes together",
      "Pack in clean sealed bags"
    ],
    dontRecycle: [
      "Wet or moldy clothing",
      "Oil-stained mechanic rags"
    ]
  },
  {
    id: "organic",
    name: "Organic",
    icon: "🍎",
    color: "bg-lime-100/70 text-lime-900 border-lime-200",
    description: "Fruit peels, vegetable scraps, coffee grounds, garden leaves.",
    status: "Compostable 🌱",
    points: "+20 pts / kg",
    prepSteps: [
      "Separate from plastic bags or stickers",
      "Store in breathable countertop compost bin",
      "Mix green scraps with dry brown leaves"
    ],
    dontRecycle: [
      "Plastic packaging or fruit stickers",
      "Flea-treated pet waste"
    ]
  }
];

export const searchableMaterials = [
  {
    keywords: ["pizza box", "cardboard", "pizza"],
    item: "Pizza Box",
    isRecyclable: true,
    conditionNote: "Recyclable IF clean! Remove greasy bottom paper or tear off grease-stained parts.",
    category: "Paper",
    icon: "🍕",
    prep: "1. Remove leftover food and wax paper.\n2. Cut off grease-soaked bottom half.\n3. Recycle clean top cardboard in paper bin.",
    badge: "Paper Recycling 📄"
  },
  {
    keywords: ["plastic bottle", "water bottle", "soda bottle", "pet"],
    item: "Plastic Water Bottle (PET)",
    isRecyclable: true,
    category: "Plastic",
    icon: "🧴",
    prep: "1. Empty liquid completely.\n2. Rinse briefly.\n3. Screw cap back on and drop in plastic bin.",
    badge: "Plastic Recycling 🧴"
  },
  {
    keywords: ["bubble wrap", "plastic wrap", "bag"],
    item: "Bubble Wrap & Soft Plastic Film",
    isRecyclable: false,
    specialDisposal: true,
    category: "Plastic (Store Drop-off)",
    icon: "📦",
    prep: "Do NOT place in standard curbside bin! Drop off at grocery store plastic bag recycling bins.",
    badge: "Store Drop-off Required 📍"
  },
  {
    keywords: ["aluminum can", "soda can", "drink can", "beer can"],
    item: "Aluminum Beverage Can",
    isRecyclable: true,
    category: "Metal",
    icon: "🥫",
    prep: "1. Empty completely.\n2. Rinse lightly.\n3. Drop in metal recycling bin.",
    badge: "Metal Recycling 🥫"
  },
  {
    keywords: ["aa battery", "battery", "lithium battery", "cell"],
    item: "AA / AAA Alkaline or Lithium Batteries",
    isRecyclable: false,
    specialDisposal: true,
    category: "Hazardous E-Waste",
    icon: "🔋",
    prep: "Never put in regular trash or recycling bin! Tape ends and drop off at battery drop-off locations.",
    badge: "Hazardous Drop-off 🔋"
  },
  {
    keywords: ["glass bottle", "wine bottle", "glass jar"],
    item: "Glass Bottle / Food Jar",
    isRecyclable: true,
    category: "Glass",
    icon: "🍾",
    prep: "1. Rinse food residue.\n2. Remove metal lids.\n3. Place in glass collection bin.",
    badge: "Glass Recycling 🍾"
  }
];

export const recyclingLocations = [
  {
    id: "loc-1",
    name: "EcoLoop Green Center",
    address: "142 Evergreen Parkway, Sector 4",
    distance: "0.8 km away",
    acceptedMaterials: ["Paper", "Plastic", "Glass", "Metal"],
    hours: "Open Today: 8:00 AM - 7:00 PM",
    rating: 4.9,
    phone: "(555) 234-8891",
    lat: 37.7749,
    lng: -122.4194
  },
  {
    id: "loc-2",
    name: "Central Eco Point & E-Waste Hub",
    address: "88 Community Way, Downtown",
    distance: "1.4 km away",
    acceptedMaterials: ["Electronics", "Batteries", "Paper", "Metal"],
    hours: "Open Today: 9:00 AM - 6:00 PM",
    rating: 4.8,
    phone: "(555) 901-4432",
    lat: 37.7833,
    lng: -122.4167
  },
  {
    id: "loc-3",
    name: "City Resource & Bio-Compost Depot",
    address: "505 Solar Drive, West District",
    distance: "2.2 km away",
    acceptedMaterials: ["Organic", "Textiles", "Glass", "Plastic"],
    hours: "Open Today: 7:30 AM - 5:00 PM",
    rating: 4.95,
    phone: "(555) 883-1109",
    lat: 37.7690,
    lng: -122.4480
  }
];

export const userDashboardData = {
  userName: "Alex",
  totalRecycledKg: 128,
  co2SavedKg: 42.5,
  earnedPoints: 1240,
  targetPoints: 1500,
  tier: "Eco Starter",
  tierProgressPercent: 82,
  recentActivity: [
    { id: "act-1", category: "Paper", weightKg: 4, points: 40, date: "Today, 10:30 AM", icon: "📄" },
    { id: "act-2", category: "Plastic", weightKg: 2, points: 30, date: "Yesterday, 3:15 PM", icon: "🧴" },
    { id: "act-3", category: "Glass", weightKg: 5, points: 50, date: "Sep 08, 2026", icon: "🍾" },
    { id: "act-4", category: "Electronics", weightKg: 3, points: 120, date: "Sep 04, 2026", icon: "💻" },
  ]
};

export const rewardsList = [
  {
    id: "rew-1",
    title: "Reusable Stainless Water Bottle",
    pointsRequired: 1500,
    icon: "🥤",
    description: "Insulated 750ml double-wall stainless steel bottle with EcoLoop logo.",
    category: "Eco Merchandise",
    isRedeemable: false, // Alex has 1,240 pts
    remainingPts: 260
  },
  {
    id: "rew-2",
    title: "Organic Cotton Canvas Tote Bag",
    pointsRequired: 800,
    icon: "🛍️",
    description: "100% unbleached organic cotton heavy-duty grocery tote bag.",
    category: "Eco Merchandise",
    isRedeemable: true
  },
  {
    id: "rew-3",
    title: "Plant 1 Native Forest Tree",
    pointsRequired: 500,
    icon: "🌳",
    description: "We plant a verified native sapling in your name with GPS tracking certificate.",
    category: "Direct Restoration",
    isRedeemable: true
  },
  {
    id: "rew-4",
    title: "Ceramic Bamboo Travel Coffee Mug",
    pointsRequired: 2000,
    icon: "☕",
    description: "Sleek ceramic travel tumbler with spill-proof bamboo lid.",
    category: "Eco Merchandise",
    isRedeemable: false,
    remainingPts: 760
  }
];

export const ecoJournalArticles = [
  {
    id: "art-1",
    title: "How to recycle paper correctly without contaminating batches",
    category: "Recycling Guide",
    readTime: "4 min read",
    icon: "🌱",
    summary: "Learn why oil-stained pizza boxes and wet napkins ruin paper recycling processes and how to sort them properly."
  },
  {
    id: "art-2",
    title: "7 everyday things you shouldn't throw in the trash bin",
    category: "Waste Reduction",
    readTime: "5 min read",
    icon: "♻",
    summary: "Discover hazardous common household items like alkaline batteries, electronics, and fluorescent bulbs."
  },
  {
    id: "art-3",
    title: "Why closed-loop recycling protects municipal water supplies",
    category: "Sustainability",
    readTime: "3 min read",
    icon: "💧",
    summary: "Explore how recycling plastic and metals prevents microplastic leaching into local groundwater basins."
  }
];

export const communityTestimonials = [
  {
    quote: "Recycling finally feels simple instead of confusing. Booking doorstep pickups and seeing my impact points grow is super rewarding!",
    name: "Priya Sharma",
    location: "Chennai, India",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop"
  },
  {
    quote: "The 'Can I Recycle This?' feature solved our household debates about cardboard and bubble wrap in seconds. Highly recommended!",
    name: "Mark Rosenthal",
    location: "San Francisco, USA",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop"
  },
  {
    quote: "Our school eco-club redeemed points to plant 50 trees in our local park. EcoLoop bridges everyday recycling with real restoration.",
    name: "Elena Weber",
    location: "Berlin, Germany",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop"
  }
];
