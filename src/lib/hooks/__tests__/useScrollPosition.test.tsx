import { renderHook, act } from "@testing-library/react";
import { useScrollPosition } from "../useScrollPosition";

// Mock window.scrollX and window.scrollY
let mockScrollX = 0;
let mockScrollY = 0;

Object.defineProperty(window, "scrollX", {
  get: () => mockScrollX,
});

Object.defineProperty(window, "scrollY", {
  get: () => mockScrollY,
});

describe("useScrollPosition", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset scroll position
    mockScrollX = 0;
    mockScrollY = 0;
  });

  it("should initialize with scroll position 0,0", () => {
    const { result } = renderHook(() => useScrollPosition());

    expect(result.current).toEqual({ x: 0, y: 0 });
  });

  it("should update scroll position when window is scrolled", () => {
    const { result } = renderHook(() => useScrollPosition());

    // Simulate scroll
    mockScrollX = 100;
    mockScrollY = 200;

    act(() => {
      // Trigger scroll event
      window.dispatchEvent(new Event("scroll"));
    });

    expect(result.current).toEqual({ x: 100, y: 200 });
  });

  it("should update scroll position multiple times", () => {
    const { result } = renderHook(() => useScrollPosition());

    // First scroll
    mockScrollX = 50;
    mockScrollY = 75;

    act(() => {
      window.dispatchEvent(new Event("scroll"));
    });

    expect(result.current).toEqual({ x: 50, y: 75 });

    // Second scroll
    mockScrollX = 150;
    mockScrollY = 300;

    act(() => {
      window.dispatchEvent(new Event("scroll"));
    });

    expect(result.current).toEqual({ x: 150, y: 300 });
  });

  it("should handle negative scroll values", () => {
    const { result } = renderHook(() => useScrollPosition());

    mockScrollX = -50;
    mockScrollY = -100;

    act(() => {
      window.dispatchEvent(new Event("scroll"));
    });

    expect(result.current).toEqual({ x: -50, y: -100 });
  });

  it("should clean up event listener on unmount", () => {
    const removeEventListenerSpy = jest.spyOn(window, "removeEventListener");
    const { unmount } = renderHook(() => useScrollPosition());

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      "scroll",
      expect.any(Function)
    );
  });

  it("should add event listener on mount", () => {
    const addEventListenerSpy = jest.spyOn(window, "addEventListener");
    renderHook(() => useScrollPosition());

    expect(addEventListenerSpy).toHaveBeenCalledWith(
      "scroll",
      expect.any(Function)
    );
  });
});
