"use client";

import Link from "next/link";
import Eq2ItemTooltip from "@/components/Eq2ItemTooltip";
import React, { useEffect, useState } from "react";

type LootItem = {
  exists: boolean;
  name: string;
  title: string;
  url: string;
  rarity?: string;
  flags?: string[];
  level?: string;
  tier?: string;
  itemType?: string;
  weaponType?: string;
  stats?: string[];
  raw?: string;
};

type DkpHistory = {
  id: number;
  character_name: string;
  class_name: string;
  raid: string;
  date: string;
  event: string;
  notes: string | null;
  loot_item: LootItem | null;
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
  const [eventDate, setEventDate] = useState(new Date().toISOString().slice(0, 10));
  const [eventType, setEventType] = useState("Attendance");
  const [bossName, setBossName] = useState("");
  const [notes, setNotes] = useState("");
  const [dkp, setDkp] = useState("");

  const [lootItemName, setLootItemName] = useState("");
  const [lootItem, setLootItem] = useState<LootItem | null>(null);
  const [lootStatus, setLootStatus] = useState("");

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

  async function checkLootItem(name: string) {
    setLootItem(null);
    setLootStatus("");

    if (!name.trim()) return null;

    setLootStatus("Checking EQ2 Fandom...");

    const response = await fetch(`/api/eq2/items?q=${encodeURIComponent(name)}`);
    const data = await response.json();

    if (data.exists) {
      setLootItem(data);
      setLootStatus(`Item found: ${data.title}`);
      return data as LootItem;
    }

    setLootStatus("No matching EQ2 Fandom item found.");
    return null;
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

    let itemToSave = lootItem;

    if (lootItemName.trim() && !itemToSave) {
      const checkedItem = await checkLootItem(lootItemName);

      if (!checkedItem) {
        setLootStatus("No matching EQ2 Fandom item found. Event not saved.");
        setSaving(false);
        return;
      }

      itemToSave = checkedItem;
    }

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
        lootItem: itemToSave,
        dkp: Number(dkp),
      }),
    });

    if (response.ok) {
      setRaidName("");
      setBossName("");
      setNotes("");
      setDkp("");
      setLootItemName("");
      setLootItem(null);
      setLootStatus("");
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
      <nav className="border-b border-[#3a100b] bg-black px-8 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div className="text-xl font-bold tracking-widest text-[#d4af37]">
            Shadow Syndicate
          </div>

          <div className="flex gap-6 text-sm uppercase tracking-widest">
            <Link href="/">Home</Link>
            <Link href="/dkp">DKP</Link>
            <Link href="/gear">Gear Check</Link>
            <Link href="/roster">Roster</Link>
            <Link href="/events">Events</Link>
          </div>
        </div>
      </nav>

      <section className="mx-auto max-w-6xl px-8 py-10">
        <p className="mb-2 text-sm uppercase tracking-[0.4em] text-[#9b6a2f]">
          Shadow Syndicate Ledger
        </p>

        <h1 className="mb-4 text-4xl font-bold text-[#d4af37]">DKP Tracker</h1>

        <p className="mb-10 text-[#c8b88a]">
          Add raid attendance, progression kills, and loot deductions.
        </p>

        <section className="mb-10 rounded border border-[#3a100b] bg-[#0b0b0b] p-6">
          <h2 className="mb-4 text-2xl font-bold text-[#d4af37]">
            Add DKP Event
          </h2>

          <label className="mb-4 flex items-center gap-2 text-sm text-[#c8b88a]">
            <input
              type="checkbox"
              checked={blanketMode}
              onChange={(event) => setBlanketMode(event.target.checked)}
            />
            Blanket Raid DKP Assignment
          </label>

          <div className="grid gap-4 md:grid-cols-2">
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
              <div className="md:col-span-2 rounded border border-[#3a100b] bg-black p-4">
                <div className="mb-3 flex gap-3">
                  <button
                    onClick={selectAllRoster}
                    className="border border-[#9b6a2f] px-3 py-1 text-xs font-bold uppercase"
                  >
                    Select All
                  </button>

                  <button
                    onClick={clearRosterSelection}
                    className="border border-[#9b6a2f] px-3 py-1 text-xs font-bold uppercase"
                  >
                    Clear
                  </button>

                  <span className="text-sm text-[#c8b88a]">
                    {selectedRosterIds.length} Selected
                  </span>
                </div>

                <div className="grid gap-2 md:grid-cols-3">
                  {characters.map((character) => (
                    <label key={character.id} className="text-sm text-[#c8b88a]">
                      <input
                        type="checkbox"
                        checked={selectedRosterIds.includes(character.id)}
                        onChange={() => toggleRosterSelection(character.id)}
                        className="mr-2"
                      />
                      {character.character_name} - {character.class_name}
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
              value={lootItemName}
              onChange={(event) => {
                setLootItemName(event.target.value);
                setLootItem(null);
                setLootStatus("");
              }}
              onBlur={() => checkLootItem(lootItemName)}
              placeholder="Loot Item Name"
              className="border border-[#9b6a2f] bg-black px-3 py-2 text-sm text-[#f4d58a]"
            />

            <button
              type="button"
              onClick={() => checkLootItem(lootItemName)}
              className="border border-[#9b6a2f] bg-[#141414] px-4 py-2 text-xs font-bold uppercase tracking-widest text-[#f4d58a] hover:bg-[#3a100b]"
            >
              Check Loot Item
            </button>

            {lootStatus && (
              <div className="md:col-span-2 text-xs text-[#c8b88a]">
                {lootStatus}
              </div>
            )}

            {lootItem && (
              <div className="md:col-span-2 rounded border border-[#9b6a2f] bg-black p-3 text-sm">
                Verified loot item: <Eq2ItemTooltip item={lootItem} />
              </div>
            )}

            <input
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              placeholder="Notes"
              className="border border-[#9b6a2f] bg-black px-3 py-2 text-sm text-[#f4d58a]"
            />

            <input
              value={dkp}
              onChange={(event) => setDkp(event.target.value)}
              placeholder="DKP"
              className="border border-[#9b6a2f] bg-black px-3 py-2 text-sm text-[#f4d58a]"
            />
          </div>

          <button
            onClick={addEvent}
            disabled={saving}
            className="mt-4 border border-[#9b6a2f] bg-[#141414] px-6 py-2 text-xs font-bold uppercase tracking-widest text-[#f4d58a] hover:bg-[#3a100b]"
          >
            {saving ? "Saving..." : "Add Event"}
          </button>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-bold text-[#d4af37]">
            Guild DKP Standings
          </h2>

          {loading ? (
            <p>Loading DKP ledger...</p>
          ) : (
            <table className="w-full border-collapse border border-[#3a100b] text-sm">
              <thead>
                <tr className="bg-[#141414] text-left text-[#d4af37]">
                  <th className="border border-[#3a100b] p-3">Rank</th>
                  <th className="border border-[#3a100b] p-3">Character</th>
                  <th className="border border-[#3a100b] p-3">Class</th>
                  <th className="border border-[#3a100b] p-3">DKP</th>
                  <th className="border border-[#3a100b] p-3">History</th>
                </tr>
              </thead>

              <tbody>
                {characters.map((character, index) => {
                  const isOpen = openCharacterId === character.id;

                  return (
                    <React.Fragment key={character.id}>
                      <tr>
                        <td className="border border-[#3a100b] p-3">
                          #{index + 1}
                        </td>
                        <td className="border border-[#3a100b] p-3">
                          {character.character_name}
                        </td>
                        <td className="border border-[#3a100b] p-3">
                          {character.class_name}
                        </td>
                        <td className="border border-[#3a100b] p-3 font-bold">
                          {character.dkp}
                        </td>
                        <td className="border border-[#3a100b] p-3">
                          <button
                            onClick={() =>
                              setOpenCharacterId(isOpen ? null : character.id)
                            }
                            className="border border-[#9b6a2f] bg-[#141414] px-4 py-2 text-xs font-bold uppercase tracking-widest text-[#f4d58a] hover:bg-[#3a100b]"
                          >
                            {isOpen ? "Close" : "View"}
                          </button>
                        </td>
                      </tr>

                      {isOpen && (
                        <tr>
                          <td colSpan={5} className="border border-[#3a100b] p-4">
                            {character.history.length === 0 ? (
                              <p>No DKP history yet.</p>
                            ) : (
                              <table className="w-full border-collapse text-xs">
                                <thead>
                                  <tr className="text-left text-[#d4af37]">
                                    <th className="border border-[#3a100b] p-2">
                                      Character
                                    </th>
                                    <th className="border border-[#3a100b] p-2">
                                      Class
                                    </th>
                                    <th className="border border-[#3a100b] p-2">
                                      Raid
                                    </th>
                                    <th className="border border-[#3a100b] p-2">
                                      Date
                                    </th>
                                    <th className="border border-[#3a100b] p-2">
                                      Event
                                    </th>
                                    <th className="border border-[#3a100b] p-2">
                                      Notes / Loot
                                    </th>
                                    <th className="border border-[#3a100b] p-2">
                                      DKP
                                    </th>
                                    <th className="border border-[#3a100b] p-2">
                                      Actions
                                    </th>
                                  </tr>
                                </thead>

                                <tbody>
                                  {character.history.map((entry) => (
                                    <tr key={entry.id}>
                                      <td className="border border-[#3a100b] p-2">
                                        {entry.character_name}
                                      </td>
                                      <td className="border border-[#3a100b] p-2">
                                        {entry.class_name}
                                      </td>
                                      <td className="border border-[#3a100b] p-2">
                                        {entry.raid}
                                      </td>
                                      <td className="border border-[#3a100b] p-2">
                                        {new Date(entry.date).toLocaleDateString()}
                                      </td>
                                      <td className="border border-[#3a100b] p-2">
                                        {entry.event}
                                      </td>
                                      <td className="border border-[#3a100b] p-2">
                                        {entry.loot_item ? (
                                          <Eq2ItemTooltip item={entry.loot_item} />
                                        ) : (
                                          entry.notes || "-"
                                        )}
                                      </td>
                                      <td className="border border-[#3a100b] p-2 font-bold">
                                        {entry.dkp > 0
                                          ? `+${entry.dkp}`
                                          : entry.dkp}
                                      </td>
                                      <td className="border border-[#3a100b] p-2">
                                        <button
                                          onClick={() => deleteEvent(entry.id)}
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
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          )}
        </section>
      </section>
    </main>
  );
}