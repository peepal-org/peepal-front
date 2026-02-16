let onForceLogout: (() => void) | null = null;

export function setForceLogoutHandler(handler: () => void) {
  onForceLogout = handler;
}

export function triggerForceLogout() {
  onForceLogout?.();
}
