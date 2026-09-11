import type { AssessmentInput } from "./space-dna";

/**
 * Browser-side persistence for assessments.
 *
 * This is deliberately a thin, replaceable layer: when the API lands, only this
 * file changes. Nothing else in the app talks to localStorage directly.
 *
 * Room photographs stay on the customer's own device until they choose to send
 * them with a consultation request — see /privacy.
 */

const KEY = "dsi.assessments.v1";

export interface StoredContact {
  name: string;
  whatsapp: string;
  email: string;
  language: "en" | "ar";
  consent: boolean;
  consentAt: string;
}

export interface StoredAssessment {
  token: string;
  createdAt: string;
  input: AssessmentInput;
  /** Downscaled previews only. Full-resolution files are never written here. */
  thumbnails: string[];
  contact?: StoredContact;
  community?: string;
}

export function newToken(): string {
  const bytes = new Uint8Array(8);
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    crypto.getRandomValues(bytes);
  } else {
    for (let i = 0; i < bytes.length; i++) bytes[i] = Math.floor(Math.random() * 256);
  }
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

function readAll(): Record<string, StoredAssessment> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(window.localStorage.getItem(KEY) ?? "{}");
  } catch {
    return {};
  }
}

export function saveAssessment(a: StoredAssessment): void {
  if (typeof window === "undefined") return;
  try {
    const all = readAll();
    all[a.token] = a;
    window.localStorage.setItem(KEY, JSON.stringify(all));
  } catch {
    /* storage unavailable — the result page still renders from memory this session */
  }
}

export function loadAssessment(token: string): StoredAssessment | null {
  return readAll()[token] ?? null;
}

export function listAssessments(): StoredAssessment[] {
  return Object.values(readAll()).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function forgetAssessment(token: string): void {
  if (typeof window === "undefined") return;
  try {
    const all = readAll();
    delete all[token];
    window.localStorage.setItem(KEY, JSON.stringify(all));
  } catch {
    /* nothing to do */
  }
}

export function forgetEverything(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    /* nothing to do */
  }
}

/** Downscale an image in the browser so a preview can be kept without storing the original. */
export function makeThumbnail(file: File, maxEdge = 520): Promise<string> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, maxEdge / Math.max(img.width, img.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        URL.revokeObjectURL(url);
        reject(new Error("Canvas unavailable"));
        return;
      }
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL("image/jpeg", 0.62));
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("That file could not be read as an image"));
    };
    img.src = url;
  });
}
