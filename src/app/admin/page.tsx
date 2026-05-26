import { updateEventDateAction, getEventDateAction, adminLogoutAction } from "@/lib/actions";
import { getRegistrations } from "@/lib/adminData";
import { cookies } from "next/headers";
import LoginForm from "./LoginForm";

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
            <div className="bg-slate-800/40 p-6 rounded-3xl shadow-sm border border-slate-700 backdrop-blur-sm min-h-[500px]">
              <h2 className="text-xl font-bold mb-6 text-white flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-accent" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                </svg>
                Registration List
              </h2>
              
              {registrations.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-16 h-16 bg-slate-700/50 rounded-full flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                  <p className="text-slate-400 text-lg">No registrations yet.</p>
                  <p className="text-slate-500 text-sm mt-1">Once people sign up, they will appear here.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {registrations.map((reg: any, i: number) => (
                    <div key={i} className="bg-slate-700/30 border border-slate-600/40 p-5 rounded-2xl hover:bg-slate-700/50 hover:border-slate-500/50 transition-all flex flex-col gap-2">
                      <div className="flex justify-between items-start">
                        <div className="font-bold text-white text-lg line-clamp-1" title={reg.name}>{reg.name}</div>
                        <span className="text-xs bg-slate-800 text-slate-300 px-2 py-1 rounded-md whitespace-nowrap">
                          {new Date(reg.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-300 text-sm mt-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-400" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                        </svg>
                        <span className="truncate" title={reg.email}>{reg.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-400 text-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-500" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                          <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
                        </svg>
                        <span className="truncate" title={reg.jobTitle}>{reg.jobTitle}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
