import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { DEMO_COOKIE_NAME } from "@/utils/demo";
import ProviderConfigForm from "./ProviderConfigForm";
import ThemeConfigForm from "./ThemeConfigForm";

export const metadata = {
  title: "Settings | OceanUptime",
};

const PROVIDERS = [
  { id: "vercel", label: "Vercel Integration" },
  { id: "netlify", label: "Netlify Integration" },
  { id: "cloudflare", label: "Cloudflare Pages" },
  { id: "github", label: "GitHub API" },
];

export default async function SettingsPage() {
  const cookieStore = await cookies();
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Anonymous demo visitor (demo cookie + no session): show read-only sample.
  const isDemo =
    cookieStore.get(DEMO_COOKIE_NAME)?.value === "1" && !user;

  if (!user && !isDemo) {
    redirect("/auth");
  }

  if (isDemo) {
    return (
      <div className="space-y-6 animate-fade-in container">
        <div>
          <h1 className="text-2xl font-extrabold font-heading text-zinc-900 dark:text-white tracking-tight">
            Settings &amp; Configurations
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 max-w-2xl">
            Demo mode: integrasi provider terlihat sebagai contoh. Masuk untuk
            menyimpan koneksi sungguhan.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2 items-start">
          <div className="lg:col-span-2 space-y-4">
            <div className="border-b border-zinc-200 dark:border-zinc-800 pb-2">
              <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-450 dark:text-zinc-500">
                Integrations
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
              {PROVIDERS.map((p) => (
                <div
                  key={p.id}
                  className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm flex items-center gap-3"
                >
                  <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                    {p.label}
                  </span>
                  <span className="ml-auto inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30">
                    Connected (Demo)
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4 w-full">
            <div className="border-b border-zinc-200 dark:border-zinc-800 pb-2">
              <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-450 dark:text-zinc-500">
                Appearance
              </h2>
            </div>
            <ThemeConfigForm />
          </div>
        </div>
      </div>
    );
  }

  // Narrow user for the real (non-demo) path - TS can't infer it from the
  // redirect above because demo mode is explicit when user is null.
  if (!user) {
    redirect("/auth");
  }

  const { data: configs } = await supabase
    .from("provider_configs")
    .select("provider_name")
    .eq("user_id", user.id);

  const configuredProviders = configs?.map((c) => c.provider_name) || [];

  return (
    <div className="space-y-6 animate-fade-in container">
      <div>
        <h1 className="text-2xl font-extrabold font-heading text-zinc-900 dark:text-white tracking-tight">
          Settings & Configurations
        </h1>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 max-w-2xl">
          Securely connect your hosting providers and customize your visual interface dashboard.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2 items-start">
        {/* Integrations Column */}
        <div className="lg:col-span-2 space-y-4">
          <div className="border-b border-zinc-200 dark:border-zinc-800 pb-2">
            <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-450 dark:text-zinc-500">
              Integrations
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
            {PROVIDERS.map((p) => (
              <ProviderConfigForm
                key={p.id}
                providerName={p.id}
                providerLabel={p.label}
                isConfigured={configuredProviders.includes(p.id)}
              />
            ))}
          </div>
        </div>

        {/* Appearance Column */}
        <div className="space-y-4 w-full">
          <div className="border-b border-zinc-200 dark:border-zinc-800 pb-2">
            <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-450 dark:text-zinc-500">
              Appearance
            </h2>
          </div>
          <ThemeConfigForm />
        </div>
      </div>
    </div>
  );
}