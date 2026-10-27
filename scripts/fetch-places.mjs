import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const OVERPASS_URL = "https://overpass-api.de/api/interpreter";

// South, west, north, east — Hackney Wick and the streets around it.
const BBOX = {
  south: 51.536,
  west: -0.0355,
  north: 51.552,
  east: -0.014,
};

// Same place mapped twice (a door and the building, for example) is skipped
// when the names match and the pins are this close together.
const DUPLICATE_METRES = 50;

const PLACE_TAG_KEYS = ["amenity", "shop", "leisure", "craft", "tourism", "office"];

// First matching category wins, so the specific lists are at the top.
// Each list is the value after the tag name, e.g. amenity=cafe means "cafe".
// "*" means any value except "no". "drink" also checks drink:coffee, drink:beer, and similar.
// "when" means every tag in that group must match (used for arts centres that host live music).
const CATEGORY_TAGS = {
  "Breweries & Taprooms": {
    craft: ["brewery"],
    microbrewery: ["yes"],
    brewery: ["*"],
    amenity: ["brewery", "taproom"],
    industrial: ["brewery"],
  },
  "Music & Nightlife": {
    amenity: ["nightclub", "music_venue", "theatre", "events_venue"],
    when: [
      { amenity: ["arts_centre"], live_music: ["*"] },
      { amenity: ["arts_centre"], music: ["live"] },
    ],
  },
  "Bars & Pubs": {
    amenity: ["bar", "pub", "biergarten"],
    // Ignored when amenity is restaurant or cafe. Still counts if amenity is missing.
    bar: ["*"],
    drink: ["beer", "wine", "cocktail", "cocktails", "cider", "spirits", "liquor", "alcohol", "ale", "stout", "lager", "whisky", "whiskey", "gin", "rum"],
  },
  "Cafés": {
    amenity: ["cafe", "internet_cafe"],
    shop: ["coffee", "tea"],
    cuisine: ["coffee_shop", "coffee", "tea", "bubble_tea", "cake", "dessert", "juice", "smoothie"],
    drink: ["coffee", "tea", "matcha", "bubble_tea", "hot_chocolate", "cocoa", "chai", "juice", "smoothie"],
  },
  "Food & Drink": {
    amenity: ["restaurant", "fast_food", "food_court", "ice_cream", "canteen"],
    craft: ["caterer"],
    cuisine: ["*"],
    shop: [
      "bakery",
      "pastry",
      "confectionery",
      "chocolate",
      "ice_cream",
      "deli",
      "butcher",
      "seafood",
      "cheese",
      "greengrocer",
      "farm",
      "spices",
      "nuts",
      "frozen_food",
      "food",
    ],
  },
  "Arts & Galleries": {
    amenity: ["arts_centre", "cinema"],
    shop: ["art", "frame"],
    tourism: ["gallery", "museum", "artwork"],
  },
  "Studios & Creative Spaces": {
    amenity: ["studio", "makerspace", "workshop"],
    craft: [
      "photographer",
      "sculptor",
      "potter",
      "painter",
      "jeweller",
      "goldsmith",
      "blacksmith",
      "tailor",
      "dressmaker",
      "shoemaker",
      "upholsterer",
      "watchmaker",
      "clockmaker",
      "cabinet_maker",
      "musical_instrument",
      "printmaker",
      "engraver",
      "bookbinder",
      "leather",
      "ceramic",
      "artist",
      "designer",
      "design",
      "pottery",
      "printing",
      "printer",
      "handicraft",
    ],
    leisure: ["hackerspace"],
    shop: ["art_supplies", "craft"],
  },
  "Health & Fitness": {
    amenity: [
      "gym",
      "dojo",
      "clinic",
      "doctors",
      "dentist",
      "hospital",
      "pharmacy",
      "veterinary",
      "spa",
    ],
    leisure: [
      "fitness_centre",
      "fitness_station",
      "sports_centre",
      "sports_hall",
      "swimming_pool",
      "ice_rink",
      "sauna",
      "horse_riding",
      "stadium",
      "dance",
    ],
    shop: [
      "chemist",
      "optician",
      "hearing_aids",
      "medical_supply",
      "nutrition_supplements",
      "herbalist",
      "massage",
    ],
  },
  "Parks & Outdoors": {
    leisure: [
      "park",
      "garden",
      "nature_reserve",
      "playground",
      "dog_park",
      "pitch",
      "track",
      "recreation_ground",
      "common",
      "golf_course",
      "miniature_golf",
      "fishing",
      "marina",
      "slipway",
      "swimming_area",
      "bird_hide",
    ],
    tourism: ["picnic_site", "viewpoint", "camp_site"],
  },
  "Community": {
    amenity: [
      "community_centre",
      "social_centre",
      "social_facility",
      "place_of_worship",
      "library",
      "townhall",
      "public_bookcase",
      "school",
      "kindergarten",
      "college",
      "university",
      "music_school",
      "language_school",
      "dancing_school",
      "childcare",
    ],
  },
  Services: {
    amenity: [
      "bank",
      "atm",
      "bureau_de_change",
      "post_office",
      "police",
      "fire_station",
      "courthouse",
      "embassy",
      "car_wash",
      "car_rental",
      "fuel",
      "charging_station",
      "vehicle_inspection",
      "driving_school",
    ],
    craft: [
      "electrician",
      "plumber",
      "hvac",
      "roofer",
      "tiler",
      "plasterer",
      "carpenter",
      "joiner",
      "builder",
      "glaziery",
      "key_cutter",
      "locksmith",
      "window_construction",
      "insulation",
      "parquet_layer",
      "floorer",
      "scaffolder",
    ],
    office: [
      "estate_agent",
      "insurance",
      "lawyer",
      "accountant",
      "tax_advisor",
      "financial",
      "notary",
      "employment_agency",
    ],
    shop: [
      "hairdresser",
      "beauty",
      "cosmetics",
      "perfumery",
      "tattoo",
      "piercing",
      "nails",
      "laundry",
      "dry_cleaning",
      "tailor",
      "shoe_repair",
      "copyshop",
      "estate_agent",
      "travel_agency",
      "funeral_directors",
      "pawnbroker",
      "money_lender",
      "locksmith",
      "key_cutter",
      "pet_grooming",
      "storage_rental",
    ],
  },
  Workspaces: {
    amenity: ["coworking", "coworking_space", "conference_centre"],
    office: ["*"],
  },
  Shops: {
    amenity: ["marketplace"],
    shop: ["*"],
  },
};

const CATEGORY_ORDER = Object.keys(CATEGORY_TAGS);

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outFile = path.join(root, "data", "places.json");

function slugify(value) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/&/g, " and ")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function tagValues(tags, key) {
  const raw = tags[key];
  if (typeof raw !== "string" || raw.trim() === "") return [];
  return raw
    .split(";")
    .map((value) => value.trim().toLowerCase())
    .filter((value) => value && value !== "no" && value !== "false");
}

// drink=beer and drink:coffee=takeaway both count. drink:coffee=no does not.
function drinkValues(tags) {
  const values = new Set(tagValues(tags, "drink"));
  for (const [key, raw] of Object.entries(tags)) {
    if (!key.startsWith("drink:") || typeof raw !== "string") continue;
    const flag = raw.trim().toLowerCase();
    if (!flag || flag === "no" || flag === "false") continue;
    values.add(key.slice("drink:".length).toLowerCase());
  }
  return [...values];
}

function valuesFor(tags, key) {
  return key === "drink" ? drinkValues(tags) : tagValues(tags, key);
}

function listMatches(values, expected) {
  if (!Array.isArray(expected) || values.length === 0) return false;
  const allowed = expected.map((value) => value.toLowerCase());
  return allowed.includes("*") || values.some((value) => allowed.includes(value));
}

// bar=yes files a place under Bars only when it is not a restaurant or café.
// Four Quarters has no restaurant or café tag, so bar=yes keeps it here.
function barTagCounts(tags, expected) {
  if (!listMatches(tagValues(tags, "bar"), expected)) return false;
  const amenities = tagValues(tags, "amenity");
  return !amenities.some((value) => value === "restaurant" || value === "cafe");
}

function matches(tags, rules) {
  for (const [key, expected] of Object.entries(rules)) {
    if (key === "when") continue;
    if (key === "bar") {
      if (barTagCounts(tags, expected)) return true;
      continue;
    }
    if (listMatches(valuesFor(tags, key), expected)) return true;
  }

  const combos = Array.isArray(rules.when) ? rules.when : [];
  return combos.some((combo) =>
    Object.entries(combo).every(([key, expected]) => listMatches(valuesFor(tags, key), expected)),
  );
}

function categorize(tags) {
  for (const [category, rules] of Object.entries(CATEGORY_TAGS)) {
    if (matches(tags, rules)) return category;
  }
  return "Other";
}

function firstTag(tags, keys) {
  for (const key of keys) {
    const value = tags[key];
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return null;
}

function formatAddress(tags) {
  const full = firstTag(tags, ["addr:full"]);
  if (full) return full;

  const street = [tags["addr:housenumber"], tags["addr:housename"], tags["addr:street"] || tags["addr:place"]]
    .filter((part) => typeof part === "string" && part.trim())
    .map((part) => part.trim())
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();

  const parts = [street, tags["addr:suburb"], tags["addr:city"], tags["addr:postcode"]]
    .filter((part) => typeof part === "string" && part.trim())
    .map((part) => part.trim());

  return parts.length > 0 ? parts.join(", ") : null;
}

function coordinates(element) {
  const lat = element.type === "node" ? element.lat : element.center?.lat;
  const lng = element.type === "node" ? element.lon : element.center?.lon;
  if (typeof lat !== "number" || typeof lng !== "number") return null;
  return {
    lat: Math.round(lat * 1e6) / 1e6,
    lng: Math.round(lng * 1e6) / 1e6,
  };
}

function toPlace(element) {
  const tags = element.tags ?? {};
  const name = typeof tags.name === "string" ? tags.name.trim() : "";
  if (!name) return null;

  const point = coordinates(element);
  if (!point) return null;

  const category = categorize(tags);
  return {
    id: `${element.type}/${element.id}`,
    name,
    category,
    categorySlug: slugify(category),
    lat: point.lat,
    lng: point.lng,
    address: formatAddress(tags),
    website: firstTag(tags, ["website", "contact:website", "url"]),
    phone: firstTag(tags, ["phone", "contact:phone", "contact:mobile", "mobile"]),
    openingHours: firstTag(tags, ["opening_hours"]),
    tags: { ...tags },
  };
}

function richness(place) {
  return [place.address, place.website, place.phone, place.openingHours].filter(Boolean).length;
}

function distanceMetres(a, b) {
  const earth = 6371000;
  const toRad = (degrees) => (degrees * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * earth * Math.asin(Math.min(1, Math.sqrt(h)));
}

function buildQuery() {
  const bounds = `${BBOX.south},${BBOX.west},${BBOX.north},${BBOX.east}`;
  const statements = PLACE_TAG_KEYS.flatMap((key) => [
    `  node["name"]["${key}"](${bounds});`,
    `  way["name"]["${key}"](${bounds});`,
  ]);

  return `[out:json][timeout:90];
(
${statements.join("\n")}
);
out center;`;
}

async function fetchElements(query) {
  let lastError;

  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      const response = await fetch(OVERPASS_URL, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "User-Agent": "hwk-fetch-places/1.0 (neighborhood places directory)",
        },
        body: new URLSearchParams({ data: query }),
        signal: AbortSignal.timeout(120000),
      });

      if (!response.ok) {
        lastError = new Error(`OpenStreetMap responded with ${response.status} ${response.statusText}`);
        if (![429, 502, 503, 504].includes(response.status) || attempt === 3) throw lastError;
      } else {
        const payload = await response.json();
        if (!Array.isArray(payload.elements)) {
          throw new Error("OpenStreetMap did not return a list of places");
        }
        return payload.elements;
      }
    } catch (error) {
      lastError = error;
      if (attempt === 3) throw error;
    }

    await new Promise((resolve) => setTimeout(resolve, attempt * 4000));
  }

  throw lastError;
}

function dedupe(elements) {
  const byId = new Map();

  for (const element of elements) {
    const place = toPlace(element);
    if (!place) continue;
    const existing = byId.get(place.id);
    if (!existing || richness(place) > richness(existing)) byId.set(place.id, place);
  }

  const kept = [];
  for (const place of byId.values()) {
    const nameKey = slugify(place.name) || place.id;
    const duplicateIndex = kept.findIndex((existing) => {
      const existingKey = slugify(existing.name) || existing.id;
      return existingKey === nameKey && distanceMetres(existing, place) <= DUPLICATE_METRES;
    });

    if (duplicateIndex === -1) {
      kept.push(place);
      continue;
    }

    if (richness(place) > richness(kept[duplicateIndex])) {
      kept[duplicateIndex] = place;
    }
  }

  return kept;
}

function assignSlugs(places) {
  const used = new Set();

  for (const place of places) {
    const base = slugify(place.name) || place.id.replaceAll("/", "-");
    let slug = base;
    let suffix = 2;
    while (used.has(slug)) {
      slug = `${base}-${suffix}`;
      suffix += 1;
    }
    used.add(slug);
    place.slug = slug;
  }
}

function sortPlaces(places) {
  places.sort((a, b) => {
    const byCategory = CATEGORY_ORDER.indexOf(a.category) - CATEGORY_ORDER.indexOf(b.category);
    if (byCategory !== 0) return byCategory;
    const byName = a.name.localeCompare(b.name, "en");
    if (byName !== 0) return byName;
    return a.lat - b.lat || a.lng - b.lng;
  });
}

function publicPlace(place) {
  return {
    id: place.id,
    slug: place.slug,
    name: place.name,
    category: place.category,
    categorySlug: place.categorySlug,
    lat: place.lat,
    lng: place.lng,
    address: place.address,
    website: place.website,
    phone: place.phone,
    openingHours: place.openingHours,
    tags: place.tags,
  };
}

const elements = await fetchElements(buildQuery());
const found = dedupe(elements);
const places = found.filter((place) => place.category !== "Other");
const excluded = found.length - places.length;
sortPlaces(places);
assignSlugs(places);

await mkdir(path.dirname(outFile), { recursive: true });
await writeFile(outFile, `${JSON.stringify(places.map(publicPlace), null, 2)}\n`);

const counts = new Map(CATEGORY_ORDER.map((category) => [category, 0]));
for (const place of places) {
  counts.set(place.category, (counts.get(place.category) ?? 0) + 1);
}

console.log(`Saved ${places.length} places to data/places.json`);
console.log(`Left out ${excluded} places that did not match a category`);
for (const category of CATEGORY_ORDER) {
  console.log(`${category}: ${counts.get(category)}`);
}
