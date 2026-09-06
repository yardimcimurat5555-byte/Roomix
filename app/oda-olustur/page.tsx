"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function OdaOlusturPage() {
  const supabase = createClient();

  const [odaAdi, setOdaAdi] = useState("");
  const [aciklama, setAciklama] = useState("");
  const [herkeseAcik, setHerkeseAcik] = useState(true);
  const [yukleniyor, setYukleniyor] = useState(false);
  const [mesaj, setMesaj] = useState("");

  async function odaOlustur(e: React.FormEvent) {
    e.preventDefault();

    setYukleniyor(true);
    setMesaj("");

    const { data: userData } = await supabase.auth.getUser();

    if (!userData.user) {
      window.location.href = "/giris";
      return;
    }

    const davetKodu = crypto.randomUUID().replace(/-/g, "").slice(0, 12);

    const { data, error } = await supabase
      .from("rooms")
      .insert({
        owner_id: userData.user.id,
        name: odaAdi.trim(),
        description: aciklama.trim(),
        is_public: herkeseAcik,
        invite_code: davetKodu,
      })
      .select("id")
      .single();

    if (error || !data) {
      setMesaj("Oda oluşturulamadı. Lütfen tekrar dene.");
      setYukleniyor(false);
      return;
    }

    window.location.href = `/oda/${data.id}`;
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

        <div className="mt-10 text-center">
          <div className="text-5xl">🎥</div>

          <h1 className="mt-5 text-3xl font-black sm:text-4xl">
            Odanı Oluştur
          </h1>

          <p className="mt-3 text-white/45">
            Sevdiklerinle buluşacağın Roomix odanı oluştur.
          </p>
        </div>

        <form
          onSubmit={odaOlustur}
          className="mt-8 rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl sm:p-8"
        >
          <div>
            <label className="mb-2 block text-sm font-semibold text-white/80">
              Oda adı
            </label>

            <input
              type="text"
              value={odaAdi}
              onChange={(e) => setOdaAdi(e.target.value)}
              placeholder="Örn. Murat & Ayşe"
              required
              maxLength={80}
              className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-4 text-white outline-none transition placeholder:text-white/25 focus:border-pink-500"
            />
          </div>

          <div className="mt-5">
            <label className="mb-2 block text-sm font-semibold text-white/80">
              Açıklama
            </label>

            <textarea
              value={aciklama}
              onChange={(e) => setAciklama(e.target.value)}
              placeholder="Bu odada ne yapacaksınız?"
              maxLength={300}
              rows={4}
              className="w-full resize-none rounded-2xl border border-white/10 bg-black/30 px-4 py-4 text-white outline-none transition placeholder:text-white/25 focus:border-pink-500"
            />
          </div>

          <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <button
              type="button"
              onClick={() => setHerkeseAcik(!herkeseAcik)}
              className="flex w-full items-center justify-between text-left"
            >
              <div>
                <div className="font-semibold">
                  {herkeseAcik ? "🌍 Herkese açık oda" : "🔒 Özel oda"}
                </div>

                <div className="mt-1 text-sm text-white/40">
                  {herkeseAcik
                    ? "Odan keşfedilebilir ve kullanıcılar katılabilir."
                    : "Odaya yalnızca davet bağlantısıyla girilebilir."}
                </div>
              </div>

              <div
                className={`flex h-7 w-12 items-center rounded-full p-1 transition ${
                  herkeseAcik
                    ? "bg-pink-500"
                    : "bg-white/10"
                }`}
              >
                <div
                  className={`h-5 w-5 rounded-full bg-white transition ${
                    herkeseAcik ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </div>
            </button>
          </div>

          {mesaj && (
            <div className="mt-5 rounded-2xl border border-pink-500/20 bg-pink-500/10 px-4 py-3 text-sm text-pink-200">
              {mesaj}
            </div>
          )}

          <button
            type="submit"
            disabled={yukleniyor}
            className="mt-6 w-full rounded-2xl bg-gradient-to-r from-pink-500 to-fuchsia-600 px-6 py-4 font-bold shadow-xl shadow-pink-500/20 transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {yukleniyor ? "Oda oluşturuluyor..." : "🎥 Odayı Oluştur"}
          </button>
        </form>
      </div>
    </main>
  );
}
