import { sql } from "@/lib/db";

export async function GET() {
  const rows = await sql`
    SELECT
      r.id,
      r.character_name,
      r.class_name,
      COALESCE(SUM(h.dkp), 0)::int AS dkp,
      COALESCE(
        json_agg(
          json_build_object(
            'id', h.id,
            'character_name', r.character_name,
            'class_name', r.class_name,
            'raid', h.raid_name,
            'date', h.event_date,
            'event', CASE
              WHEN h.event_type = 'Attendance'
              THEN h.raid_name || ' - Attendance'
              WHEN h.event_type = 'Progression Kill'
              THEN h.raid_name || ' - Progression Kill (' || COALESCE(h.boss_name, 'Boss') || ')'
              WHEN h.event_type = 'Loot Awarded'
              THEN 'Loot Awarded (Negative)'
              ELSE h.event_type
            END,
            'notes', h.notes,
            'loot_item', h.loot_item,
            'dkp', h.dkp
          )
          ORDER BY h.event_date DESC, h.id DESC
        ) FILTER (WHERE h.id IS NOT NULL),
        '[]'
      ) AS history
    FROM raid_roster r
    LEFT JOIN dkp_history h ON h.roster_id = r.id
    GROUP BY r.id, r.character_name, r.class_name
    ORDER BY dkp DESC, r.character_name ASC
  `;

  return Response.json(rows);
}

export async function POST(request: Request) {
  const body = await request.json();

  const rosterIds = Array.isArray(body.rosterIds)
    ? body.rosterIds.map(Number).filter(Boolean)
    : [Number(body.rosterId)].filter(Boolean);

  const raidName = body.raidName?.trim();
  const eventDate = body.eventDate;
  const eventType = body.eventType?.trim();
  const bossName = body.bossName?.trim() || null;
  const notes = body.notes?.trim() || null;
  const dkp = Number(body.dkp);
  const lootItem = body.lootItem || null;

  if (
    rosterIds.length === 0 ||
    !raidName ||
    !eventDate ||
    !eventType ||
    Number.isNaN(dkp)
  ) {
    return Response.json(
      { error: "Missing required DKP fields." },
      { status: 400 }
    );
  }

  const result = await sql`
    INSERT INTO dkp_history (
      roster_id,
      raid_name,
      event_date,
      event_type,
      boss_name,
      notes,
      loot_item,
      dkp
    )
    SELECT
      roster_id,
      ${raidName},
      ${eventDate},
      ${eventType},
      ${bossName},
      ${notes},
      ${lootItem ? JSON.stringify(lootItem) : null}::jsonb,
      ${dkp}
    FROM unnest(${rosterIds}::int[]) AS roster_id
    RETURNING id
  `;

  return Response.json({
    success: true,
    inserted: result.length,
    ids: result.map((row) => row.id),
  });
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = Number(searchParams.get("id"));

  if (!id) {
    return Response.json(
      { error: "Missing DKP history id." },
      { status: 400 }
    );
  }

  await sql`
    DELETE FROM dkp_history
    WHERE id = ${id}
  `;

  return Response.json({ success: true });
}