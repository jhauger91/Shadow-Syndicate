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

export default function Home() {
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
              <a className="border-b border-[#d69a3a] pb-2" href="#">Home</a>
              <a href="#">DKP</a>
              <a href="#">Gear Check</a>
              <a href="#">Roster</a>
              <a href="#">Events</a>
            </nav>
          </div>
        </header>

        <section className="mx-auto grid max-w-7xl gap-8 px-6 py-10 lg:grid-cols-[440px_1fr]">
          <div className="flex flex-col items-center justify-center text-center">
            <img src="/guild-logo.png" className="mb-6 w-80 drop-shadow-[0_0_30px_rgba(120,160,220,0.45)]" />

            <h1 className="text-6xl font-black tracking-wide text-[#dce7f5] drop-shadow">
              SHADOW
              <br />
              SYNDICATE
            </h1>

            <p className="mt-4 text-xl uppercase tracking-[0.25em] text-[#d69a3a]">
              EverQuest II • Wuoshi TLE
            </p>

            <div className="my-6 h-px w-80 bg-[#9b6a2f]" />

            <h2 className="text-xl font-bold uppercase tracking-widest text-[#f4d58a]">
              Brotherhood. Loyalty. Victory.
            </h2>

            <p className="mt-4 max-w-sm text-lg leading-7 text-[#e6d6b3]">
              We are a progression-focused raiding guild on the Wuoshi TLE server.
              United in purpose, we conquer challenges, claim victory, and forge legends.
            </p>

            <div className="mt-8 flex gap-4">
              <button className="border border-[#c6923e] bg-[#3a220f] px-8 py-4 font-bold uppercase text-[#f4d58a] shadow-lg">
                View DKP
              </button>
              <button className="border border-[#c6923e] bg-[#111820] px-8 py-4 font-bold uppercase text-[#f4d58a] shadow-lg">
                Gear Check
              </button>
            </div>
          </div>

          <div className="rounded-3xl border border-[#8a642f]/60 bg-[linear-gradient(135deg,#111820,#050607)] p-8 shadow-[0_0_80px_rgba(60,110,180,0.22)]">
            <div className="h-full min-h-[520px] rounded-2xl border border-[#29394f] bg-[radial-gradient(circle_at_center,#27384f_0%,#101820_45%,#050607_100%)] p-8">
              <div className="grid h-full place-items-center text-center">
                <div>
                  <div className="text-7xl">🏰</div>
                  <h2 className="mt-6 text-5xl font-black text-[#dce7f5]">
                    Wuoshi TLE Raid Command
                  </h2>
                  <p className="mx-auto mt-5 max-w-2xl text-xl leading-8 text-[#c9d4e2]">
                    Raid schedules, DKP standings, roster management, and gear checks
                    for Shadow Syndicate.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-4 px-6 md:grid-cols-4">
          {[
            ["📜", "Announcements", "Guild news, raid times, and officer messages.", "View News"],
            ["🏆", "DKP Tracker", "Track DKP, standings, loot history, and priority.", "View DKP"],
            ["🛡️", "Gear Check", "Review gear, stats, resists, and raid readiness.", "Check Gear"],
            ["⚔️", "Raid Schedule", "See upcoming raids and events.", "View Schedule"],
          ].map(([icon, title, text, button]) => (
            <div key={title} className="border border-[#9b6a2f] bg-black/50 p-6 text-center shadow-xl">
              <div className="text-5xl">{icon}</div>
              <h3 className="mt-5 text-2xl uppercase text-[#f4d58a]">{title}</h3>
              <p className="mt-3 min-h-20 text-[#d8c39a]">{text}</p>
              <button className="mt-5 w-full border border-[#9b6a2f] bg-[#141414] py-3 uppercase text-[#f4d58a]">
                {button}
              </button>
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
                <div key={name} className="flex justify-between border-b border-[#6f542c] py-4">
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

        <section className="mx-auto mt-4 grid max-w-7xl gap-4 px-6 pb-10 lg:grid-cols-2">
          <div className="border border-[#9b6a2f] bg-black/60 p-8 text-center">
            <h2 className="text-xl uppercase tracking-widest text-[#f4d58a]">Server Status</h2>
            <p className="mt-4 text-3xl text-[#f4d58a]">🟢 Wuoshi TLE</p>
            <p className="mt-2 text-green-400">Server is Online</p>
          </div>

          <div className="border border-[#9b6a2f] bg-black/60 p-8 text-center">
            <h2 className="text-xl uppercase tracking-widest text-[#f4d58a]">Guild Motto</h2>
            <p className="mt-5 text-3xl italic text-[#f4d58a]">
              “From the shadows we rise, as one.”
            </p>
            <p className="mt-2 text-2xl italic">
              For Norrath. For glory. For the Syndicate.
            </p>
          </div>
        </section>

        <footer className="border-t border-[#9b6a2f]/50 bg-black/80 px-6 py-6 text-center text-[#9b8a6f]">
          © 2026 Shadow Syndicate • Wuoshi TLE • EverQuest II
        </footer>
      </div>
    </main>
  );
}