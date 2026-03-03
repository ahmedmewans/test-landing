import { Fraunces, Outfit } from "next/font/google";

/** Portfolio page fonts */
export const outfit = Outfit({
  weight: ["400", "700", "900"],
  subsets: ["latin"],
  preload: true,
  display: "swap",
  variable: "--font-outfit",
});

export const fraunces = Fraunces({
  weight: ["400", "700", "900"],
  subsets: ["latin"],
  preload: true,
  display: "swap",
  variable: "--font-fraunces",
});
