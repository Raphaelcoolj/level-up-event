"use client";

import { useActionState, useEffect } from "react";
import { adminLoginAction } from "@/lib/actions";
import { toast } from "sonner";

const initialState = {
  success: false,
  message: "",
  timestamp: 0,
};

export default function LoginForm() {
  const [state, formAction, pending] = useActionState(adminLoginAction, initialState);

  useEffect(() => {
    if (state?.message) {
      if (state.success) {
        toast.success(state.message);
      } else {
        toast.error(state.message);
      }
    }
  }, [state]);

  return (
    <form action={formAction} className="bg-slate-800/60 p-6 md:p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.3)] border border-slate-700/50 w-full max-w-sm backdrop-blur-lg">
      <h1 className="text-2xl font-bold mb-6 text-center text-white">Admin Access</h1>
      <input 
        type="password" 
        name="password" 
        placeholder="Enter Admin Password" 
        required
        className="w-full px-4 py-3 rounded-xl border border-slate-600 bg-slate-700/50 focus:outline-none focus:ring-2 focus:ring-accent transition-all text-white placeholder-slate-400 mb-6"
      />
      <button 
        type="submit" 
        disabled={pending}
        className="w-full bg-gradient-to-r from-accent to-purple-500 text-white font-bold py-3 rounded-xl hover:opacity-90 transition-all shadow-lg disabled:opacity-50 flex justify-center items-center gap-2"
      >
        {pending ? "Authenticating..." : "Login"}
      </button>
    </form>
  );
}
