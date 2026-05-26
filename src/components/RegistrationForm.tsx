"use client";

import { useActionState, useEffect } from "react";
import { registerAction } from "@/lib/actions";
import { toast } from "sonner";

const initialState = {
  success: false,
  message: "",
  timestamp: 0,
};

export default function RegistrationForm() {
  const [state, formAction, pending] = useActionState(registerAction, initialState);

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
    <form action={formAction} className="flex flex-col gap-5 mt-8 max-w-md w-full mx-auto backdrop-blur-lg bg-slate-800/60 p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.3)] border border-slate-700/50">
      <div>
        <label htmlFor="name" className="block text-sm font-semibold text-slate-200 mb-2">Full Name</label>
        <input 
          type="text" 
          id="name" 
          name="name" 
          required 
          className="w-full px-4 py-3 rounded-xl border border-slate-600 bg-slate-700/50 focus:outline-none focus:ring-2 focus:ring-accent transition-all text-white placeholder-slate-400" 
          placeholder="John Doe" 
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-semibold text-slate-200 mb-2">Email Address</label>
        <input 
          type="email" 
          id="email" 
          name="email" 
          required 
          className="w-full px-4 py-3 rounded-xl border border-slate-600 bg-slate-700/50 focus:outline-none focus:ring-2 focus:ring-accent transition-all text-white placeholder-slate-400" 
          placeholder="johndoe@gmail.com" 
        />
      </div>

      <div>
        <label htmlFor="jobTitle" className="block text-sm font-semibold text-slate-200 mb-2">Job Title</label>
        <input 
          type="text" 
          id="jobTitle" 
          name="jobTitle" 
          required 
          className="w-full px-4 py-3 rounded-xl border border-slate-600 bg-slate-700/50 focus:outline-none focus:ring-2 focus:ring-accent transition-all text-white placeholder-slate-400" 
          placeholder="Enter your job title (Type N/A if none)" 
        />
      </div>

      <button 
        type="submit" 
        disabled={pending || state?.success}
        className="mt-2 w-full bg-gradient-to-r from-accent to-purple-500 hover:opacity-90 text-white font-bold py-3.5 px-4 rounded-xl transition-all shadow-lg hover:shadow-xl disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {pending ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing...
          </>
        ) : state?.success ? 'Registered!' : 'Secure My Spot'}
      </button>
    </form>
  );
}
