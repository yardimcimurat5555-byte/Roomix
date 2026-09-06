import HesapMenu from "./components/HesapMenu";

const rooms = [
  {
    title: "Film Gecesi 🍿",
    category: "Film & Dizi",
    viewers: 24,
    description: "Interstellar izliyoruz, gel!",
    icon: "🎬",
  },
  {
    title: "Şampiyonlar Ligi ⚽",
    category: "Spor",
    viewers: 87,
    description: "Maçı birlikte izliyoruz",
    icon: "⚽",
  },
  {
    title: "Oyun Muhabbeti 🎮",
    category: "Oyun",
    viewers: 32,
    description: "Oyun, sohbet, takım!",
    icon: "🎮",
  },
  {
    title: "Lofi & Chill 🎧",
    category: "Müzik",
    viewers: 19,
    description: "Rahat bir ortam",
    icon: "🎵",
  },
  {
    title: "Sohbet Odası 💬",
    category: "Sohbet",
    viewers: 41,
    description: "Konu serbest, gel takıl!",
    icon: "💬",
  },
  {
    title: "Ders Çalışma Odası 📚",
    category: "Eğitim",
    viewers: 12,
    description: "Beraber daha motive!",
    icon: "📚",
  },
  {
    title: "Müzik Dinleme 🎶",
    category: "Müzik",
    viewers: 29,
    description: "İstediğin aç, birlikte dinleyelim.",
    icon: "🎧",
  },
  {
    title: "Teknoloji Sohbetleri 💻",
    category: "Teknoloji",
    viewers: 16,
    description: "Teknoloji, yapay zeka, gelecek.",
    icon: "💻",
  },
];

const categories = [
  "Tümü",
  "Film & Dizi",
  "Spor",
  "Oyun",
  "Müzik",
  "Sohbet",
  "Eğitim",
  "Teknoloji",
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#070914] text-white">
      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 border-b border-white/10 bg-[#080a15]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center gap-6 px-5 py-4">
          <div className="flex items-center gap-2 text-2xl font-black">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-pink-500 to-fuchsia-600 shadow-lg shadow-pink-500/20">
              ♥
            </span>
            Roomix
          </div>

          <div className="hidden items-center gap-6 text-sm text-white/70 md:flex">
            <a className="text-white" href="#">Ana Sayfa</a>
            <a href="#kesfet" className="hover:text-white">Keşfet</a>
            <a href="#odalar" className="hover:text-white">Odalar</a>
            <a href="#topluluk" className="hover:text-white">Topluluk</a>
            <a href="#hakkimizda" className="hover:text-white">Hakkımızda</a>
          </div>

          <div className="ml-auto flex items-center gap-3">
            <div className="hidden rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/40 lg:block">
              🔎 Oda, kategori veya içerik ara...
            </div>
            <button className="rounded-xl border border-white/10 bg-white/5 px-3 py-2">
              🌙
            </button>
            <HesapMenu />
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="mx-auto max-w-7xl px-5 pt-6">
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#171326] via-[#101322] to-[#0b0d18]">
          <div className="absolute -right-32 -top-32 h-80 w-80 rounded-full bg-pink-500/20 blur-3xl" />
          <div className="absolute -bottom-40 left-20 h-80 w-80 rounded-full bg-purple-600/20 blur-3xl" />

          <div className="relative grid min-h-[430px] items-center gap-10 px-7 py-14 md:grid-cols-2 md:px-14">
            <div>
              <span className="inline-flex rounded-full border border-pink-400/30 bg-pink-500/10 px-4 py-2 text-sm font-semibold text-pink-300">
                Birlikte Daha Güzel ❤️
              </span>

              <h1 className="mt-6 text-5xl font-black leading-[1.02] tracking-tight md:text-7xl">
                Uzaklık sadece
                <span className="block bg-gradient-to-r from-pink-400 to-fuchsia-500 bg-clip-text text-transparent">
                  bir ekran.
                </span>
              </h1>

              <p className="mt-6 max-w-xl text-lg leading-8 text-white/65">
                Sevdiklerinle aynı odada buluş, konuş, izle, keşfet ve daha
                fazlasını paylaş. İnterneti birlikte deneyimle.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <a href="/oda-olustur" className="rounded-2xl bg-gradient-to-r from-pink-500 to-fuchsia-600 px-7 py-4 font-bold shadow-xl shadow-pink-500/20">
                  🎥 Oda Oluştur
                </a>
                <button className="rounded-2xl border border-white/20 bg-white/5 px-7 py-4 font-bold">
                  👥 Odaya Katıl
                </button>
              </div>

              <div className="mt-7 flex items-center gap-3 text-sm text-white/50">
                <span>👥</span>
                <span>Binlerce kişi birlikte vakit geçiriyor.</span>
              </div>
            </div>

            <div className="relative hidden h-[320px] md:block">
              <div className="absolute inset-8 rounded-[2rem] border border-white/10 bg-black/30 p-4 shadow-2xl backdrop-blur">
                <div className="flex h-full flex-col rounded-[1.5rem] bg-gradient-to-br from-[#21152d] to-[#101522] p-5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold">🌙 Bizim Odamız</span>
                    <span className="rounded-full bg-green-500/15 px-3 py-1 text-xs text-green-300">
                      ● 2 kişi
                    </span>
                  </div>

                  <div className="mt-4 flex-1 rounded-2xl bg-black/40 p-5">
                    <div className="flex h-full items-center justify-center text-center">
                      <div>
                        <div className="text-6xl">🎬</div>
                        <p className="mt-3 font-bold">Birlikte İzle</p>
                        <p className="mt-1 text-sm text-white/40">
                          Konuş • İzle • Paylaş
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex justify-center gap-3">
                    <span className="rounded-full bg-white/10 px-4 py-2">🎙️</span>
                    <span className="rounded-full bg-white/10 px-4 py-2">📹</span>
                    <span className="rounded-full bg-pink-500 px-4 py-2">❤️</span>
                    <span className="rounded-full bg-white/10 px-4 py-2">💬</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="mx-auto grid max-w-7xl grid-cols-2 gap-3 px-5 py-5 md:grid-cols-6">
        {[
          ["🎙️", "Sesli & Görüntülü", "Daha yakın hisset."],
          ["🖥️", "Senkron İzleme", "Herkes aynı anda."],
          ["🌎", "Public Odalar", "Yeni insanlarla tanış."],
          ["🔒", "Özel Odalar", "Sadece davetlilerin."],
          ["🛡️", "Güvenli", "Moderasyon sistemi."],
          ["📱", "Her Cihazda", "Telefon, tablet, bilgisayar."],
        ].map(([icon, title, desc]) => (
          <div
            key={title}
            className="rounded-2xl border border-white/10 bg-white/[0.025] p-4"
          >
            <div className="text-2xl">{icon}</div>
            <div className="mt-2 text-sm font-bold">{title}</div>
            <div className="mt-1 text-xs text-white/40">{desc}</div>
          </div>
        ))}
      </section>

      {/* PUBLIC ROOMS */}
      <section id="odalar" className="mx-auto max-w-7xl px-5 py-8">
        <div className="mb-5 flex items-end justify-between">
          <div>
            <div className="text-3xl font-black">🔥 Canlı Odalar</div>
            <p className="mt-2 text-white/45">
              Şu anda yayında olan herkese açık odalara katıl.
            </p>
          </div>
          <button className="hidden text-sm font-semibold text-pink-400 sm:block">
            Tüm Odaları Gör →
          </button>
        </div>

        <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
          {categories.map((category, index) => (
            <button
              key={category}
              className={`whitespace-nowrap rounded-full border px-4 py-2 text-sm ${
                index === 0
                  ? "border-pink-500 bg-pink-500 text-white"
                  : "border-white/10 bg-white/5 text-white/60"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {rooms.map((room) => (
            <article
              key={room.title}
              className="group overflow-hidden rounded-2xl border border-white/10 bg-[#0d101d] transition hover:-translate-y-1 hover:border-pink-500/40"
            >
              <div className="relative flex h-36 items-center justify-center bg-gradient-to-br from-[#29172d] via-[#141629] to-[#0b0d17]">
                <div className="text-6xl transition group-hover:scale-110">
                  {room.icon}
                </div>
                <span className="absolute left-3 top-3 rounded-lg bg-pink-500 px-2 py-1 text-xs font-bold">
                  ● CANLI
                </span>
                <span className="absolute right-3 top-3 rounded-lg bg-black/50 px-2 py-1 text-xs">
                  👁 {room.viewers}
                </span>
              </div>

              <div className="p-4">
                <h3 className="font-bold">{room.title}</h3>
                <p className="mt-1 text-sm text-white/45">{room.description}</p>

                <div className="mt-4 flex items-center justify-between">
                  <span className="rounded-lg bg-white/5 px-2 py-1 text-xs text-white/50">
                    {room.category}
                  </span>
                  <button className="rounded-lg border border-pink-500/60 px-4 py-2 text-xs font-bold text-pink-300">
                    Katıl
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-5 py-12">
        <div className="rounded-3xl border border-pink-500/20 bg-gradient-to-r from-pink-500/10 to-purple-500/10 px-6 py-14 text-center">
          <div className="text-4xl">❤️</div>
          <h2 className="mt-4 text-3xl font-black">
            Kendi odanı oluşturmaya hazır mısın?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-white/50">
            İlk saatin ücretsiz. Sevdiklerini davet et ve birlikte vakit
            geçirmeye başla.
          </p>
          <a href="/oda-olustur" className="mt-7 inline-block rounded-2xl bg-gradient-to-r from-pink-500 to-fuchsia-600 px-8 py-4 font-bold shadow-xl shadow-pink-500/20">
            Ücretsiz Oda Oluştur
          </a>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-5 py-8 text-sm text-white/40 md:flex-row md:items-center md:justify-between">
          <div>
            <span className="font-bold text-white">♥ Roomix</span>
            <span className="ml-3">Uzaklık sadece bir ekran.</span>
          </div>

          <div className="flex flex-wrap gap-5">
            <a href="#hakkimizda">Hakkımızda</a>
            <a href="#destek">Destek & İletişim</a>
            <a href="#gizlilik">Gizlilik</a>
            <a href="#kosullar">Kullanım Şartları</a>
          </div>

          <div>© 2026 Roomix</div>
        </div>
      </footer>
    </main>
  );
}
