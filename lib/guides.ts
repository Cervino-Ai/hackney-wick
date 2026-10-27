import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { marked } from "marked";
import { getPlaces, type Place } from "@/lib/places";

export type Guide = {
  slug: string;
  title: string;
  description: string;
  date: string;
  draft: boolean;
  places: string[];
  body: string;
};

const guidesDirectory = path.join(process.cwd(), "content/guides");

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

marked.use({
  gfm: true,
  renderer: {
    html() {
      return "";
    },
  },
});

function readString(data: Record<string, unknown>, key: string, file: string) {
  const value = data[key];
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`${file}: frontmatter "${key}" must be a non-empty string`);
  }
  return value.trim();
}

function readDate(value: unknown, file: string) {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    const year = value.getUTCFullYear();
    const month = String(value.getUTCMonth() + 1).padStart(2, "0");
    const day = String(value.getUTCDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  throw new Error(`${file}: frontmatter "date" must be YYYY-MM-DD`);
}

function readPlaces(value: unknown, file: string) {
  if (value == null) return [];
  if (!Array.isArray(value) || value.some((item) => typeof item !== "string" || item.trim() === "")) {
    throw new Error(`${file}: frontmatter "places" must be a list of place slugs`);
  }
  return value.map((item) => item.trim());
}

function readDraft(value: unknown, file: string) {
  if (value == null) return false;
  if (typeof value !== "boolean") {
    throw new Error(`${file}: frontmatter "draft" must be true or false`);
  }
  return value;
}

function loadGuides(): Guide[] {
  if (!fs.existsSync(guidesDirectory)) return [];

  return fs
    .readdirSync(guidesDirectory)
    .filter((name) => name.endsWith(".md"))
    .map((name) => {
      const filePath = path.join(guidesDirectory, name);
      const raw = fs.readFileSync(filePath, "utf8");
      const { data, content } = matter(raw);
      const frontmatter = data as Record<string, unknown>;

      return {
        slug: name.slice(0, -3),
        title: readString(frontmatter, "title", name),
        description: readString(frontmatter, "description", name),
        date: readDate(frontmatter.date, name),
        draft: readDraft(frontmatter.draft, name),
        places: readPlaces(frontmatter.places, name),
        body: content.trim(),
      };
    });
}

const guides = loadGuides();

export function getPublishedGuides() {
  return guides
    .filter((guide) => !guide.draft)
    .sort((a, b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title, "en"));
}

export function getPublishedGuide(slug: string) {
  return getPublishedGuides().find((guide) => guide.slug === slug);
}

export function getLatestGuides(limit: number) {
  return getPublishedGuides().slice(0, limit);
}

export function getGuidePlaces(guide: Guide): Place[] {
  const places = getPlaces();
  return guide.places.flatMap((slug) => {
    const place = places.find((item) => item.slug === slug);
    return place ? [place] : [];
  });
}

export function renderGuideMarkdown(markdown: string) {
  return marked.parse(markdown, { async: false });
}

export function formatGuideDate(isoDate: string) {
  const [year, month, day] = isoDate.split("-").map(Number);
  return `${day} ${months[month - 1]} ${year}`;
}
