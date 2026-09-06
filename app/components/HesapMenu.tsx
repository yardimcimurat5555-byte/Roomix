"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function HesapMenu() {
  const [email, setEmail] = useState<string | null>(null);
  const [acik, setAcik] = useState(false);

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(({ data }) => {
      setEmail(data.user?.email ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setEmail(session?.user?.email ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function cikisYap() {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  if (!email) {
    return (
      <>
        <a
          href="/giris"
          className="hidden rounded-xl border border-white/15 px-4 py-2 text-sm sm:block"
        >
          Giriş Yap
        </a>

        <a
          href="/giris"
          className="rounded-xl bg-gradient-to-r from-pink-500 to-fuchsia-600 px-4 py-2 text-sm font-bold shadow-lg shadow-pink-500/20"
        >
          Ücretsiz Başla
        </a>
      </>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setAcik(!acik)}
        className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 transition hover:bg-white/10"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-pink-500 to-fuchsia-600 text-sm font-bold">
          {email.charAt(0).toUpperCase()}
        </span>

        <span className="hidden max-w-[140px] truncate text-sm font-medium sm:block">
          {email}
        </span>

        <span className="text-xs text-white/50">⌄</span>
      </button>

      {acik && (
        <div className="absolute right-0 top-14 z-50 w-72 rounded-2xl border border-white/10 bg-[#11131f] p-3 shadow-2xl">
          <div className="border-b border-white/10 px-3 py-3">
            <div className="text-xs text-white/40">Hesabın</div>
            <div className="mt-1 truncate text-sm font-medium">
              {email}
            </div>
          </div>

          <div className="mt-2 space-y-1">
            <a
              href="/profil"
              className="block rounded-xl px-3 py-3 text-sm text-white/80 transition hover:bg-white/5"
            >
              👤 Profilim
            </a>

            <a
              href="/arkadaslar"
              className="block rounded-xl px-3 py-3 text-sm text-white/80 transition hover:bg-white/5"
            >
              👥 Arkadaşlar
            </a>

            <a
              href="/bildirimler"
              className="block rounded-xl px-3 py-3 text-sm text-white/80 transition hover:bg-white/5"
            >
              🔔 Bildirimler
            </a>

            <a
              href="/oda"
              className="block rounded-xl px-3 py-3 text-sm text-white/80 transition hover:bg-white/5"
            >
              🎥 Odalarım
            </a>

            <a
              href="/abonelik"
              className="block rounded-xl px-3 py-3 text-sm text-white/80 transition hover:bg-white/5"
            >
              💳 Abonelik / Paketim
            </a>

            <a
              href="/ayarlar"
              className="block rounded-xl px-3 py-3 text-sm text-white/80 transition hover:bg-white/5"
            >
              ⚙️ Ayarlar
            </a>

            <a
              href="/destek"
              className="block rounded-xl px-3 py-3 text-sm text-white/80 transition hover:bg-white/5"
            >
              🆘 Destek & İletişim
            </a>
          </div>

          <div className="mt-2 border-t border-white/10 pt-2">
            <button
              onClick={cikisYap}
              className="w-full rounded-xl px-3 py-3 text-left text-sm text-red-300 transition hover:bg-red-500/10"
            >
              🚪 Çıkış Yap
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
