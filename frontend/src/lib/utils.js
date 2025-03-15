import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const readFileAsDataURI = (file) => {
   return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if(typeof reader.result !== "string") return
        resolve(reader.result)
      }
      reader.onerror = reject;
      reader.readAsDataURL(file);
   })
}