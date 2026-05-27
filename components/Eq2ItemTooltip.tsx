"use client";

type LootItem = {
  name?: string;
  title?: string;
  url?: string;
  rarity?: string;
  flags?: string[];
  greenStats?: string[];
  blueStats?: string[];
  itemType?: string;
  weaponType?: string;
  damage?: string;
  delay?: string;
  rating?: string;
  level?: string;
  tier?: string;
  classes?: string[];
};

type Props = {
  item: LootItem;
};

export default function Eq2ItemTooltip({ item }: Props) {
  const displayName =
    item.name || item.title?.replace(" (Item)", "") || "Unknown Item";

  return (
    <span className="group relative inline-block">
      <a
        href={item.url}
        target="_blank"
        rel="noreferrer"
        className="font-bold text-[#0066ff] underline decoration-dotted"
      >
        {displayName}
      </a>

      <span className="pointer-events-none absolute left-0 top-6 z-50 hidden w-[360px] rounded border-2 border-zinc-400 bg-black p-4 text-left font-serif text-white shadow-2xl group-hover:block">
        <div className="text-3xl font-bold leading-none text-white">
          {displayName}
        </div>

        {item.rarity && (
          <div className="mt-5 text-2xl font-bold uppercase text-[#ff9aa2]">
            {item.rarity}
          </div>
        )}

        {item.flags && item.flags.length > 0 && (
          <div className="mt-3 text-xl font-bold uppercase leading-snug text-yellow-300">
            {item.flags.join(", ")}
          </div>
        )}

        {item.greenStats && item.greenStats.length > 0 && (
          <div className="mt-5 space-y-2 font-bold text-[#55ff33]">
            {item.greenStats.map((stat) => (
              <div key={stat} className="text-lg leading-tight">
                {stat}
              </div>
            ))}
          </div>
        )}

        {item.blueStats && item.blueStats.length > 0 && (
          <div className="mt-5 space-y-2 font-bold text-[#9fd0ff]">
            {item.blueStats.map((stat) => (
              <div key={stat} className="text-lg leading-tight">
                {stat}
              </div>
            ))}
          </div>
        )}

        {(item.itemType || item.weaponType) && (
          <div className="mt-5 space-y-1 text-lg text-[#0066ff]">
            {item.itemType && <div>{item.itemType}</div>}
            {item.weaponType && <div>{item.weaponType}</div>}
          </div>
        )}

        {(item.damage || item.delay || item.level) && (
          <div className="mt-5 grid grid-cols-[90px_1fr] gap-y-2 text-lg">
            {item.damage && (
              <>
                <div className="text-zinc-300">Damage</div>
                <div className="font-bold text-white">{item.damage}</div>
              </>
            )}

            {item.delay && (
              <>
                <div className="text-zinc-300">Delay</div>
                <div className="font-bold text-white">
                  {item.delay} seconds
                  {item.rating && (
                    <span className="ml-4 text-base">
                      ({item.rating} Rating)
                    </span>
                  )}
                </div>
              </>
            )}

            {item.level && (
              <>
                <div className="text-zinc-300">Level</div>
                <div className="font-bold text-white">
                  {item.level}
                  {item.tier && (
                    <span className="ml-1 text-sm text-[#0066ff]">
                      (Tier {item.tier})
                    </span>
                  )}
                </div>
              </>
            )}
          </div>
        )}

        {item.classes && item.classes.length > 0 && (
          <div className="mt-5 text-lg font-bold leading-snug">
            {item.classes.map((className, index) => (
              <span key={className}>
                <span
                  className={
                    className.startsWith("All ") ? "text-white" : "text-[#0066ff]"
                  }
                >
                  {className}
                </span>
                {index < item.classes!.length - 1 ? ", " : ""}
              </span>
            ))}
          </div>
        )}

        <div className="mt-5 border-t border-zinc-700 pt-2 text-sm text-zinc-400">
          Source: EQ2 Fandom
        </div>
      </span>
    </span>
  );
}