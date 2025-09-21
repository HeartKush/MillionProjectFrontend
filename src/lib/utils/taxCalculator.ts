/**
 * Tax Calculator for Colombian Property Sales
 * Based on 2025 Colombian tax table for real estate transactions
 */

// UVT (Unidad de Valor Tributario) value for 2025
// Source: DIAN - Dirección de Impuestos y Aduanas Nacionales
export const UVT_VALUE_2025 = 49770; // COP

// Tax brackets in UVT
export const TAX_BRACKETS = {
  EXEMPT_THRESHOLD: 20000, // UVT - No tax below this value
  LOW_BRACKET_MAX: 50000,  // UVT - Upper limit for 1.5% rate
  LOW_RATE: 0.015,         // 1.5% for values between 20,000 and 50,000 UVT
  HIGH_RATE: 0.03,         // 3% for values above 50,000 UVT
  HIGH_BRACKET_FIXED: 450, // UVT - Fixed amount for high bracket
} as const;

export interface TaxCalculationResult {
  valueInCOP: number;
  valueInUVT: number;
  taxAmount: number;
  taxRate: number;
  bracket: 'exempt' | 'low' | 'high';
  breakdown: {
    exemptAmount?: number;
    lowBracketAmount?: number;
    highBracketAmount?: number;
    lowBracketTax?: number;
    highBracketTax?: number;
    fixedAmount?: number;
  };
}

/**
 * Calculate property transfer tax based on Colombian 2025 tax table
 * @param propertyValue - Property value in COP (Colombian Pesos)
 * @returns Tax calculation result with breakdown
 */
export function calculatePropertyTransferTax(propertyValue: number): TaxCalculationResult {
  // Convert COP to UVT
  const valueInUVT = propertyValue / UVT_VALUE_2025;
  
  let taxAmount = 0;
  let taxRate = 0;
  let bracket: 'exempt' | 'low' | 'high' = 'exempt';
  const breakdown: TaxCalculationResult['breakdown'] = {};

  if (valueInUVT <= TAX_BRACKETS.EXEMPT_THRESHOLD) {
    // Exempt: No tax for properties under 20,000 UVT
    bracket = 'exempt';
    breakdown.exemptAmount = propertyValue;
  } else if (valueInUVT <= TAX_BRACKETS.LOW_BRACKET_MAX) {
    // Low bracket: 1.5% on excess above 20,000 UVT
    bracket = 'low';
    const exemptAmount = TAX_BRACKETS.EXEMPT_THRESHOLD * UVT_VALUE_2025;
    const taxableAmount = propertyValue - exemptAmount;
    
    breakdown.exemptAmount = exemptAmount;
    breakdown.lowBracketAmount = taxableAmount;
    breakdown.lowBracketTax = taxableAmount * TAX_BRACKETS.LOW_RATE;
    
    taxAmount = breakdown.lowBracketTax;
    taxRate = TAX_BRACKETS.LOW_RATE;
  } else {
    // High bracket: 3% on excess above 50,000 UVT + 450 UVT fixed
    bracket = 'high';
    const exemptAmount = TAX_BRACKETS.EXEMPT_THRESHOLD * UVT_VALUE_2025;
    const lowBracketAmount = (TAX_BRACKETS.LOW_BRACKET_MAX - TAX_BRACKETS.EXEMPT_THRESHOLD) * UVT_VALUE_2025;
    const highBracketAmount = propertyValue - (exemptAmount + lowBracketAmount);
    const fixedAmount = TAX_BRACKETS.HIGH_BRACKET_FIXED * UVT_VALUE_2025;
    
    breakdown.exemptAmount = exemptAmount;
    breakdown.lowBracketAmount = lowBracketAmount;
    breakdown.highBracketAmount = highBracketAmount;
    breakdown.lowBracketTax = lowBracketAmount * TAX_BRACKETS.LOW_RATE;
    breakdown.highBracketTax = highBracketAmount * TAX_BRACKETS.HIGH_RATE;
    breakdown.fixedAmount = fixedAmount;
    
    taxAmount = breakdown.lowBracketTax! + breakdown.highBracketTax! + fixedAmount;
    taxRate = TAX_BRACKETS.HIGH_RATE;
  }

  return {
    valueInCOP: propertyValue,
    valueInUVT,
    taxAmount,
    taxRate,
    bracket,
    breakdown,
  };
}

/**
 * Format UVT value for display
 * @param uvtValue - Value in UVT
 * @returns Formatted string
 */
export function formatUVT(uvtValue: number): string {
  return new Intl.NumberFormat('es-CO', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(uvtValue);
}

/**
 * Get bracket description in Spanish
 * @param bracket - Tax bracket
 * @returns Description string
 */
export function getBracketDescription(bracket: 'exempt' | 'low' | 'high'): string {
  switch (bracket) {
    case 'exempt':
      return `Exento (menos de ${formatUVT(TAX_BRACKETS.EXEMPT_THRESHOLD)} UVT)`;
    case 'low':
      return `Baja (${formatUVT(TAX_BRACKETS.EXEMPT_THRESHOLD)} - ${formatUVT(TAX_BRACKETS.LOW_BRACKET_MAX)} UVT)`;
    case 'high':
      return `Alta (más de ${formatUVT(TAX_BRACKETS.LOW_BRACKET_MAX)} UVT)`;
  }
}
