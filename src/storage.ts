import { atom } from "jotai";

export type Storage = {
    test?: string;
}

export const storageAtom = atom<Storage | null>(null)