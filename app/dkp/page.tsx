"use client";

import { useEffect, useState } from "react";

type DkpHistory = {
  id: number;
  character_name: string;
  class_name: string;
  raid: string;
  date: string;
  event: string;
  dkp: number;
};

type DkpCharacter = {
  id: number;
  character_name: string;
  class_name: string;
  dkp: number;
  history: DkpHistory[];
};

export default function DkpPage() {
  const [characters, setCharacters] = useState<DkpCharacter[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [openCharacterId, setOpenCharacterId] = useState<number | null>(null);

  const [rosterId, setRosterId] = useState("");
  const [raidName, setRaidName] = useState("");
  const [eventDate, setEventDate] = useState(new Date().toISOString().slice(0, 10));
  const [eventType, setEventType] = useState("Attendance");
  const [bossName, setBossName] = useState("");
  const [dkp, setDkp] = useState("");

  async function loadDkp() {
    setLoading(true);
    const response = await fetch("/api/dkp");
    const data = await response.json();
    setCharacters(data);
    setLoading(false);
  }

  useEffect(() => {
    loadDkp();
  }, []);

  async function addEvent() {
    if (!rosterId || !raidName.trim() || !eventDate || !eventType || !dkp) return;

    setSaving(true);

    const response = await fetch("/api/dkp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        rosterId: Number(rosterId),
        raidName,
        eventDate,
        eventType,
        bossName,
        dkp: Number(dkp),
      }),
    });

    if (response.ok) {
      setRaidName("");
      setBossName("");
      setDkp("");
      await loadDkp();
    }

    setSaving(false);
  }

  return (
    <main className="min-h-screen bg-black text-[#d8c39a]">
      <div className="min-h-screen bg-[radial-gradient(circle_at_top,#162235_0%,#07090b_42%,#020202_100%)]">
        <div className="fixed inset-0 opacity-30">
          <div className="absolute inset-0 bg-[url('/a_dark_fantasy_mmorpg_guild_website_homepage_hero.png')] bg-cover bg-center opacity-20" />
          <div className="absolute inset-0 bg-black/80" />
        </div>

        <header className="relative z-10 border-b border-[#9b6a2f]/50 bg-black/70 backdrop-blur">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
            <a href="/" className="flex items-center gap-4">
              <img
                src="/guild-logo.png"
                alt="Shadow Syndicate"
                className="h-14 w-14 rounded-full border border-[#9b6a2f]/70"
              />

              <div>
                <div className="text-2xl font-bold tracking-wide text-[#f4d58a]">
                  SHADOW
                </div>
                <div className="text-2xl font-bold tracking-wide text-[#f4d58a]">
                  SYNDICATE
                </div>
              </div>
            </a>

            <nav className="hidden gap-10 text-sm font-semibold uppercase tracking-widest text-[#e4c67a] md:flex">
              <a href="/" className="hover:text-[#f4d58a]">Home</a>
              <a className="border-b border-[#d69a3a] pb-2" href="/dkp">DKP</a>
              <a href="#" className="opacity-60">Gear Check</a>
              <a href="/roster" className="hover:text-[#f4d58a]">Roster</a>
              <a href="#" className="opacity-60">Events</a>
            </nav>
          </div>
        </header>

        <section className="relative z-10 mx-auto max-w-6xl px-6 py-8">
          <div className="rounded-3xl border border-[#9b6a2f]/70 bg-black/75 p-8 shadow-[0_0_80px_rgba(60,110,180,0.24)] backdrop-blur">
            <p className="text-sm font-bold uppercase tracking-[0.35em] text-[#d69a3a]">
              Shadow Syndicate Ledger
            </p>

            <h1 className="mt-3 text-5xl font-black uppercase tracking-[0.12em] text-[#f4d58a]">
              DKP Tracker
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-[#d8c39a]">
              Add raid attendance, progression kills, and loot deductions.
            </p>
          </div>
        </section>

        <section className="relative z-10 mx-auto max-w-6xl px-6 pb-6">
          <div className="rounded-2xl border border-[#9b6a2f]/70 bg-black/75 p-5 backdrop-blur">
            <h2 className="mb-4 text-xl uppercase tracking-[0.2em] text-[#f4d58a]">
              Add DKP Event
            </h2>

            <div className="grid gap-3 lg:grid-cols-6">
              <select
                value={rosterId}
                onChange={(event) => setRosterId(event.target.value)}
                className="border border-[#9b6a2f] bg-black px-3 py-2 text-sm text-[#f4d58a]"
              >
                <option value="">Character</option>
                {characters.map((character) => (
                  <option key={character.id} value={character.id}>
                    {character.character_name} - {character.class_name}
                  </option>
                ))}
              </select>

              <input
                value={raidName}
                onChange={(event) => setRaidName(event.target.value)}
                placeholder="Raid Name"
                className="border border-[#9b6a2f] bg-black px-3 py-2 text-sm text-[#f4d58a]"
              />

              <input
                type="date"
                value={eventDate}
                onChange={(event) => setEventDate(event.target.value)}
                className="border border-[#9b6a2f] bg-black px-3 py-2 text-sm text-[#f4d58a]"
              />

              <select
                value={eventType}
                onChange={(event) => setEventType(event.target.value)}
                className="border border-[#9b6a2f] bg-black px-3 py-2 text-sm text-[#f4d58a]"
              >
                <option>Attendance</option>
                <option>Progression Kill</option>
                <option>Loot Awarded</option>
              </select>

              <input
                value={eventType === "Progression Kill" ? bossName : dkp}
                onChange={(event) =>
                  eventType === "Progression Kill"
                    ? setBossName(event.target.value)
                    : setDkp(event.target.value)
                }
                placeholder={eventType === "Progression Kill" ? "Boss Name" : "DKP"}
                className="border border-[#9b6a2f] bg-black px-3 py-2 text-sm text-[#f4d58a]"
              />

              {eventType === "Progression Kill" && (
                <input
                  value={dkp}
                  onChange={(event) => setDkp(event.target.value)}
                  placeholder="DKP"
                  className="border border-[#9b6a2f] bg-black px-3 py-2 text-sm text-[#f4d58a]"
                />
              )}
            </div>

            <button
              onClick={addEvent}
              disabled={saving}
              className="mt-4 border border-[#d69a3a] bg-[#3a100b] px-6 py-3 text-sm font-black uppercase tracking-widest text-[#f4d58a] hover:bg-[#6f542c] disabled:opacity-50"
            >
              {saving ? "Saving..." : "Add Event"}
            </button>
          </div>
        </section>

        <section className="relative z-10 mx-auto max-w-6xl px-6 pb-12">
          <div className="overflow-hidden rounded-2xl border border-[#9b6a2f]/70 bg-black/75 shadow-2xl backdrop-blur">
            <div className="border-b border-[#9b6a2f]/60 bg-[#102133]/80 px-6 py-4">
              <h2 className="text-center text-2xl uppercase tracking-[0.25em] text-[#f4d58a]">
                Guild DKP Standings
              </h2>
            </div>

            <div className="p-4">
              <table className="w-full border-separate border-spacing-y-2 text-sm">
                <thead className="text-xs uppercase tracking-[0.22em] text-[#d69a3a]">
                  <tr>
                    <th className="px-4 py-2 text-left">Rank</th>
                    <th className="px-4 py-2 text-left">Character</th>
                    <th className="px-4 py-2 text-left">Class</th>
                    <th className="px-4 py-2 text-right">DKP</th>
                    <th className="px-4 py-2 text-right">History</th>
                  </tr>
                </thead>

                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="border border-[#6f542c] bg-black/70 px-4 py-8 text-center">
                        Loading DKP ledger...
                      </td>
                    </tr>
                  ) : (
                    characters.map((character, index) => {
                      const isOpen = openCharacterId === character.id;

                      return (
                        <>
                          <tr key={character.id} className="bg-[#07090b]/90 transition hover:bg-[#111820]">
                            <td className="border-y border-l border-[#6f542c]/60 px-4 py-3 text-[#d69a3a]">
                              #{index + 1}
                            </td>
                            <td className="border-y border-[#6f542c]/60 px-4 py-3 font-bold text-[#f4d58a]">
                              {character.character_name}
                            </td>
                            <td className="border-y border-[#6f542c]/60 px-4 py-3">
                              {character.class_name}
                            </td>
                            <td className="border-y border-[#6f542c]/60 px-4 py-3 text-right text-lg font-black text-[#f4d58a]">
                              {character.dkp}
                            </td>
                            <td className="border-y border-r border-[#6f542c]/60 px-4 py-3 text-right">
                              <button
                                onClick={() => setOpenCharacterId(isOpen ? null : character.id)}
                                className="border border-[#9b6a2f] bg-[#141414] px-4 py-2 text-xs font-bold uppercase tracking-widest text-[#f4d58a] hover:bg-[#3a100b]"
                              >
                                {isOpen ? "Close" : "View"}
                              </button>
                            </td>
                          </tr>

                          {isOpen && (
                            <tr>
                              <td colSpan={5} className="px-0 pb-3">
                                <div className="border border-[#9b6a2f]/60 bg-black/80 p-4">
                                  <table className="w-full text-xs">
                                    <thead className="border-b border-[#6f542c] text-[#d69a3a]">
                                      <tr className="uppercase tracking-[0.16em]">
                                        <th className="py-2 text-left">Character</th>
                                        <th className="py-2 text-left">Class</th>
                                        <th className="py-2 text-left">Raid</th>
                                        <th className="py-2 text-left">Date</th>
                                        <th className="py-2 text-left">Event</th>
                                        <th className="py-2 text-right">DKP</th>
                                      </tr>
                                    </thead>

                                    <tbody>
                                      {character.history.length === 0 ? (
                                        <tr>
                                          <td colSpan={6} className="py-5 text-center text-[#8f805f]">
                                            No DKP history yet.
                                          </td>
                                        </tr>
                                      ) : (
                                        character.history.map((entry) => (
                                          <tr key={entry.id} className="border-b border-[#3d3322]">
                                            <td className="py-2 text-[#f4d58a]">{entry.character_name}</td>
                                            <td className="py-2">{entry.class_name}</td>
                                            <td className="py-2">{entry.raid}</td>
                                            <td className="py-2">{new Date(entry.date).toLocaleDateString()}</td>
                                            <td className="py-2">{entry.event}</td>
                                            <td className={`py-2 text-right font-black ${entry.dkp < 0 ? "text-red-300" : "text-green-300"}`}>
                                              {entry.dkp > 0 ? `+${entry.dkp}` : entry.dkp}
                                            </td>
                                          </tr>
                                        ))
                                      )}
                                    </tbody>
                                  </table>
                                </div>
                              </td>
                            </tr>
                          )}
                        </>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}