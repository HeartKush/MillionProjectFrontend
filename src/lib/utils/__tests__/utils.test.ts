import {
  cn,
  formatCurrency,
  formatDate,
  debounce,
  generateId,
  isValidEmail,
  truncateText,
  getInitials,
  isEmpty,
} from "../index";

describe("Utility Functions", () => {
  describe("cn", () => {
    it("merges class names correctly", () => {
      expect(cn("class1", "class2")).toBe("class1 class2");
    });

    it("handles conditional classes", () => {
      expect(cn("base", true && "conditional")).toBe("base conditional");
      expect(cn("base", false && "conditional")).toBe("base");
    });
  });

  describe("formatCurrency", () => {
    it("formats currency correctly", () => {
      expect(formatCurrency(1000000)).toMatch(/\$\s*1\.000\.000/);
      expect(formatCurrency(0)).toMatch(/\$\s*0/);
      expect(formatCurrency(1234567)).toMatch(/\$\s*1\.234\.567/);
    });
  });

  describe("formatDate", () => {
    it("formats date correctly", () => {
      const date = new Date("2023-12-25");
      const formatted = formatDate(date);
      expect(formatted).toContain("diciembre");
      expect(formatted).toContain("2023");
    });

    it("handles string dates", () => {
      const formatted = formatDate("2023-12-25");
      expect(formatted).toContain("diciembre");
      expect(formatted).toContain("2023");
    });
  });

  describe("debounce", () => {
    it("debounces function calls", (done) => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 100);

      debouncedFn("test1");
      debouncedFn("test2");
      debouncedFn("test3");

      setTimeout(() => {
        expect(mockFn).toHaveBeenCalledTimes(1);
        expect(mockFn).toHaveBeenCalledWith("test3");
        done();
      }, 150);
    });
  });

  describe("generateId", () => {
    it("generates id with default length", () => {
      const id = generateId();
      expect(id).toHaveLength(8);
      expect(typeof id).toBe("string");
    });

    it("generates id with custom length", () => {
      const id = generateId(12);
      expect(id).toHaveLength(12);
    });
  });

  describe("isValidEmail", () => {
    it("validates correct emails", () => {
      expect(isValidEmail("test@example.com")).toBe(true);
      expect(isValidEmail("user.name@domain.co")).toBe(true);
    });

    it("rejects invalid emails", () => {
      expect(isValidEmail("invalid-email")).toBe(false);
      expect(isValidEmail("@domain.com")).toBe(false);
      expect(isValidEmail("user@")).toBe(false);
    });
  });

  describe("truncateText", () => {
    it("truncates long text", () => {
      expect(truncateText("This is a long text", 10)).toBe("This is a ...");
    });

    it("returns original text if shorter than limit", () => {
      expect(truncateText("Short", 10)).toBe("Short");
    });
  });

  describe("getInitials", () => {
    it("generates initials from full name", () => {
      expect(getInitials("John Doe")).toBe("JD");
      expect(getInitials("Jane Smith Wilson")).toBe("JS");
    });

    it("handles single name", () => {
      expect(getInitials("John")).toBe("J");
    });
  });

  describe("isEmpty", () => {
    it("identifies empty values", () => {
      expect(isEmpty(null)).toBe(true);
      expect(isEmpty(undefined)).toBe(true);
      expect(isEmpty("")).toBe(true);
      expect(isEmpty("   ")).toBe(true);
      expect(isEmpty([])).toBe(true);
      expect(isEmpty({})).toBe(true);
    });

    it("identifies non-empty values", () => {
      expect(isEmpty("text")).toBe(false);
      expect(isEmpty(0)).toBe(false);
      expect(isEmpty(false)).toBe(false);
      expect(isEmpty([1, 2, 3])).toBe(false);
      expect(isEmpty({ key: "value" })).toBe(false);
    });
  });
});
