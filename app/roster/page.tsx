"use client";

import { useEffect, useMemo, useState } from "react";

type RoleType = "Tank" | "Healer" | "Support" | "DPS";

type Raider = {
  id: number;
  character_name: string;
  class_name: string;
  role_type: RoleType;
  raid_group: number;
};

const classes = [
  "Guardian", "Berserker", "Paladin", "Shadowknight", "Monk", "Bruiser",
  "Templar", "Inquisitor", "Warden", "Fury", "Mystic", "Defiler",
  "Dirge", "Troubador", "Coercer", "Illusionist",
  "Assassin", "Ranger", "Brigand", "Swashbuckler",
  "Wizard", "Warlock", "Conjuror", "Necromancer", "Beastlord", "Channeler",
];

const typeStyles: Record<RoleType, string> = {
  Tank: "bg-red-950/70 border-red-500/60",
  Healer: "bg-green-950/70 border-green-500/60",
  Support: "bg-blue-950/70 border-blue-500/60",
  DPS: "bg-orange-950/70 border-orange-500/60",
};

const classIconMap: Record<string, string> = {
  Guardian: "🛡️",
  Berserker: "🪓",
  Paladin: "⚜️",
  Shadowknight: "💀",
  Monk: "👊",
  Bruiser: "🥊",
  Templar: "✝️",
  Inquisitor: "🔥",
  Warden: "🌿",
  Fury: "🌩️",
  Mystic: "🔮",
  Defiler: "☠️",
  Dirge: "🎻",
  Troubador: "🎵",
  Coercer: "🌀",
  Illusionist: "✨",
  Assassin: "🗡️",
  Ranger: "🏹",
  Brigand: "🔪",
  Swashbuckler: "⚔️",
  Wizard: "❄️",
  Warlock: "🟣",
  Conjuror: "🔥",
  Necromancer: "💀",
  Beastlord: "🐺",
  Channeler: "🌌",
};

export default function RosterPage() {
  const [raiders, setRaiders] = useState<Raider[]>([]);
  const [characterName, setCharacterName] = useState("");
  const [className, setClassName] = useState(classes[0]);
  const [roleType, setRoleType] = useState<RoleType>("DPS");
  const [raidGroup, setRaidGroup] = useState(1);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  async function loadRoster() {
    setLoading(true);
    const response = await fetch("/api/roster");
    const data = await response.json();
    setRaiders(data);
    setLoading(false);
  }

  useEffect(() => {
    loadRoster();
  }, []);

  const groupedRaiders = useMemo(
    () =>
      [1, 2, 3, 4, 5].map((groupNumber) => ({
        groupNumber,
        label: groupNumber === 5 ? "Reserve" : `Group ${groupNumber}`,
        raiders: raiders.filter((raider) => raider.raid_group === groupNumber),
      })),
    [raiders]
  );

  async function addRaider() {
    if (!characterName.trim()) return;

    setSaving(true);

    const response = await fetch("/api/roster", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        characterName,
        className,
        roleType,
        raidGroup,
      }),
    });

    if (response.ok) {
      const newRaider = await response.json();
      setRaiders((current) => [...current, newRaider]);
      setCharacterName("");
    }

    setSaving(false);
  }

  async function deleteRaider(id: number) {
    const response = await fetch(`/api/roster/${id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      setRaiders((current) => current.filter((raider) => raider.id !== id));
    }
  }

  async function moveRaider(id: number, newGroup: number) {
    const response = await fetch(`/api/roster/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        raidGroup: newGroup,
      }),
    });

    if (response.ok) {
      const updatedRaider = await response.json();

      setRaiders((current) =>
        current.map((raider) =>
          raider.id === id ? updatedRaider : raider
        )
      );
    }
  }

  function onDropRaider(event: React.DragEvent<HTMLDivElement>, groupNumber: number) {
    const id = Number(event.dataTransfer.getData("raiderId"));
    if (id) moveRaider(id, groupNumber);
  }

  return (
    <main className="min-h-screen bg-black text-[#d8c39a]">
      <div className="min-h-screen bg-[radial-gradient(circle_at_top,#162235_0%,#07090b_45%,#020202_100%)]">
        <header className="border-b border-[#9b6a2f]/50 bg-black/70">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
            <a href="/" className="flex items-center gap-4">
              <img
                src="/guild-logo.png"
                className="h-16 w-16 rounded-full"
                alt="Shadow Syndicate"
              />

              <div>
                <div className="text-3xl font-bold tracking-wide text-[#f4d58a]">
                  SHADOW
                </div>
                <div className="text-3xl font-bold tracking-wide text-[#f4d58a]">
                  SYNDICATE
                </div>
              </div>
            </a>

            <nav className="hidden gap-10 text-sm font-semibold uppercase tracking-widest text-[#e4c67a] md:flex">
              <a href="/">Home</a>
              <a href="#">DKP</a>
              <a href="#">Gear Check</a>
              <a className="border-b border-[#d69a3a] pb-2" href="/roster">
                Roster
              </a>
              <a href="#">Events</a>
            </nav>
          </div>
        </header>

        <section className="mx-auto max-w-7xl px-6 py-10">
          <div className="border border-[#9b6a2f] bg-black/60 p-8">
            <h1 className="text-center text-4xl font-black uppercase tracking-widest text-[#f4d58a]">
              Raid Roster
            </h1>

            <p className="mx-auto mt-4 max-w-3xl text-center text-[#d8c39a]">
              Add characters, then drag and drop them into raid groups or reserve.
            </p>

            <div className="mt-8 grid gap-4 rounded border border-[#6f542c] bg-black/50 p-5 lg:grid-cols-[1fr_220px_180px_140px_auto]">
              <input
                value={characterName}
                onChange={(event) => setCharacterName(event.target.value)}
                placeholder="Character Name"
                className="border border-[#6f542c] bg-black px-4 py-3 text-[#f4d58a] outline-none"
              />

              <select
                value={className}
                onChange={(event) => setClassName(event.target.value)}
                className="border border-[#6f542c] bg-black px-4 py-3 text-[#f4d58a] outline-none"
              >
                {classes.map((eqClass) => (
                  <option key={eqClass}>{eqClass}</option>
                ))}
              </select>

              <select
                value={roleType}
                onChange={(event) => setRoleType(event.target.value as RoleType)}
                className="border border-[#6f542c] bg-black px-4 py-3 text-[#f4d58a] outline-none"
              >
                <option>Tank</option>
                <option>Healer</option>
                <option>Support</option>
                <option>DPS</option>
              </select>

              <select
                value={raidGroup}
                onChange={(event) => setRaidGroup(Number(event.target.value))}
                className="border border-[#6f542c] bg-black px-4 py-3 text-[#f4d58a] outline-none"
              >
                <option value={1}>Group 1</option>
                <option value={2}>Group 2</option>
                <option value={3}>Group 3</option>
                <option value={4}>Group 4</option>
                <option value={5}>Reserve</option>
              </select>

              <button
                onClick={addRaider}
                disabled={saving}
                className="border border-[#c6923e] bg-[#3a220f] px-6 py-3 font-bold uppercase text-[#f4d58a] disabled:opacity-50"
              >
                {saving ? "Saving..." : "Add"}
              </button>
            </div>
          </div>

          <div className="mt-6 grid gap-4 xl:grid-cols-2">
            {groupedRaiders.map(({ groupNumber, label, raiders }) => {
              const visibleSlots = groupNumber === 5 ? Math.max(6, raiders.length) : 6;

              return (
                <section
                  key={groupNumber}
                  className="border border-[#9b6a2f] bg-black/60"
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={(event) => onDropRaider(event, groupNumber)}
                >
                  <h2 className="bg-[#102133] py-4 text-center text-2xl uppercase tracking-widest text-[#f4d58a]">
                    {label}
                  </h2>

                  <div className="grid gap-4 p-5 sm:grid-cols-2">
                    {loading ? (
                      <div className="col-span-2 grid min-h-32 place-items-center border border-dashed border-[#6f542c] text-[#9b8a6f]">
                        Loading roster...
                      </div>
                    ) : (
                      Array.from({ length: visibleSlots }).map((_, index) => {
                        const raider = raiders[index];

                        if (!raider) {
                          return (
                            <div
                              key={`empty-${groupNumber}-${index}`}
                              className="grid min-h-28 place-items-center border border-dashed border-[#6f542c] bg-black/30 text-sm uppercase tracking-widest text-[#6f542c]"
                            >
                              Empty Slot
                            </div>
                          );
                        }

                        return (
                          <div
                            key={raider.id}
                            draggable
                            onDragStart={(event) =>
                              event.dataTransfer.setData("raiderId", String(raider.id))
                            }
                            className={`min-h-28 cursor-move border p-4 shadow-xl transition hover:scale-[1.01] ${typeStyles[raider.role_type]}`}
                          >
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex items-center gap-4">
                                <div className="grid h-14 w-14 place-items-center rounded-full border border-[#d69a3a] bg-black/70 text-2xl">
                                  {classIconMap[raider.class_name] ?? "⚔️"}
                                </div>

                                <div>
                                  <h3 className="text-xl font-bold text-[#f4d58a]">
                                    {raider.character_name}
                                  </h3>

                                  <p className="text-xs uppercase tracking-widest text-[#d8c39a]">
                                    {raider.class_name} • {raider.role_type}
                                  </p>
                                </div>
                              </div>

                              <button
                                onClick={() => deleteRaider(raider.id)}
                                className="text-xs uppercase tracking-widest text-red-300 hover:text-red-200"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </section>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}