import { atom } from "nanostores";

import type { NavStore } from "@/types";

export const isActive = atom(false);

export const toggle = () => isActive.set(!isActive.get());

export const open = () => isActive.set(true);

export const close = () => isActive.set(false);

const nav: NavStore = {
  get isOpen() {
    return isActive.get();
  },
  toggle,
  open,
  close,
};

export default nav;
