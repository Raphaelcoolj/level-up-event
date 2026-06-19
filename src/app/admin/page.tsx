import { updateEventDateAction, getEventDateAction, adminLogoutAction } from "@/lib/actions";
import { getRegistrations } from "@/lib/adminData";
import { cookies } from "next/headers";
import LoginForm from "./LoginForm";
import AttendanceManager from "@/components/AttendanceManager";

export default async function AdminPage() {
  const cookieStore = await cookies();
  const isAuthenticated = cookieStore.get("admin_token")?.value === "statsadmin_authenticated";

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <LoginForm />
      </div>
    );
  }

  const registrations = await getRegistrations();
  const currentDate = await getEventDateAction();

  return (
    <div className="min-h-screen bg-background p-4 md:p-8 lg:p-12 font-sans text-slate-200">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold text-white tracking-tight">Admin Dashboard</h1>
          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-slate-800 border border-slate-700 text-white px-5 py-2 rounded-xl shadow-md">
              Total: <span className="font-bold text-accent">{registrations.length}</span>
            </div>
            <form action={adminLogoutAction}>
              <button type="submit" className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 px-5 py-2 rounded-xl transition-all shadow-sm font-medium">
                Logout
              </button>
            </form>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-slate-800/40 p-6 rounded-3xl shadow-sm border border-slate-700 backdrop-blur-sm">
              <h2 className="text-xl font-bold mb-5 text-white flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-accent" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
                Event Settings
              </h2>
              <form action={updateEventDateAction} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Event Date</label>
                  <input 
                    type="text" 
                    name="date" 
                    defaultValue={currentDate} 
                    className="w-full px-4 py-3 rounded-xl border border-slate-600 bg-slate-700/50 focus:outline-none focus:ring-2 focus:ring-accent transition-all text-white"
                    placeholder="e.g. Wed. 17th June, 2026"
                  />
                </div>
                <button type="submit" className="w-full bg-accent hover:opacity-90 text-white font-bold py-3 rounded-xl transition-all shadow-md">
                  Update Date
                </button>
              </form>
            </div>
            
            <div className="bg-slate-800/40 p-6 rounded-3xl shadow-sm border border-slate-700 backdrop-blur-sm hidden lg:block">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Quick Stats</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center bg-slate-700/30 p-4 rounded-xl border border-slate-600/30">
                  <span className="text-slate-300">Total Registered</span>
                  <span className="font-bold text-xl text-white">{registrations.length}</span>
                </div>
                {/* Additional stats could go here */}
              </div>
            </div>
          </div>

          <div className="lg:col-span-8">
            {registrations.length === 0 ? (
              <div className="bg-slate-800/40 p-6 rounded-3xl shadow-sm border border-slate-700 backdrop-blur-sm min-h-[500px] flex flex-col items-center justify-center py-16 text-center">
                <div className="w-16 h-16 bg-slate-700/50 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <p className="text-slate-400 text-lg">No registrations yet.</p>
                <p className="text-slate-500 text-sm mt-1">Once people sign up, they will appear here.</p>
              </div>
            ) : (
              <AttendanceManager initialRegistrations={registrations} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
