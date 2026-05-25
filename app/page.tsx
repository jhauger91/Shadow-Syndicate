export const revalidate = 1800;

const raids = [
  ["Temple of Veeshan", "Friday", "7:00 PM"],
  ["The Darkened Sea", "Saturday", "7:00 PM"],
  ["Vex Thal", "Sunday", "7:00 PM"],
];

const dkp = [
  ["Valenor", "Paladin", "1,245"],
  ["Zyrrah", "Assassin", "1,180"],
  ["Thalorien", "Templar", "980"],
  ["Morghul", "Berserker", "875"],
  ["Lyssandra", "Wizard", "760"],
];

type Announcement = {
  title: string;
  url: string;
  date: string;
  preview: string;
};

async function getAnnouncements(): Promise<Announcement[]> {
  try {
    const res = await fetch(
      "https://forums.everquest2.com/index.php?forums/announcements.11/index.rss",
      { next: { revalidate: 1800 } }
    );

    const xml = await res.text();
    const items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)];

    return items.slice(0, 3).map((item) => {
      const block = item[1];

      const title =
        block.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/)?.[1] ??
        block.match(/<title>(.*?)<\/title>/)?.[1] ??
        "EQ2 Announcement";

      const url = block.match(/<link>(.*?)<\/link>/)?.[1] ?? "#";

      const rawDate = block.match(/<pubDate>(.*?)<\/pubDate>/)?.[1] ?? "";

      const description =
        block.match(/<description><!\[CDATA\[([\s\S]*?)\]\]><\/description>/)
          ?.[1] ?? "";

      const preview = description
        .replace(/<[^>]+>/g, "")
        .replace(/&quot;/g, '"')
        .replace(/&amp;/g, "&")
        .replace(/&#039;/g, "'")
        .trim()
        .slice(0, 220);

      return {
        title,
        url,
        date: rawDate
          ? new Date(rawDate).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })
          : "",
        preview,
      };
    });
  } catch {
    return [];
  }
}

export default async function Home() {
  const announcements = await getAnnouncements();

  return (
    <main className="min-h-screen bg-black text-[#d8c39a]">
      <div className="min-h-screen bg-[radial-gradient(circle_at_top,#162235_0%,#07090b_45%,#020202_100%)]">
        <header className="border-b border-[#9b6a2f]/50 bg-black/70">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              <img src="/guild-logo.png" className="h-16 w-16 rounded-full" />

              <div>
                <div className="text-3xl font-bold tracking-wide text-[#f4d58a]">
                  SHADOW
                </div>
                <div className="text-3xl font-bold tracking-wide text-[#f4d58a]">
                  SYNDICATE
                </div>
              </div>
            </div>

            <nav className="hidden gap-10 text-sm font-semibold uppercase tracking-widest text-[#e4c67a] md:flex">
              <a className="border-b border-[#d69a3a] pb-2" href="#">
                Home
              </a>
              <a href="#">DKP</a>
              <a href="#">Gear Check</a>
              <a href="#">Roster</a>
              <a href="#">Events</a>
            </nav>
          </div>
        </header>

        <section className="mx-auto max-w-7xl px-6 py-10">
          <img
            src="/a_dark_fantasy_mmorpg_guild_website_homepage_hero.png"
            alt="Shadow Syndicate hero banner"
            className="w-full rounded-3xl border border-[#8a642f]/60 object-cover shadow-[0_0_80px_rgba(60,110,180,0.22)]"
          />
        </section>

        <section className="mx-auto grid max-w-7xl gap-4 px-6 md:grid-cols-4">
          {[
            [
              "⚔️",
              "Roster",
              "Manage raid groups, classes, raid composition, and member assignments.",
              "View Roster",
            ],
            [
              "🏆",
              "DKP Tracker",
              "Track DKP, standings, loot history, and priority.",
              "View DKP",
            ],
            [
              "🛡️",
              "Gear Check",
              "Review gear, stats, resists, and raid readiness.",
              "Check Gear",
            ],
            [
              "📅",
              "Raid Schedule",
              "See upcoming raids and events.",
              "View Schedule",
            ],
          ].map(([icon, title, text, button]) => (
            <div
              key={title}
              className="border border-[#9b6a2f] bg-black/50 p-6 text-center shadow-xl"
            >
              <div className="text-5xl">{icon}</div>

              <h3 className="mt-5 text-2xl uppercase text-[#f4d58a]">
                {title}
              </h3>

              <p className="mt-3 min-h-20 text-[#d8c39a]">{text}</p>

              <a
                href={
                  title === "Roster"
                    ? "/roster"
                    : "#"
                }
                className="mt-5 block w-full border border-[#9b6a2f] bg-[#141414] py-3 uppercase text-[#f4d58a]"
              >
                {button}
              </a>
            </div>
          ))}
        </section>

        <section className="mx-auto mt-6 grid max-w-7xl gap-4 px-6 lg:grid-cols-2">
          <div className="border border-[#9b6a2f] bg-black/60">
            <h2 className="bg-[#3a100b] py-4 text-center text-2xl uppercase tracking-widest text-[#f4d58a]">
              Upcoming Raids
            </h2>

            <div className="p-6">
              {raids.map(([name, day, time]) => (
                <div
                  key={name}
                  className="flex justify-between border-b border-[#6f542c] py-4"
                >
                  <div>
                    <div className="text-xl text-[#f4d58a]">{name}</div>
                    <div>{day}</div>
                  </div>

                  <div className="text-right">
                    <div className="text-xl text-[#f4d58a]">{time}</div>
                    <div>Server Time</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border border-[#9b6a2f] bg-black/60">
            <h2 className="bg-[#102133] py-4 text-center text-2xl uppercase tracking-widest text-[#f4d58a]">
              DKP Leaderboard
            </h2>

            <table className="w-full text-left">
              <thead className="border-b border-[#6f542c] text-[#f4d58a]">
                <tr>
                  <th className="p-4">#</th>
                  <th className="p-4">Player</th>
                  <th className="p-4">Class</th>
                  <th className="p-4">DKP</th>
                </tr>
              </thead>

              <tbody>
                {dkp.map(([player, cls, points], index) => (
                  <tr key={player} className="border-b border-[#3d3322]">
                    <td className="p-4">{index + 1}</td>
                    <td className="p-4 text-[#f4d58a]">{player}</td>
                    <td className="p-4">{cls}</td>
                    <td className="p-4">{points}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mx-auto mt-4 max-w-7xl px-6 pb-10">
          <div className="border border-[#9b6a2f] bg-black/60 p-8">
            <h2 className="text-center text-2xl uppercase tracking-widest text-[#f4d58a]">
              EQ2 Announcements
            </h2>

            <div className="mt-6 grid gap-4 lg:grid-cols-3">
              {announcements.length > 0 ? (
                announcements.map((post) => (
                  <a
                    key={post.url}
                    href={post.url}
                    target="_blank"
                    rel="noreferrer"
                    className="block border border-[#6f542c] bg-black/50 p-5 transition hover:border-[#d69a3a] hover:bg-[#111820]"
                  >
                    <div className="text-sm uppercase tracking-widest text-[#d69a3a]">
                      {post.date}
                    </div>

                    <h3 className="mt-3 text-xl font-bold text-[#f4d58a]">
                      {post.title}
                    </h3>

                    <p className="mt-3 text-sm leading-6 text-[#d8c39a]">
                      {post.preview ||
                        "Read the latest EverQuest II announcement."}
                    </p>
                  </a>
                ))
              ) : (
                <p className="text-center text-[#d8c39a] lg:col-span-3">
                  Announcements are temporarily unavailable.
                </p>
              )}
            </div>

            <a
              href="https://forums.everquest2.com/index.php?forums/announcements.11/"
              target="_blank"
              rel="noreferrer"
              className="mt-6 block text-center text-sm uppercase tracking-widest text-[#d69a3a] hover:text-[#f4d58a]"
            >
              View All EQ2 Announcements
            </a>
          </div>
        </section>

        <footer className="border-t border-[#9b6a2f]/50 bg-black/80 px-6 py-6 text-center text-[#9b8a6f]">
          © 2026 Shadow Syndicate • Wuoshi TLE • EverQuest II
        </footer>
      </div>
    </main>
  );
}