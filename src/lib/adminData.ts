import { connectDB } from "./mongoose";
import { Registration } from "@/models";
import { cookies } from "next/headers";

export async function getRegistrations() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token");
  
  if (token?.value !== "statsadmin_authenticated") {
    return [];
  }

  try {
    await connectDB();
    const regs = await Registration.find().sort({ createdAt: -1 }).lean();
    return JSON.parse(JSON.stringify(regs));
  } catch (error) {
    console.error(error);
    return [];
  }
}
