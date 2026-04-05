export type Pooja = {
  id: string;
  slug: string;
  name: string;
  nameML: string;
  description: string;
  descriptionML: string;
  duration: string;
  price: number;
  image: string;
  available: boolean;
};

export const nakshatras = [
  "Ashwini",
  "Bharani",
  "Krittika",
  "Rohini",
  "Mrigashirsha",
  "Ardra",
  "Punarvasu",
  "Pushya",
  "Ashlesha",
  "Magha",
  "Purva Phalguni",
  "Uttara Phalguni",
  "Hasta",
  "Chitra",
  "Swati",
  "Vishakha",
  "Anuradha",
  "Jyeshtha",
  "Mula",
  "Purva Ashadha",
  "Uttara Ashadha",
  "Shravana",
  "Dhanishta",
  "Shatabhisha",
  "Purva Bhadrapada",
  "Uttara Bhadrapada",
  "Revati",
] as const;

export const poojas: Pooja[] = [
  {
    id: "pooja-thiruvappana",
    slug: "thiruvappana",
    name: "Thiruvappana",
    nameML: "തിരുവപ്പന",
    description: "The principal ritual offering to Sree Muthappan invoking grace, prosperity, and protection.",
    descriptionML: "ശ്രീ മുത്തപ്പന്റെ അനുഗ്രഹവും ഐശ്വര്യവും പ്രാപിക്കാനായുള്ള പ്രധാന വഴിപാടാണ് തിരുവപ്പന.",
    duration: "45 mins",
    price: 350000,
    image: "https://images.unsplash.com/photo-1605379399642-870262d3d051?auto=format&fit=crop&w=1200&q=80",
    available: true,
  },
  {
    id: "pooja-vellattam",
    slug: "vellattam",
    name: "Vellattam",
    nameML: "വെള്ളാട്ടം",
    description: "An auspicious offering seeking relief from obstacles and invoking divine presence in the family.",
    descriptionML: "കുടുംബത്തിലെ തടസങ്ങൾ നീങ്ങി ദൈവിക സാന്നിധ്യം നിറയാൻ നടത്തുന്ന വിശേഷ വഴിപാടാണ് വെള്ളാട്ടം.",
    duration: "30 mins",
    price: 180000,
    image: "https://images.unsplash.com/photo-1625047509248-ec889cbff17f?auto=format&fit=crop&w=1200&q=80",
    available: true,
  },
  {
    id: "pooja-karimkalasam",
    slug: "karimkalasam",
    name: "Karimkalasam",
    nameML: "കരിംകലശം",
    description: "Traditional kalasam pooja for spiritual shielding, ancestral blessings, and welfare.",
    descriptionML: "ആത്മീയ സംരക്ഷണത്തിനും പിതൃഅനുഗ്രഹത്തിനും കുടുംബക്ഷേമത്തിനുമായി നടത്തുന്ന കലശപൂജ.",
    duration: "60 mins",
    price: 450000,
    image: "https://images.unsplash.com/photo-1542816417-0983670d2f24?auto=format&fit=crop&w=1200&q=80",
    available: true,
  },
  {
    id: "pooja-oottum-vellattam",
    slug: "oottum-vellattam",
    name: "Oottum Vellattam",
    nameML: "ഊട്ടും വെള്ളാട്ടം",
    description: "Combined ritual and offering service for special vows and thanksgiving observances.",
    descriptionML: "വിശേഷ നേർച്ചകൾക്കും നന്ദിപ്രകടനത്തിനുമായി നടത്തുന്ന ചേർത്ത് നിൽക്കുന്ന ആരാധനാ സേവനമാണ് ഊട്ടും വെള്ളാട്ടം.",
    duration: "75 mins",
    price: 550000,
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
    available: true,
  },
  {
    id: "pooja-vilakkum-mala",
    slug: "vilakkum-mala",
    name: "Vilakkum Mala",
    nameML: "വിളക്കുംമാല",
    description: "Lamp and garland offering for health, harmony, and auspicious beginnings.",
    descriptionML: "ആരോഗ്യത്തിനും ഐക്യത്തിനും ശുഭാരംഭങ്ങൾക്കുമായി ദീപവും മാലയും സമർപ്പിക്കുന്ന പൂജ.",
    duration: "20 mins",
    price: 90000,
    image: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=1200&q=80",
    available: true,
  },
  {
    id: "pooja-choroonu",
    slug: "choroonu",
    name: "Choroonu",
    nameML: "ചോറൂണ്",
    description: "Auspicious first-feeding ceremony conducted in the temple for children and families.",
    descriptionML: "കുഞ്ഞുങ്ങളുടെ ആദ്യ അന്നപ്രാശനച്ചടങ്ങ് ക്ഷേത്രത്തിൽ നടത്തുന്നതിനുള്ള വിശുദ്ധ സേവനം.",
    duration: "40 mins",
    price: 250000,
    image: "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=1200&q=80",
    available: true,
  },
  {
    id: "pooja-thulabharam",
    slug: "thulabharam",
    name: "Thulabharam",
    nameML: "തുലാഭാരം",
    description: "Devotional offering ceremony for gratitude, recovery, and fulfilment of vows.",
    descriptionML: "കൃതജ്ഞതക്കും രോഗമുക്തിക്കും നേർച്ചപാലനത്തിനുമായി നടത്തപ്പെടുന്ന ഭക്തിനിർഭരമായ സമർപ്പണച്ചടങ്ങ്.",
    duration: "35 mins",
    price: 300000,
    image: "https://images.unsplash.com/photo-1528715471579-d1bcf0ba5e83?auto=format&fit=crop&w=1200&q=80",
    available: false,
  },
];

export const festivals = [
  {
    title: "Puthari Thiruvappana",
    date: "14 January 2026",
    description: "A harvest-season celebration with special poojas, annadanam, and devotional music.",
  },
  {
    title: "Muthappan Mahotsavam",
    date: "28 February 2026",
    description: "The annual temple festival with grand rituals, cultural programs, and community offerings.",
  },
];

export const adminStats = {
  totalBookings: 1284,
  revenue: 24860000,
  pendingOrders: 36,
  liveDarshanUrl: "https://www.youtube.com/embed/live_stream?channel=UCyZ3H0KZ7l7jzr_6GQ5J4hA",
};
