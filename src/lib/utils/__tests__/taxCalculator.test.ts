import {
  calculatePropertyTransferTax,
  formatUVT,
  getBracketDescription,
  UVT_VALUE_2025,
  TAX_BRACKETS,
} from "../taxCalculator";

describe("taxCalculator", () => {
  describe("calculatePropertyTransferTax", () => {
    it("should calculate tax for exempt property (below 20,000 UVT)", () => {
      const propertyValue = 500000000; // ~10,046 UVT (below threshold)
      const result = calculatePropertyTransferTax(propertyValue);

      expect(result).toEqual({
        valueInCOP: 500000000,
        valueInUVT: 10046.212577858147,
        taxAmount: 0,
        taxRate: 0,
        bracket: "exempt",
        breakdown: {
          exemptAmount: 500000000,
        },
      });
    });

    it("should calculate tax for low bracket property (20,000 - 50,000 UVT)", () => {
      const propertyValue = 1000000000; // ~20,092 UVT (above threshold)
      const result = calculatePropertyTransferTax(propertyValue);

      expect(result).toEqual({
        valueInCOP: 1000000000,
        valueInUVT: 20092.425155716293,
        taxAmount: 69000,
        taxRate: 0.015,
        bracket: "low",
        breakdown: {
          exemptAmount: 995400000,
          lowBracketAmount: 4600000,
          lowBracketTax: 69000,
        },
      });
    });

    it("should calculate tax for high bracket property (above 50,000 UVT)", () => {
      const propertyValue = 2500000000; // ~50,231 UVT (above high threshold)
      const result = calculatePropertyTransferTax(propertyValue);

      expect(result).toEqual({
        valueInCOP: 2500000000,
        valueInUVT: 50231.06288929074,
        taxAmount: 45138000,
        taxRate: 0.03,
        bracket: "high",
        breakdown: {
          exemptAmount: 995400000,
          lowBracketAmount: 1493100000,
          highBracketAmount: 11500000,
          lowBracketTax: 22396500,
          highBracketTax: 345000,
          fixedAmount: 22396500,
        },
      });
    });

    it("should handle edge case at exact threshold values", () => {
      // Exactly at 20,000 UVT threshold
      const exactThreshold = 20_000 * UVT_VALUE_2025;
      const result = calculatePropertyTransferTax(exactThreshold);

      expect(result.bracket).toBe("exempt");
      expect(result.taxAmount).toBe(0);

      // Just above 20,000 UVT threshold
      const justAboveThreshold = exactThreshold + 1;
      const resultAbove = calculatePropertyTransferTax(justAboveThreshold);

      expect(resultAbove.bracket).toBe("low");
      expect(resultAbove.taxAmount).toBeGreaterThan(0);
    });

    it("should handle very large property values", () => {
      const propertyValue = 10000000000; // ~200,924 UVT
      const result = calculatePropertyTransferTax(propertyValue);

      expect(result).toEqual({
        valueInCOP: 10000000000,
        valueInUVT: 200924.25155716296,
        taxAmount: 270138000,
        taxRate: 0.03,
        bracket: "high",
        breakdown: {
          exemptAmount: 995400000,
          lowBracketAmount: 1493100000,
          highBracketAmount: 7511500000,
          lowBracketTax: 22396500,
          highBracketTax: 225345000,
          fixedAmount: 22396500,
        },
      });
    });

    it("should handle zero property value", () => {
      const result = calculatePropertyTransferTax(0);

      expect(result).toEqual({
        valueInCOP: 0,
        valueInUVT: 0,
        taxAmount: 0,
        taxRate: 0,
        bracket: "exempt",
        breakdown: {
          exemptAmount: 0,
        },
      });
    });

    it("should handle negative property value", () => {
      const result = calculatePropertyTransferTax(-1000000);

      expect(result).toEqual({
        valueInCOP: -1000000,
        valueInUVT: -20.092425155716295,
        taxAmount: 0,
        taxRate: 0,
        bracket: "exempt",
        breakdown: {
          exemptAmount: -1000000,
        },
      });
    });
  });

  describe("formatUVT", () => {
    it("should format UVT values with 2 decimal places", () => {
      expect(formatUVT(1234.5678)).toBe("1.234,57");
      expect(formatUVT(0)).toBe("0,00");
      expect(formatUVT(1000000.123)).toBe("1.000.000,12");
    });

    it("should handle negative UVT values", () => {
      expect(formatUVT(-1234.5678)).toBe("-1.234,57");
    });

    it("should handle very small UVT values", () => {
      expect(formatUVT(0.001)).toBe("0,00");
      expect(formatUVT(0.005)).toBe("0,01");
    });
  });

  describe("getBracketDescription", () => {
    it("should return correct description for exempt bracket", () => {
      expect(getBracketDescription("exempt")).toBe(
        "Exento (menos de 20.000,00 UVT)"
      );
    });

    it("should return correct description for low bracket", () => {
      expect(getBracketDescription("low")).toBe(
        "Baja (20.000,00 - 50.000,00 UVT)"
      );
    });

    it("should return correct description for high bracket", () => {
      expect(getBracketDescription("high")).toBe("Alta (más de 50.000,00 UVT)");
    });
  });

  describe("constants", () => {
    it("should have correct UVT value for 2025", () => {
      expect(UVT_VALUE_2025).toBe(49770);
    });

    it("should have correct tax bracket constants", () => {
      expect(TAX_BRACKETS.EXEMPT_THRESHOLD).toBe(20000);
      expect(TAX_BRACKETS.LOW_BRACKET_MAX).toBe(50000);
      expect(TAX_BRACKETS.LOW_RATE).toBe(0.015);
      expect(TAX_BRACKETS.HIGH_RATE).toBe(0.03);
      expect(TAX_BRACKETS.HIGH_BRACKET_FIXED).toBe(450);
    });
  });
});
