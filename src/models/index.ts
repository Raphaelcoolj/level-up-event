import mongoose from "mongoose";

const RegistrationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  jobTitle: { type: String, required: true },
}, { timestamps: true });

export const Registration = mongoose.models.Registration || mongoose.model("Registration", RegistrationSchema);

const EventSettingsSchema = new mongoose.Schema({
  date: { type: String, required: true },
}, { timestamps: true });

export const EventSettings = mongoose.models.EventSettings || mongoose.model("EventSettings", EventSettingsSchema);
