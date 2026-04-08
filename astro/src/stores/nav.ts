import { atom } from "nanostores";

import type { NavStore } from "@/types";

export const isActive = atom(false);

/**
 * @name toggle
 * @function
 * @description Toggles the navigation open state between true and false.
 * @returns {void}
 */
export const toggle = () => isActive.set(!isActive.get());

/**
 * @name open
 * @function
 * @description Sets the navigation open state to true.
 * @returns {void}
 */
export const open = () => isActive.set(true);

/**
 * @name close
 * @function
 * @description Sets the navigation open state to false.
 * @returns {void}
 */
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
