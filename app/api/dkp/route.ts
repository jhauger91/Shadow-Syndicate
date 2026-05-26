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

  const rosterId = Number(body.rosterId);
  const raidName = body.raidName?.trim();
  const eventDate = body.eventDate;
  const eventType = body.eventType?.trim();
  const bossName = body.bossName?.trim() || null;
  const dkp = Number(body.dkp);

  if (!rosterId || !raidName || !eventDate || !eventType || Number.isNaN(dkp)) {
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
      dkp
    )
    VALUES (
      ${rosterId},
      ${raidName},
      ${eventDate},
      ${eventType},
      ${bossName},
      ${dkp}
    )
    RETURNING id
  `;

  return Response.json(result[0]);
}