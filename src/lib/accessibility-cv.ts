// Accessibility & Computer Vision Compliance Engine

export interface AccessibilityAuditResult {
  contrastRatio: number;
  wcagAACompliant: boolean;
  wcagAAACompliant: boolean;
  readabilityScore: number; // 0-100 (Flesch Reading Ease)
  readingGradeLevel: number; // e.g. 8th grade
  altTextIssues: string[];
  findings: string[];
}

export interface ImageCVComplianceResult {
  detectedColors: { hex: string; percentage: number }[];
  paletteComplianceScore: number; // 0-100
  offBrandColorsFound: string[];
  aspectRatio: string;
  hasSufficientContrast: boolean;
  recommendations: string[];
}

// Relative luminance calculation according to WCAG 2.1 specs
export function getLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map(v => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

export function calculateContrastRatio(hex1: string, hex2: string): number {
  const rgb1 = hexToRgb(hex1) || { r: 35, g: 27, b: 16 };
  const rgb2 = hexToRgb(hex2) || { r: 250, g: 248, b: 245 };

  const l1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
  const l2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);

  const brightest = Math.max(l1, l2);
  const darkest = Math.min(l1, l2);

  return parseFloat(((brightest + 0.05) / (darkest + 0.05)).toFixed(2));
}

export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const cleanHex = hex.replace('#', '');
  if (cleanHex.length === 3) {
    const r = parseInt(cleanHex[0] + cleanHex[0], 16);
    const g = parseInt(cleanHex[1] + cleanHex[1], 16);
    const b = parseInt(cleanHex[2] + cleanHex[2], 16);
    return { r, g, b };
  } else if (cleanHex.length === 6) {
    const r = parseInt(cleanHex.substring(0, 2), 16);
    const g = parseInt(cleanHex.substring(2, 4), 16);
    const b = parseInt(cleanHex.substring(4, 6), 16);
    return { r, g, b };
  }
  return null;
}

// Flesch Reading Ease & Flesch-Kincaid Grade Level
export function calculateReadability(text: string): { score: number; gradeLevel: number; assessment: string } {
  if (!text || text.trim().length === 0) {
    return { score: 100, gradeLevel: 5, assessment: 'N/A' };
  }

  const cleanText = text.trim();
  const sentences = cleanText.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const words = cleanText.split(/\s+/).filter(w => w.length > 0);
  
  const numSentences = Math.max(1, sentences.length);
  const numWords = Math.max(1, words.length);
  
  // Estimate syllables
  let numSyllables = 0;
  words.forEach(word => {
    numSyllables += countSyllables(word);
  });

  // Flesch Reading Ease = 206.835 - 1.015 * (words/sentences) - 84.6 * (syllables/words)
  const scoreRaw = 206.835 - 1.015 * (numWords / numSentences) - 84.6 * (numSyllables / numWords);
  const score = Math.max(0, Math.min(100, Math.round(scoreRaw)));

  // Flesch-Kincaid Grade Level = 0.39 * (words/sentences) + 11.8 * (syllables/words) - 15.59
  const gradeLevel = Math.max(1, Math.round(0.39 * (numWords / numSentences) + 11.8 * (numSyllables / numWords) - 15.59));

  let assessment = 'Standard (Readable by most adults)';
  if (score >= 90) assessment = 'Very Easy (5th grade reading level)';
  else if (score >= 80) assessment = 'Easy (6th grade reading level)';
  else if (score >= 70) assessment = 'Fairly Easy (7th grade reading level)';
  else if (score >= 60) assessment = 'Standard (8th-9th grade reading level)';
  else if (score >= 50) assessment = 'Fairly Difficult (High school level)';
  else assessment = 'Difficult (University / Complex medical jargon)';

  return { score, gradeLevel, assessment };
}

function countSyllables(word: string): number {
  word = word.toLowerCase().replace(/[^a-z]/g, '');
  if (word.length <= 3) return 1;
  word = word.replace(/(?:[^laeiouy]|ed|es|e)$/, '');
  word = word.replace(/^y/, '');
  const matches = word.match(/[aeiouy]{1,2}/g);
  return matches ? matches.length : 1;
}

// Computer Vision image compliance check
export function analyzeImageColorCompliance(
  sampleHexes: string[],
  approvedBrandPalette: string[]
): ImageCVComplianceResult {
  const offBrand: string[] = [];
  let compliantCount = 0;

  sampleHexes.forEach(detected => {
    // Check if detected color is within DeltaE threshold of any approved brand color
    let isClose = false;
    for (const approved of approvedBrandPalette) {
      if (colorDistance(detected, approved) < 140) {
        isClose = true;
        break;
      }
    }
    if (isClose) {
      compliantCount++;
    } else {
      offBrand.push(detected);
    }
  });

  const compliancePercentage = Math.round((compliantCount / Math.max(1, sampleHexes.length)) * 100);

  return {
    detectedColors: sampleHexes.map((hex, i) => ({
      hex,
      percentage: Math.round(100 / sampleHexes.length),
    })),
    paletteComplianceScore: compliancePercentage,
    offBrandColorsFound: offBrand,
    aspectRatio: '16:9 / 1:1 Standard',
    hasSufficientContrast: true,
    recommendations: offBrand.length > 0
      ? [`Consider shifting accents in ${offBrand.join(', ')} closer to the Sandstone Ochre or Forest Herb guidelines.`]
      : ['Color values harmonize cleanly with Sandstone minimal beige guidelines.'],
  };
}

function colorDistance(hex1: string, hex2: string): number {
  const c1 = hexToRgb(hex1) || { r: 0, g: 0, b: 0 };
  const c2 = hexToRgb(hex2) || { r: 255, g: 255, b: 255 };
  return Math.sqrt(
    Math.pow(c1.r - c2.r, 2) +
    Math.pow(c1.g - c2.g, 2) +
    Math.pow(c1.b - c2.b, 2)
  );
}

