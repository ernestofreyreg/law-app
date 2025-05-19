import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useToast } from "../use-toast";

describe("useToast", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it("should add a toast", () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.toast({
        title: "Test Title",
        description: "Test Description",
      });
    });

    expect(result.current.toasts).toHaveLength(1);
    expect(result.current.toasts[0]).toMatchObject({
      title: "Test Title",
      description: "Test Description",
      open: true,
    });
  });

  it("should limit the number of toasts", () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.toast({ title: "Toast 1" });
      result.current.toast({ title: "Toast 2" });
      result.current.toast({ title: "Toast 3" });
    });

    expect(result.current.toasts).toHaveLength(1);
    expect(result.current.toasts[0].title).toBe("Toast 3");
  });

  it("should dismiss a toast", () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      const { id } = result.current.toast({
        title: "Test Title",
        description: "Test Description",
      });
      result.current.dismiss(id);
    });

    expect(result.current.toasts[0].open).toBe(false);
  });

  it("should update a toast", () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      const { id, update } = result.current.toast({
        title: "Original Title",
        description: "Original Description",
      });

      update({
        id,
        title: "Updated Title",
        description: "Updated Description",
      });
    });

    expect(result.current.toasts[0]).toMatchObject({
      title: "Updated Title",
      description: "Updated Description",
    });
  });
});
