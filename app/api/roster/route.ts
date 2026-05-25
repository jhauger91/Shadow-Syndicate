import { sql } from "@/lib/db";

export async function GET() {
  const roster = await sql`
    SELECT
      id,
      character_name,
      class_name,
      role_type,
      raid_group
    FROM raid_roster
    ORDER BY raid_group ASC, character_name ASC
  `;

  return Response.json(roster);
}

export async function POST(request: Request) {
  const body = await request.json();

  const characterName = body.characterName?.trim();
  const className = body.className?.trim();
  const roleType = body.roleType?.trim();
  const raidGroup = Number(body.raidGroup);

  if (!characterName || !className || !roleType || !raidGroup) {
    return Response.json(
      { error: "Missing required roster fields." },
      { status: 400 }
    );
  }

  const result = await sql`
    INSERT INTO raid_roster (
      character_name,
      class_name,
      role_type,
      raid_group
    )
    VALUES (
      ${characterName},
      ${className},
      ${roleType},
      ${raidGroup}
    )
    RETURNING
      id,
      character_name,
      class_name,
      role_type,
      raid_group
  `;

  return Response.json(result[0]);
}