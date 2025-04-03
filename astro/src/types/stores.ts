// ==============================
// Stores
// ==============================

export interface NavStore {
  readonly isOpen: boolean;
  toggle: () => void;
  open: () => void;
  close: () => void;
}
