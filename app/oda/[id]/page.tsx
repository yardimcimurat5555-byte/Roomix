"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Room = {
  id: string;
  name: string;
  description: string;
  is_public: boolean;
  invite_code: string;
  owner_id: string;
  created_at: string;
};

type ChatMessage = {
  id: string;
  room_id: string;
  user_id: string;
  content: string;
  created_at: string;
};

type RoomMember = {
  id: string;
  user_id: string;
  joined_at: string;
  profile: {
    display_name: string | null;
    avatar_url: string | null;
  } | null;
};

export default function OdaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const supabase = createClient();

  const [oda, setOda] = useState<Room | null>(null);
  const [mesajlar, setMesajlar] = useState<ChatMessage[]>([]);
  const [yeniMesaj, setYeniMesaj] = useState("");
  const [kullaniciId, setKullaniciId] = useState("");
  const [yukleniyor, setYukleniyor] = useState(true);
  const [mesaj, setMesaj] = useState("");
  const [kopyalandi, setKopyalandi] = useState(false);
  const [gonderiliyor, setGonderiliyor] = useState(false);
  const [uyeler, setUyeler] = useState<RoomMember[]>([]);

  useEffect(() => {
    let kanal: ReturnType<typeof supabase.channel> | null = null;

    async function yukle() {
      const { id } = await params;

      const { data: userData } = await supabase.auth.getUser();

      if (!userData.user) {
        window.location.href = "/giris";
        return;
      }

      setKullaniciId(userData.user.id);

      const { data: odaData, error: odaHatasi } = await supabase
        .from("rooms")
        .select("id, name, description, is_public, invite_code, owner_id, created_at")
        .eq("id", id)
        .single();

      if (odaHatasi || !odaData) {
        setMesaj("Oda bulunamadı veya bu odaya erişimin yok.");
        setYukleniyor(false);
        return;
      }

      setOda(odaData);

      const { data: uyeData } = await supabase
        .from("room_members")
        .select("id, user_id, joined_at")
        .eq("room_id", id)
        .order("joined_at", { ascending: true });

      const odaUyeleri = uyeData ?? [];

        odaUyeleri.unshift({
          id: "owner-" + odaData.owner_id,
          user_id: odaData.owner_id,
          joined_at: odaData.created_at,
        });

      if (odaUyeleri.length > 0) {
        const userIds = odaUyeleri.map((uye) => uye.user_id);

        const { data: profilData } = await supabase
          .from("profiles")
          .select("id, display_name, avatar_url")
          .in("id", userIds);

        const profilMap = new Map(
          (profilData ?? []).map((profil) => [profil.id, profil])
        );

        setUyeler(
          odaUyeleri.map((uye) => ({
            ...uye,
            profile: profilMap.get(uye.user_id) ?? null,
          }))
        );
      } else {
        setUyeler([]);
      }

      const { data: eskiMesajlar } = await supabase
        .from("messages")
        .select("id, room_id, user_id, content, created_at")
        .eq("room_id", id)
        .order("created_at", { ascending: true });

      setMesajlar(eskiMesajlar ?? []);
      setYukleniyor(false);

      kanal = supabase
        .channel(`oda-chat-${id}-${Date.now()}`)
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "messages",
            filter: `room_id=eq.${id}`,
          },
          (payload) => {
            const yeni = payload.new as ChatMessage;

            setMesajlar((mevcut) => {
              if (mevcut.some((item) => item.id === yeni.id)) {
                return mevcut;
              }

              return [...mevcut, yeni];
            });
          }
        )
        .subscribe();
    }

    yukle();

    return () => {
      if (kanal) {
        supabase.removeChannel(kanal);
      }
    };
  }, []);

  async function davetLinkiniKopyala() {
    if (!oda) return;

    const link = `${window.location.origin}/oda-katil?davet=${encodeURIComponent(
      oda.invite_code
    )}`;

    try {
      await navigator.clipboard.writeText(link);
      setKopyalandi(true);

      setTimeout(() => {
        setKopyalandi(false);
      }, 2000);
    } catch {
      setMesaj("Davet linki kopyalanamadı.");
    }
  }

  async function mesajGonder(e: React.FormEvent) {
    e.preventDefault();

    const temizMesaj = yeniMesaj.trim();

    if (!temizMesaj || !oda || !kullaniciId || gonderiliyor) {
      return;
    }

    setGonderiliyor(true);

    const { error } = await supabase.from("messages").insert({
      room_id: oda.id,
      user_id: kullaniciId,
      content: temizMesaj,
    });

    if (error) {
      setMesaj("Mesaj gönderilemedi. Lütfen tekrar dene.");
    } else {
      setYeniMesaj("");
      setMesaj("");
    }

    setGonderiliyor(false);
  }

  if (yukleniyor) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#070914] text-white">
        <div className="text-white/50">Oda yükleniyor...</div>
      </main>
    );
  }

  if (!oda) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#070914] px-5 text-white">
        <div className="text-center">
          <div className="text-5xl">😕</div>
          <h1 className="mt-5 text-2xl font-black">Oda bulunamadı</h1>
          <p className="mt-2 text-white/45">{mesaj}</p>

          <a
            href="/"
            className="mt-6 inline-block rounded-2xl bg-gradient-to-r from-pink-500 to-fuchsia-600 px-6 py-3 font-bold"
          >
            ← Ana sayfaya dön
          </a>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#070914] px-5 py-8 text-white">
      <div className="mx-auto max-w-5xl">
        <a
          href="/"
          className="text-sm text-white/50 transition hover:text-white"
        >
          ← Ana sayfaya dön
        </a>

        <div className="mt-8 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] shadow-2xl">
          <div className="border-b border-white/10 p-6 sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="text-sm text-pink-400">
                  {oda.is_public ? "🌍 Herkese açık oda" : "🔒 Özel oda"}
                </div>

                <h1 className="mt-2 text-3xl font-black sm:text-4xl">
                  {oda.name}
                </h1>

                {oda.description && (
                  <p className="mt-3 text-white/45">{oda.description}</p>
                )}
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={davetLinkiniKopyala}
                  className="rounded-2xl border border-pink-500/30 bg-pink-500/10 px-4 py-3 text-sm font-bold text-pink-200 transition hover:bg-pink-500/20"
                >
                  {kopyalandi
                    ? "✓ Link Kopyalandı"
                    : "🔗 Davet Linkini Kopyala"}
                </button>

                <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-center">
                  <div className="text-2xl">👥</div>
                  <div className="mt-1 text-xs text-white/40">Oda</div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-6 p-6 sm:p-8 lg:grid-cols-[1.4fr_0.8fr]">
            <div className="rounded-3xl border border-white/10 bg-black/20 p-5">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-black">💬 Oda Sohbeti</h2>
                  <p className="mt-1 text-xs text-white/35">
                    Odadaki herkesle konuş.
                  </p>
                </div>

                <div className="rounded-full bg-green-500/10 px-3 py-1 text-xs text-green-300">
                  ● Canlı
                </div>
              </div>

              <div className="flex h-[420px] flex-col">
                <div className="flex-1 space-y-3 overflow-y-auto pr-2">
                  {mesajlar.length === 0 ? (
                    <div className="flex h-full items-center justify-center text-center">
                      <div>
                        <div className="text-5xl">💬</div>
                        <p className="mt-3 font-semibold text-white/60">
                          Henüz mesaj yok.
                        </p>
                        <p className="mt-1 text-sm text-white/30">
                          İlk mesajı sen gönder!
                        </p>
                      </div>
                    </div>
                  ) : (
                    mesajlar.map((item) => {
                      const benim = item.user_id === kullaniciId;

                      return (
                        <div
                          key={item.id}
                          className={`flex ${
                            benim ? "justify-end" : "justify-start"
                          }`}
                        >
                          <div
                            className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                              benim
                                ? "bg-gradient-to-r from-pink-500 to-fuchsia-600"
                                : "bg-white/10"
                            }`}
                          >
                            <div className="mb-1 text-[11px] text-white/45">
                              {benim ? "Sen" : "Oda kullanıcısı"}
                            </div>

                            <div className="break-words text-sm">
                              {item.content}
                            </div>

                            <div className="mt-1 text-[10px] text-white/35">
                              {new Date(item.created_at).toLocaleTimeString(
                                "tr-TR",
                                {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                <form
                  onSubmit={mesajGonder}
                  className="mt-4 flex gap-2 border-t border-white/10 pt-4"
                >
                  <input
                    type="text"
                    value={yeniMesaj}
                    onChange={(e) => setYeniMesaj(e.target.value)}
                    placeholder="Mesajını yaz..."
                    maxLength={1000}
                    className="min-w-0 flex-1 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-pink-500"
                  />

                  <button
                    type="submit"
                    disabled={gonderiliyor || !yeniMesaj.trim()}
                    className="rounded-2xl bg-gradient-to-r from-pink-500 to-fuchsia-600 px-5 py-3 font-bold transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {gonderiliyor ? "..." : "Gönder"}
                  </button>
                </form>

                {mesaj && (
                  <div className="mt-3 rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs text-red-200">
                    {mesaj}
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-black/20 p-6">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-black">👥 Oda Üyeleri</h2>
                  <p className="mt-1 text-xs text-white/35">Bu odadaki kişiler</p>
                </div>
                <div className="rounded-full bg-pink-500/10 px-3 py-1 text-xs font-bold text-pink-300">{uyeler.length} kişi</div>
              </div>
              <div className="space-y-3">
                {uyeler.map((uye) => {
                  const isim = uye.profile?.display_name?.trim() || "Roomix kullanıcısı";
                  const avatar = uye.profile?.avatar_url;
                  return (
                    <div key={uye.id} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-3">
                      {avatar ? <img src={avatar} alt={isim} className="h-11 w-11 rounded-full object-cover" /> : <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-pink-500 to-fuchsia-600 text-lg font-black">{isim.charAt(0).toUpperCase()}</div>}
                      <div className="min-w-0 flex-1"><div className="truncate font-bold">{isim}</div><div className="mt-0.5 text-xs text-green-300">● Odada</div></div>
                      {uye.user_id === oda.owner_id && <span className="rounded-full bg-pink-500/10 px-2 py-1 text-[10px] font-bold text-pink-300">Oda sahibi</span>}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="rounded-3xl border border-dashed border-white/10 bg-black/20 p-6">
              <div className="flex min-h-[420px] items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl">🎬</div>
                  <h2 className="mt-5 text-2xl font-black">
                    Birlikte izleme
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-white/40">
                    Bir sonraki adımda buraya içerik ekleme, oynatma ve
                    senkronizasyon özelliklerini bağlayacağız.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
