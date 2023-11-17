import { atom } from "jotai";

export type Storage = {
  messages: {
    faqid: string;
    isSent: boolean;
    timestamp: number;
    message: string;
  }[];
};

export const storageAtom = atom<Storage | null>(null);
