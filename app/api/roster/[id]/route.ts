import { sql } from "@/lib/db";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();

  const raidGroup = Number(body.raidGroup);

  if (!raidGroup || raidGroup < 1 || raidGroup > 5) {
    return Response.json(
      { error: "Raid group must be between 1 and 5." },
      { status: 400 }
    );
  }

  const result = await sql`
    UPDATE raid_roster
    SET raid_group = ${raidGroup}
    WHERE id = ${Number(id)}
    RETURNING
      id,
      character_name,
      class_name,
      role_type,
      raid_group
  `;

  return Response.json(result[0]);
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  await sql`
    DELETE FROM raid_roster
    WHERE id = ${Number(id)}
  `;

  return Response.json({ success: true });
}