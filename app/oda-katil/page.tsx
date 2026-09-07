"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function OdaKatilPage() {
  const supabase = createClient();

  const [link, setLink] = useState("");
  const [hata, setHata] = useState("");
  const [yukleniyor, setYukleniyor] = useState(false);

  async function odayaGit(e: React.FormEvent) {
    e.preventDefault();
    setHata("");
    setYukleniyor(true);

    const temizLink = link.trim();

    if (!temizLink) {
      setHata("Lütfen oda davet linkini gir.");
      setYukleniyor(false);
      return;
    }

    try {
      const url = new URL(temizLink);

      if (!url.pathname.startsWith("/oda/")) {
        setHata("Geçerli bir Roomix oda linki gir.");
        setYukleniyor(false);
        return;
      }

      const odaId = url.pathname.split("/oda/")[1]?.split("/")[0];

      if (!odaId) {
        setHata("Oda bağlantısı geçersiz.");
        setYukleniyor(false);
        return;
      }

      const { data: userData } = await supabase.auth.getUser();

      if (!userData.user) {
        window.location.href = "/giris";
        return;
      }

      const { data: oda, error: odaHatasi } = await supabase
        .from("rooms")
        .select("id, is_public")
        .eq("id", odaId)
        .single();

      if (odaHatasi || !oda) {
        setHata("Bu oda bulunamadı.");
        setYukleniyor(false);
        return;
      }

      const { error: uyeHatasi } = await supabase
        .from("room_members")
        .upsert(
          {
            room_id: oda.id,
            user_id: userData.user.id,
          },
          {
            onConflict: "room_id,user_id",
            ignoreDuplicates: true,
          }
        );

      if (uyeHatasi) {
        setHata("Odaya katılırken bir hata oluştu. Lütfen tekrar dene.");
        setYukleniyor(false);
        return;
      }

      window.location.href = `/oda/${oda.id}`;
    } catch {
      setHata("Geçerli bir oda linki gir.");
      setYukleniyor(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#070914] px-5 py-10 text-white">
      <div className="mx-auto max-w-2xl">
        <a
          href="/"
          className="inline-flex items-center gap-2 text-sm text-white/50 transition hover:text-white"
        >
          ← Ana sayfaya dön
        </a>

        <div className="mt-12 text-center">
          <div className="text-5xl">👥</div>

          <h1 className="mt-5 text-3xl font-black sm:text-4xl">
            Odaya Katıl
          </h1>

          <p className="mt-3 text-white/45">
            Arkadaşından aldığın Roomix davet linkini aşağıya yapıştır.
          </p>
        </div>

        <form
          onSubmit={odayaGit}
          className="mt-8 rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl sm:p-8"
        >
          <label className="mb-2 block text-sm font-semibold text-white/80">
            Oda davet linki
          </label>

          <input
            type="url"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            placeholder="http://localhost:3000/oda/..."
            required
            className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-4 text-white outline-none transition placeholder:text-white/25 focus:border-pink-500"
          />

          {hata && (
            <div className="mt-4 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {hata}
            </div>
          )}

          <button
            type="submit"
            disabled={yukleniyor}
            className="mt-6 w-full rounded-2xl bg-gradient-to-r from-pink-500 to-fuchsia-600 px-6 py-4 font-bold shadow-xl shadow-pink-500/20 transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {yukleniyor ? "Odaya katılınıyor..." : "👥 Odaya Katıl"}
          </button>
        </form>
      </div>
    </main>
  );
}
