import { PrismaClient } from "@prisma/client";
import axios from "axios";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const prisma = new PrismaClient();

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});
