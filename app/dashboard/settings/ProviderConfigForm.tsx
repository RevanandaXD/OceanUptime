"use client";

import { useState } from "react";
import { saveProviderKey, deleteProviderKey } from "./action";
import { ShieldAlert, CheckCircle2, KeyRound, Server, Trash2 } from "lucide-react";
import Popup from "@/component/shared/Popup";

interface ProviderConfigFormProps {
  providerName: string;
  providerLabel: string;
  isConfigured: boolean;
}

export default function ProviderConfigForm({ providerName, providerLabel, isConfigured }: ProviderConfigFormProps) {
  const [apiKey, setApiKey] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [isDisconnectOpen, setIsDisconnectOpen] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey) return;
    
    setIsLoading(true);
    setStatus("idle");
    try {
      await saveProviderKey(providerName, apiKey);
      setStatus("success");
      setApiKey(""); // Clear input on success
    } catch (error: any) {
      setStatus("error");
      setErrorMessage(error.message || "Failed to save key");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnect = async () => {
    setIsLoading(true);
    try {
      await deleteProviderKey(providerName);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm flex flex-col hover-glow transition-all">
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-xl ${isConfigured ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400'}`}>
            <Server className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-bold text-zinc-900 dark:text-zinc-100">{providerLabel}</h3>
            <div className="flex items-center gap-1.5 mt-0.5">
              {isConfigured ? (
                <>
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                  <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">Connected</span>
                </>
              ) : (
                <>
                  <ShieldAlert className="h-3.5 w-3.5 text-zinc-400" />
                  <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Not Configured</span>
                </>
              )}
            </div>
          </div>
        </div>
        
        {isConfigured && (
          <button 
            onClick={() => setIsDisconnectOpen(true)}
            disabled={isLoading}
            className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg transition-colors"
            title="Disconnect Provider"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-4 mt-auto">
        <div>
          <label className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-1.5">
            {isConfigured ? "Update API Key" : "Enter API Key"}
          </label>
          <div className="relative">
            <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder={isConfigured ? "••••••••••••••••" : "Paste your token here..."}
              className="w-full pl-9 pr-4 py-2.5 text-sm bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50 dark:text-zinc-100 transition-all placeholder:text-zinc-400"
            />
          </div>
          {status === "error" && <p className="text-xs text-rose-500 mt-2 font-medium">{errorMessage}</p>}
          {status === "success" && <p className="text-xs text-emerald-500 mt-2 font-medium">Key saved securely!</p>}
        </div>

        <button
          type="submit"
          disabled={isLoading || !apiKey}
          className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 dark:disabled:bg-indigo-800 text-white text-sm font-bold rounded-lg transition-colors"
        >
          {isLoading ? "Saving..." : isConfigured ? "Update Key" : "Connect Provider"}
        </button>
      </form>

      {/* Disconnect Provider Confirmation Popup */}
      <Popup
        isOpen={isDisconnectOpen}
        onClose={() => !isLoading && setIsDisconnectOpen(false)}
        onConfirm={async () => {
          await handleDisconnect();
          setIsDisconnectOpen(false);
        }}
        title="Disconnect Provider"
        description={`Are you sure you want to disconnect ${providerLabel}? Monitoring using this provider will fail.`}
        confirmText="Disconnect"
        cancelText="Cancel"
        isLoading={isLoading}
      />
    </div>
  );
}
