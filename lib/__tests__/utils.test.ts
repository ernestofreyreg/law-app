import { describe, it, expect } from "vitest";
import { cn } from "../utils";

describe("cn utility function", () => {
  it("should merge class names correctly", () => {
    expect(cn("base", "additional")).toBe("base additional");
  });

  it("should handle conditional classes", () => {
    expect(cn("base", { conditional: true, hidden: false })).toBe(
      "base conditional"
    );
  });

  it("should handle undefined and null values", () => {
    expect(cn("base", undefined, null, "valid")).toBe("base valid");
  });

  it("should handle Tailwind classes correctly", () => {
    expect(cn("p-4 bg-red-500", "p-4 bg-blue-500")).toBe("p-4 bg-blue-500");
  });

  it("should handle multiple conditional classes", () => {
    expect(
      cn("base", {
        "text-red-500": true,
        "text-blue-500": false,
        "font-bold": true,
      })
    ).toBe("base text-red-500 font-bold");
  });
});
