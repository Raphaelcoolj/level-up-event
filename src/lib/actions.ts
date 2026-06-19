"use server";

import { connectDB } from "./mongoose";
import { Registration, EventSettings } from "@/models";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export async function registerAction(prevState: any, formData: FormData) {
  try {
    await connectDB();
    
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const jobTitle = formData.get("jobTitle") as string;

    if (!name || !email || !jobTitle) {
      return { success: false, message: "All fields are required.", timestamp: Date.now() };
    }

    const existing = await Registration.findOne({ email });
    if (existing) {
      return { success: false, message: "This email has already been registered.", timestamp: Date.now() };
    }

    await Registration.create({ name, email, jobTitle });
    
    revalidatePath("/admin");
    return { success: true, message: "Registration successful!", timestamp: Date.now() };
  } catch (error: any) {
    console.error("Registration error:", error);
    return { success: false, message: "An error occurred during registration.", timestamp: Date.now() };
  }
}

export async function getEventDateAction() {
  try {
    await connectDB();
    const settings = await EventSettings.findOne();
    if (!settings) {
      const defaultSettings = await EventSettings.create({ date: "SAT 20TH, June 2026" });
      return defaultSettings.date;
    }
    return settings.date;
  } catch (error) {
    console.error("Failed to connect to database for event date:", error);
    return "SAT 20TH, June 2026"; // Fallback date if DB connection fails
  }
}

export async function updateEventDateAction(formData: FormData) {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token");
  
  if (token?.value !== "statsadmin_authenticated") {
    return;
  }

  const date = formData.get("date") as string;
  if (!date) return;

  await connectDB();
  let settings = await EventSettings.findOne();
  if (!settings) {
    await EventSettings.create({ date });
  } else {
    settings.date = date;
    await settings.save();
  }

  revalidatePath("/");
  revalidatePath("/admin");
}

export async function adminLoginAction(prevState: any, formData: FormData) {
  const password = formData.get("password") as string;
  
  if (password === "statsadmin") {
    const cookieStore = await cookies();
    cookieStore.set("admin_token", "statsadmin_authenticated", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 1 day
      path: "/",
    });
    
    revalidatePath("/admin");
    return { success: true, message: "Login successful!", timestamp: Date.now() };
  }
  
  return { success: false, message: "Invalid password.", timestamp: Date.now() };
}

export async function adminLogoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("admin_token");
  revalidatePath("/admin");
}

export async function toggleAttendanceAction(id: string, isPresent: boolean) {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token");
  
  if (token?.value !== "statsadmin_authenticated") {
    return { success: false, message: "Unauthorized." };
  }

  try {
    await connectDB();
    await Registration.findByIdAndUpdate(id, { isPresent });
    revalidatePath("/admin");
    return { success: true, message: `Attendance updated.` };
  } catch (error) {
    console.error("Failed to update attendance:", error);
    return { success: false, message: "Failed to update attendance." };
  }
}

