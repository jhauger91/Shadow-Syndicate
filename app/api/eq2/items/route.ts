import { NextResponse } from "next/server";

function normalizeTitle(name: string) {
  return name.trim().replace(/\s+/g, "_");
}

function stripComments(value: string) {
  return value.replace(/<!--[\s\S]*?-->/g, "");
}

function cleanWikiText(value: string) {
  return stripComments(value)
    .replace(/\[\[/g, "")
    .replace(/\]\]/g, "")
    .replace(/'''/g, "")
    .replace(/''/g, "")
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function getTemplateValue(raw: string, key: string) {
  const noComments = stripComments(raw);
  const regex = new RegExp(`\\|\\s*${key}\\s*=\\s*([^\\n\\r|]*)`, "i");
  const match = noComments.match(regex);
  return match ? cleanWikiText(match[1]) : "";
}

function formatSignedNumber(value: string) {
  return value.replace("+", "").trim();
}

function parseFlags(raw: string) {
  const flags = getTemplateValue(raw, "flags")
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean);

  const map: Record<string, string> = {
    "lore-equip": "LORE-EQUIP",
    attunable: "ATTUNEABLE",
    attuneable: "ATTUNEABLE",
    heirloom: "HEIRLOOM",
    lore: "LORE",
    "no-trade": "NO-TRADE",
  };

  return flags.map((flag) => map[flag] || flag.toUpperCase());
}

function parseClasses(raw: string) {
  const classes = getTemplateValue(raw, "classes");
  const output: string[] = [];

  if (classes.includes("AllScoutCats")) output.push("All Scouts");
  if (classes.includes("AllMageCats")) output.push("All Mages");
  if (classes.includes("AllCrusaderCats")) output.push("Paladin", "Shadowknight");
  if (classes.includes("AllWarriorCats")) output.push("Berserker", "Guardian");
  if (classes.includes("AllShamanCats")) output.push("Defiler", "Mystic");
  if (classes.includes("Channeler")) output.push("Channeler");

  return output;
}

function parseItem(raw: string, fallbackName: string, title: string, url: string) {
  const str = getTemplateValue(raw, "str");
  const sta = getTemplateValue(raw, "sta");
  const comskills = getTemplateValue(raw, "comskills");
  const crit = getTemplateValue(raw, "crit");
  const critbonus = getTemplateValue(raw, "critbonus");
  const potency = getTemplateValue(raw, "potency");
  const acspeed = getTemplateValue(raw, "acspeed");
  const abmod = getTemplateValue(raw, "abmod");
  const level = getTemplateValue(raw, "level");

  const greenStats: string[] = [];
  const blueStats: string[] = [];

  if (str || sta) {
    greenStats.push(
      `${str ? `${formatSignedNumber(str)} Primary Attributes` : ""}${
        sta ? ` ${formatSignedNumber(sta)} Stamina` : ""
      }`.trim()
    );
  }

  if (comskills) greenStats.push(`${formatSignedNumber(comskills)} Combat Skills`);
  if (crit) blueStats.push(`${crit}% Crit Chance`);
  if (critbonus) blueStats.push(`${critbonus}% Crit Bonus`);
  if (potency) blueStats.push(`${potency}% Potency`);
  if (acspeed) blueStats.push(`${acspeed}% Casting Speed`);
  if (abmod) blueStats.push(`${formatSignedNumber(abmod)} Ability Mod`);

  return {
    exists: true,
    name: fallbackName,
    title,
    url,
    rarity: getTemplateValue(raw, "icat"),
    flags: parseFlags(raw),
    greenStats,
    blueStats,
    itemType: getTemplateValue(raw, "wtype"),
    weaponType: getTemplateValue(raw, "dtype"),
    damage: getTemplateValue(raw, "dmg"),
    delay: getTemplateValue(raw, "delay"),
    rating: getTemplateValue(raw, "drating"),
    level,
    tier: level ? String(Math.ceil(Number(level) / 10) + 1) : "",
    classes: parseClasses(raw),
  };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim();

  if (!q) {
    return NextResponse.json({ error: "Missing q" }, { status: 400 });
  }

  const directTitle = `${normalizeTitle(q)}_(Item)`;

  const fandomUrl =
    "https://eq2.fandom.com/api.php?action=query" +
    `&titles=${encodeURIComponent(directTitle)}` +
    "&prop=revisions" +
    "&rvprop=content" +
    "&rvslots=main" +
    "&format=json" +
    "&origin=*";

  const response = await fetch(fandomUrl, {
    next: { revalidate: 60 * 60 * 24 },
  });

  const data = await response.json();
  const pages = data?.query?.pages ?? {};
  const page = Object.values(pages)[0] as any;

  if (!page || page.missing) {
    return NextResponse.json({ exists: false, title: directTitle });
  }

  const raw =
    page.revisions?.[0]?.slots?.main?.["*"] ??
    page.revisions?.[0]?.["*"] ??
    "";

  const pageUrl = `https://eq2.fandom.com/wiki/${encodeURIComponent(
    page.title.replaceAll(" ", "_")
  )}`;

  return NextResponse.json(parseItem(raw, q, page.title, pageUrl));
}