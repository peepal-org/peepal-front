import { setForceLogoutHandler, triggerForceLogout } from "@/auth/authEvents";

describe("authEvents", () => {
  it("should call the handler when triggerForceLogout is called", () => {
    const handler = jest.fn();
    setForceLogoutHandler(handler);

    triggerForceLogout();

    expect(handler).toHaveBeenCalledTimes(1);
  });

  it("should not crash if no handler is set", () => {
    setForceLogoutHandler(undefined as any);

    expect(() => triggerForceLogout()).not.toThrow();
  });

  it("should replace previous handler", () => {
    const first = jest.fn();
    const second = jest.fn();

    setForceLogoutHandler(first);
    setForceLogoutHandler(second);
    triggerForceLogout();

    expect(first).not.toHaveBeenCalled();
    expect(second).toHaveBeenCalledTimes(1);
  });
});
