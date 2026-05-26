"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type DkpHistory = {
  id: number;
  character_name: string;
  class_name: string;
  raid: string;
  date: string;
  event: string;
  notes: string | null;
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

  const [blanketMode, setBlanketMode] = useState(false);
  const [selectedRosterIds, setSelectedRosterIds] = useState<number[]>([]);

  const [rosterId, setRosterId] = useState("");
  const [raidName, setRaidName] = useState("");
  const [eventDate, setEventDate] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [eventType, setEventType] = useState("Attendance");
  const [bossName, setBossName] = useState("");
  const [notes, setNotes] = useState("");
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

  function toggleRosterSelection(id: number) {
    setSelectedRosterIds((current) =>
      current.includes(id)
        ? current.filter((rosterId) => rosterId !== id)
        : [...current, id]
    );
  }

  function selectAllRoster() {
    setSelectedRosterIds(characters.map((character) => character.id));
  }

  function clearRosterSelection() {
    setSelectedRosterIds([]);
  }

  async function addEvent() {
    if (
      (!blanketMode && !rosterId) ||
      (blanketMode && selectedRosterIds.length === 0) ||
      !raidName.trim() ||
      !eventDate ||
      !eventType ||
      !dkp
    ) {
      return;
    }

    setSaving(true);

    const response = await fetch("/api/dkp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        rosterId: blanketMode ? undefined : Number(rosterId),
        rosterIds: blanketMode ? selectedRosterIds : undefined,
        raidName,
        eventDate,
        eventType,
        bossName,
        notes,
        dkp: Number(dkp),
      }),
    });

    if (response.ok) {
      setRaidName("");
      setBossName("");
      setNotes("");
      setDkp("");
      setSelectedRosterIds([]);

      await loadDkp();
    }

    setSaving(false);
  }

  async function deleteEvent(id: number) {
    if (!confirm("Delete this DKP history event?")) return;

    const response = await fetch(`/api/dkp?id=${id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      await loadDkp();
    }
  }

  return (
    <main className="min-h-screen bg-[#050505] text-[#f4d58a]">
      <header className="border-b border-[#9b6a2f] bg-[#0b0b0b] px-8 py-5">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link
            href="/"
            className="text-xl font-black uppercase tracking-[0.35em] text-[#f4d58a]"
          >
            Shadow Syndicate
          </Link>

          <nav className="flex gap-6 text-sm font-bold uppercase tracking-widest text-[#c9a45c]">
            <Link href="/">Home</Link>

            <Link href="/dkp" className="text-[#f4d58a]">
              DKP
            </Link>

            <span>Gear Check</span>

            <Link href="/roster">Roster</Link>

            <span>Events</span>
          </nav>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-8 py-12">
        <p className="mb-2 text-sm uppercase tracking-[0.35em] text-[#c9a45c]">
          Shadow Syndicate Ledger
        </p>

        <h1 className="mb-4 text-5xl font-black uppercase tracking-widest">
          DKP Tracker
        </h1>

        <p className="mb-10 max-w-3xl text-[#d6c088]">
          Add raid attendance, progression kills, and loot deductions.
        </p>

        <section className="mb-12 rounded border border-[#9b6a2f] bg-[#111] p-6">
          <h2 className="mb-5 text-2xl font-black uppercase tracking-widest">
            Add DKP Event
          </h2>

          <div className="mb-6">
            <label className="flex items-center gap-3 text-sm font-bold uppercase tracking-widest text-[#c9a45c]">
              <input
                type="checkbox"
                checked={blanketMode}
                onChange={(event) => setBlanketMode(event.target.checked)}
              />
              Blanket Raid DKP Assignment
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-4">
            {!blanketMode ? (
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
            ) : (
              <div className="md:col-span-4 rounded border border-[#9b6a2f] bg-black p-4">
                <div className="mb-4 flex flex-wrap gap-3">
                  <button
                    onClick={selectAllRoster}
                    className="border border-[#9b6a2f] bg-[#141414] px-3 py-2 text-xs font-bold uppercase tracking-widest text-[#f4d58a] hover:bg-[#3a100b]"
                  >
                    Select All
                  </button>

                  <button
                    onClick={clearRosterSelection}
                    className="border border-[#9b6a2f] bg-[#141414] px-3 py-2 text-xs font-bold uppercase tracking-widest text-[#f4d58a] hover:bg-[#3a100b]"
                  >
                    Clear
                  </button>

                  <div className="flex items-center text-sm text-[#c9a45c]">
                    {selectedRosterIds.length} Selected
                  </div>
                </div>

                <div className="grid gap-2 md:grid-cols-4">
                  {characters.map((character) => (
                    <label
                      key={character.id}
                      className="flex items-center gap-2 text-sm text-[#f4d58a]"
                    >
                      <input
                        type="checkbox"
                        checked={selectedRosterIds.includes(character.id)}
                        onChange={() =>
                          toggleRosterSelection(character.id)
                        }
                      />

                      {character.character_name} -{" "}
                      {character.class_name}
                    </label>
                  ))}
                </div>
              </div>
            )}

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
              value={bossName}
              onChange={(event) => setBossName(event.target.value)}
              placeholder="Boss Name"
              className="border border-[#9b6a2f] bg-black px-3 py-2 text-sm text-[#f4d58a]"
            />

            <input
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              placeholder="Notes"
              className="border border-[#9b6a2f] bg-black px-3 py-2 text-sm text-[#f4d58a]"
            />

            <input
              type="number"
              value={dkp}
              onChange={(event) => setDkp(event.target.value)}
              placeholder="DKP"
              className="border border-[#9b6a2f] bg-black px-3 py-2 text-sm text-[#f4d58a]"
            />

            <button
              onClick={addEvent}
              disabled={saving}
              className="border border-[#9b6a2f] bg-[#3a100b] px-4 py-2 text-sm font-black uppercase tracking-widest text-[#f4d58a] hover:bg-[#5a1a10] disabled:opacity-50"
            >
              {saving ? "Saving..." : "Add Event"}
            </button>
          </div>
        </section>

        <section>
          <h2 className="mb-5 text-2xl font-black uppercase tracking-widest">
            Guild DKP Standings
          </h2>

          {loading ? (
            <p>Loading DKP ledger...</p>
          ) : (
            <div className="overflow-hidden rounded border border-[#9b6a2f]">
              <table className="w-full border-collapse text-left text-sm">
                <thead className="bg-[#1a1a1a] uppercase tracking-widest text-[#c9a45c]">
                  <tr>
                    <th className="p-4">Rank</th>
                    <th className="p-4">Character</th>
                    <th className="p-4">Class</th>
                    <th className="p-4">DKP</th>
                    <th className="p-4">History</th>
                  </tr>
                </thead>

                <tbody>
                  {characters.map((character, index) => {
                    const isOpen = openCharacterId === character.id;

                    return (
                      <>
                        <tr
                          key={character.id}
                          className="border-t border-[#33210d] bg-[#0b0b0b]"
                        >
                          <td className="p-4">#{index + 1}</td>

                          <td className="p-4 font-bold">
                            {character.character_name}
                          </td>

                          <td className="p-4">
                            {character.class_name}
                          </td>

                          <td className="p-4 font-black">
                            {character.dkp}
                          </td>

                          <td className="p-4">
                            <button
                              onClick={() =>
                                setOpenCharacterId(
                                  isOpen ? null : character.id
                                )
                              }
                              className="border border-[#9b6a2f] bg-[#141414] px-4 py-2 text-xs font-bold uppercase tracking-widest text-[#f4d58a] hover:bg-[#3a100b]"
                            >
                              {isOpen ? "Close" : "View"}
                            </button>
                          </td>
                        </tr>

                        {isOpen && (
                          <tr className="border-t border-[#33210d] bg-black">
                            <td colSpan={5} className="p-4">
                              {character.history.length === 0 ? (
                                <p>No DKP history yet.</p>
                              ) : (
                                <table className="w-full border-collapse text-left text-xs">
                                  <thead className="uppercase tracking-widest text-[#c9a45c]">
                                    <tr>
                                      <th className="p-2">Character</th>
                                      <th className="p-2">Class</th>
                                      <th className="p-2">Raid</th>
                                      <th className="p-2">Date</th>
                                      <th className="p-2">Event</th>
                                      <th className="p-2">Notes</th>
                                      <th className="p-2">DKP</th>
                                      <th className="p-2">Actions</th>
                                    </tr>
                                  </thead>

                                  <tbody>
                                    {character.history.map((entry) => (
                                      <tr
                                        key={entry.id}
                                        className="border-t border-[#33210d]"
                                      >
                                        <td className="p-2">
                                          {entry.character_name}
                                        </td>

                                        <td className="p-2">
                                          {entry.class_name}
                                        </td>

                                        <td className="p-2">
                                          {entry.raid}
                                        </td>

                                        <td className="p-2">
                                          {new Date(
                                            entry.date
                                          ).toLocaleDateString()}
                                        </td>

                                        <td className="p-2">
                                          {entry.event}
                                        </td>

                                        <td className="p-2">
                                          {entry.notes || "-"}
                                        </td>

                                        <td className="p-2 font-bold">
                                          {entry.dkp > 0
                                            ? `+${entry.dkp}`
                                            : entry.dkp}
                                        </td>

                                        <td className="p-2">
                                          <button
                                            onClick={() =>
                                              deleteEvent(entry.id)
                                            }
                                            className="border border-red-800 px-3 py-1 text-xs font-bold uppercase text-red-300 hover:bg-red-950"
                                          >
                                            Delete
                                          </button>
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              )}
                            </td>
                          </tr>
                        )}
                      </>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </section>
    </main>
  );
}