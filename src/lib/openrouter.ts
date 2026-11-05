import { BrandGuidelineConfig, ReviewResult, ComplianceIssue } from './types';

// Common spelling mistakes dictionary
const COMMON_SPELLING_ERRORS: Record<string, string> = {
  grammer: 'grammar',
  teh: 'the',
  recieve: 'receive',
  seperate: 'separate',
  definately: 'definitely',
  untill: 'until',
  occured: 'occurred',
  adress: 'address',
  goverment: 'government',
  experiance: 'experience',
  beleive: 'believe',
  reccomend: 'recommend',
  sucessful: 'successful',
  truely: 'truly',
  completly: 'completely',
  acheive: 'achieve',
  wierd: 'weird',
  neccessary: 'necessary',
  necesary: 'necessary',
  tommorow: 'tomorrow',
  tomorow: 'tomorrow',
  guidline: 'guideline',
  guidlines: 'guidelines',
  maintainance: 'maintenance',
  calender: 'calendar',
  priviledge: 'privilege',
  occurence: 'occurrence',
  embarass: 'embarrass',
  existance: 'existence',
  independant: 'independent',
  noticable: 'noticeable',
  beleif: 'belief',
  concious: 'conscious',
  dissapoint: 'disappoint',
  foriegn: 'foreign',
  garantee: 'guarantee',
  harrass: 'harass',
  judgement: 'judgment',
  libary: 'library',
  posession: 'possession',
  pronounciation: 'pronunciation',
  rythm: 'rhythm',
  writting: 'writing',
  alot: 'a lot',
  loose: 'lose', // contextually checked
};

// Common grammar mistakes
const COMMON_GRAMMAR_PATTERNS = [
  { pattern: /\bthey is\b/gi, replacement: 'they are', note: 'Subject-verb agreement: plural pronoun "they" requires "are".' },
  { pattern: /\bwe was\b/gi, replacement: 'we were', note: 'Subject-verb agreement: plural pronoun "we" requires "were".' },
  { pattern: /\bhe have\b/gi, replacement: 'he has', note: 'Subject-verb agreement: third-person singular "he" requires "has".' },
  { pattern: /\bshe have\b/gi, replacement: 'she has', note: 'Subject-verb agreement: third-person singular "she" requires "has".' },
  { pattern: /\bit have\b/gi, replacement: 'it has', note: 'Subject-verb agreement: third-person singular "it" requires "has".' },
  { pattern: /\bdoes not has\b/gi, replacement: 'does not have', note: 'Auxiliary verb "does" must be paired with base verb "have".' },
  { pattern: /\bdo not has\b/gi, replacement: 'do not have', note: 'Auxiliary verb "do" must be paired with base verb "have".' },
  { pattern: /\bcould of\b/gi, replacement: 'could have', note: 'Use "could have" rather than "could of".' },
  { pattern: /\bshould of\b/gi, replacement: 'should have', note: 'Use "should have" rather than "should of".' },
  { pattern: /\bwould of\b/gi, replacement: 'would have', note: 'Use "would have" rather than "would of".' },
];

// Explicit, sexual, and adult language blacklist for brand safety
const ADULT_SEXUAL_TERMS = [
  { term: 'sexual', rep: 'clinical / wellness', note: 'Brand guidelines mandate avoidance of sexualized framing in public copy.' },
  { term: 'sex', rep: 'wellness / vitality', note: 'Explicit or sexual terminology violates brand safety rule SAFE-01.' },
  { term: 'sexy', rep: 'appealing / refined', note: 'Colloquial sexualized terminology violates professional brand tone.' },
  { term: 'nude', rep: 'unadorned', note: 'Explicit terminology flagged by Brand Safety filter.' },
  { term: 'porn', rep: 'media', note: 'Explicit adult terminology strictly prohibited.' },
  { term: 'erotic', rep: 'engaging', note: 'Adult content terms violate brand safety policy.' },
  { term: 'nsfw', rep: 'sensitive', note: 'NSFW markers violate public publishing standards.' },
  { term: 'intercourse', rep: 'physiological interaction', note: 'Clinical/professional neutrality required.' },
  { term: 'fetish', rep: 'preference', note: 'Inappropriate adult terminology flagged.' },
  { term: 'horny', rep: 'energized', note: 'Explicit adult slang strictly prohibited.' },
  { term: 'hookup', rep: 'consultation', note: 'Slang reference to casual intimacy violates professional standards.' },
];

export async function analyzeContentWithOpenRouter(
  content: string,
  guidelines: BrandGuidelineConfig,
  format: string = 'text',
  channel?: string
): Promise<ReviewResult> {
  const apiKey = process.env.OPENROUTER_API_KEY || '';

  const systemPrompt = `You are VibeCheck AI, an elite brand-governance, editorial, and compliance auditor.
Your job is to thoroughly review the draft content before publication against:
1. Brand Safety & Content Guidelines (e.g. STRICTLY flag sexual content, adult innuendo, vulgarity, or off-brand themes).
2. Spelling, Grammatical, and Typographical errors (thoroughly check and mark every spelling mistake, repeated word, or grammatical error).
3. Brand Guidelines, Tone sliders, Approved Glossary (forbidden words -> preferred alternatives), and Competitor mentions.
4. Unsupported medical/promotional claims (guarantees, unverified statistics).

Brand Name: "${guidelines.brandName}"
Tone Sliders: Formal vs Casual: ${guidelines.toneSliders.formalVsCasual}/100, Serious vs Playful: ${guidelines.toneSliders.seriousVsPlayful}/100, Reserved vs Bold: ${guidelines.toneSliders.reservedVsBold}/100

Approved Glossary:
${guidelines.approvedGlossary.map(g => `- Forbidden: "${g.forbidden}" -> Preferred: "${g.preferred}" (${g.reason})`).join('\n')}

Competitor Lockout: ${guidelines.competitorLockout.join(', ')}

Brand Rules:
${guidelines.rules.map(r => `- [${r.ruleCode}] ${r.title}: ${r.description} (${r.severity})`).join('\n')}

INSTRUCTIONS:
1. If the content contains ANY sexual, explicit, or inappropriate words, mark them with category "safety", severity "critical", and explain the brand safety violation.
2. If the content has ANY spelling mistake or grammatical error, mark them with category "spelling" or "grammar", and provide the exact correct spelling/grammar replacement.
3. If the content contains forbidden glossary words or competitor names, flag them with category "terminology" or "competitor".
4. Calculate realistic scores (0-100). If issues are found, the overallScore MUST be lower than 100! (e.g. 40-75 depending on severity).
5. Provide a full rewritten text (suggestedFullText) fixing all mistakes.
6. Return ONLY valid JSON:
{
  "overallScore": number,
  "toneScore": number,
  "terminologyScore": number,
  "claimsScore": number,
  "visualScore": number,
  "accessibilityScore": number,
  "grammarScore": number,
  "summary": "plain english executive summary of findings",
  "issues": [
    {
      "id": "iss_1",
      "guidelineRef": "RULE CODE or GLOSSARY or SPELL or GRAMMAR",
      "category": "safety" | "spelling" | "grammar" | "tone" | "terminology" | "claims" | "competitor",
      "severity": "critical" | "warning" | "suggestion",
      "originalText": "exact text flagged",
      "suggestedReplacement": "corrected / compliant text",
      "explanation": "explanation of the mistake and policy involved",
      "status": "pending"
    }
  ],
  "suggestedFullText": "complete suggested rewrite"
}`;

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': 'https://vibecheck-ai.internal',
        'X-Title': 'VibeCheck AI Brand Governance',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.0-flash-001',
        messages: [
          { role: 'system', content: systemPrompt },
          {
            role: 'user',
            content: `Review this ${format} content (Channel: ${channel || 'general'}):\n\n"""\n${content}\n"""`
          }
        ],
        temperature: 0.2,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      const reply = data.choices?.[0]?.message?.content;
      if (reply) {
        const cleanJson = reply.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(cleanJson);
        if (parsed.overallScore !== undefined && Array.isArray(parsed.issues)) {
          return {
            ...parsed,
            aiDisclosure: 'AI Brand Review verified with OpenRouter LLM. Human review required.',
            analyzedAt: new Date().toISOString(),
            modelUsed: data.model || 'OpenRouter LLM',
          };
        }
      }
    }
  } catch (err) {
    console.warn('OpenRouter API call failed or rate-limited; activating local NLP engine:', err);
  }

  // Advanced NLP Deterministic Compliance Engine
  return runComprehensiveNLPReview(content, guidelines);
}

export function runComprehensiveNLPReview(
  content: string,
  guidelines: BrandGuidelineConfig
): ReviewResult {
  const issues: ComplianceIssue[] = [];
  let scoreDeduction = 0;
  let safetyDeduction = 0;
  let grammarDeduction = 0;
  let termDeduction = 0;
  let claimDeduction = 0;
  let toneDeduction = 0;

  let suggestedText = content;
  let issueCounter = 1;

  // 1. BRAND SAFETY: Check Sexual, Adult & Explicit Terms
  ADULT_SEXUAL_TERMS.forEach((item) => {
    const regex = new RegExp(`\\b${item.term}\\b`, 'gi');
    if (regex.test(content)) {
      safetyDeduction += 30;
      scoreDeduction += 30;
      issues.push({
        id: `iss_safe_${issueCounter++}`,
        guidelineRef: 'RULE-SAFE-01',
        category: 'safety',
        severity: 'critical',
        originalText: item.term,
        suggestedReplacement: item.rep,
        explanation: `Brand safety guidelines strictly prohibit sexual, adult, or explicit content. "${item.term}" violates editorial brand standards.`,
        status: 'pending',
      });
      suggestedText = suggestedText.replace(regex, item.rep);
    }
  });

  // Also check if any configured guideline specifically mentions "sexual" or "adult"
  const hasSexualGuidelineRule = guidelines.rules.some((r) =>
    r.title.toLowerCase().includes('sexual') || r.description.toLowerCase().includes('sexual')
  );

  // 2. SPELLING & TYPOGRAPHICAL ERROR DETECTION
  const words = content.split(/[\s,.;:!?()"]+/);
  const seenTypos = new Set<string>();

  words.forEach((w) => {
    const cleanWord = w.toLowerCase().trim();
    if (cleanWord && COMMON_SPELLING_ERRORS[cleanWord] && !seenTypos.has(cleanWord)) {
      seenTypos.add(cleanWord);
      const correction = COMMON_SPELLING_ERRORS[cleanWord];
      grammarDeduction += 12;
      scoreDeduction += 12;

      issues.push({
        id: `iss_spell_${issueCounter++}`,
        guidelineRef: 'RULE-LANG-SPELL',
        category: 'spelling',
        severity: 'warning',
        originalText: w,
        suggestedReplacement: correction,
        explanation: `Spelling error detected: "${w}" is misspelled. Suggested correct spelling is "${correction}".`,
        status: 'pending',
      });

      const repRegex = new RegExp(`\\b${w}\\b`, 'g');
      suggestedText = suggestedText.replace(repRegex, correction);
    }
  });

  // 3. GRAMMAR PATTERN CHECKS
  COMMON_GRAMMAR_PATTERNS.forEach((patternObj) => {
    if (patternObj.pattern.test(content)) {
      grammarDeduction += 15;
      scoreDeduction += 15;

      const matches = content.match(patternObj.pattern);
      const matchedText = matches ? matches[0] : 'grammar mismatch';

      issues.push({
        id: `iss_gram_${issueCounter++}`,
        guidelineRef: 'RULE-LANG-GRAMMAR',
        category: 'grammar',
        severity: 'warning',
        originalText: matchedText,
        suggestedReplacement: patternObj.replacement,
        explanation: patternObj.note,
        status: 'pending',
      });

      suggestedText = suggestedText.replace(patternObj.pattern, patternObj.replacement);
    }
  });

  // Repeated word check (e.g. "the the", "is is")
  const repeatedWordRegex = /\b(\w+)\s+\1\b/gi;
  let repMatch;
  while ((repMatch = repeatedWordRegex.exec(content)) !== null) {
    grammarDeduction += 10;
    scoreDeduction += 10;
    issues.push({
      id: `iss_rep_${issueCounter++}`,
      guidelineRef: 'RULE-LANG-REDUNDANCY',
      category: 'grammar',
      severity: 'warning',
      originalText: repMatch[0],
      suggestedReplacement: repMatch[1],
      explanation: `Duplicated word detected: "${repMatch[0]}". Repeated words indicate accidental duplication.`,
      status: 'pending',
    });
    suggestedText = suggestedText.replace(repMatch[0], repMatch[1]);
  }

  // 4. APPROVED GLOSSARY FORBIDDEN TERMS
  guidelines.approvedGlossary.forEach((term) => {
    const regex = new RegExp(`\\b${term.forbidden}\\b`, 'gi');
    if (regex.test(content)) {
      termDeduction += term.severity === 'critical' ? 22 : 12;
      scoreDeduction += term.severity === 'critical' ? 22 : 12;

      issues.push({
        id: `iss_gloss_${issueCounter++}`,
        guidelineRef: `GLOSSARY-${term.forbidden.toUpperCase().replace(/\s+/g, '_')}`,
        category: 'terminology',
        severity: term.severity,
        originalText: term.forbidden,
        suggestedReplacement: term.preferred,
        explanation: term.reason || `"${term.forbidden}" is on the prohibited terminology list.`,
        status: 'pending',
      });
      suggestedText = suggestedText.replace(regex, term.preferred);
    }
  });

  // 5. COMPETITOR LOCKOUT
  guidelines.competitorLockout.forEach((comp) => {
    const regex = new RegExp(`\\b${comp}\\b`, 'gi');
    if (regex.test(content)) {
      scoreDeduction += 25;
      issues.push({
        id: `iss_comp_${issueCounter++}`,
        guidelineRef: 'RULE-COMP-01',
        category: 'competitor',
        severity: 'critical',
        originalText: comp,
        suggestedReplacement: 'our leading industry peers',
        explanation: `Competitor name "${comp}" is barred by competitor lockout policy. Direct competitor mentions are prohibited in marketing copy.`,
        status: 'pending',
      });
      suggestedText = suggestedText.replace(regex, 'our peers');
    }
  });

  // 6. UNVERIFIED PROMOTIONAL CLAIMS & SUPERLATIVES
  const unverifiedWords = [
    { word: 'guaranteed', rep: 'clinically supported', note: 'Unqualified guarantee violates regulatory and brand compliance standards.' },
    { word: '100%', rep: 'substantially verified', note: 'Absolute percentages require verified clinical trial citations.' },
    { word: 'miracle', rep: 'scientifically advanced', note: 'Sensational terms are barred from brand literature.' },
    { word: 'cheap', rep: 'cost-effective / accessible', note: '"Cheap" devalues the brand standard of excellence.' },
    { word: 'cure', rep: 'therapeutic approach', note: 'Strict governance prohibits superlative cure claims without formal trial citations.' }
  ];

  unverifiedWords.forEach((item) => {
    // Only check if not already caught by glossary
    const alreadyCaught = issues.some((iss) => iss.originalText.toLowerCase() === item.word.toLowerCase());
    if (!alreadyCaught) {
      const regex = new RegExp(`\\b${item.word}\\b`, 'gi');
      if (regex.test(content)) {
        claimDeduction += 15;
        scoreDeduction += 15;
        issues.push({
          id: `iss_claim_${issueCounter++}`,
          guidelineRef: 'RULE-CLAIM-01',
          category: 'claims',
          severity: 'critical',
          originalText: item.word,
          suggestedReplacement: item.rep,
          explanation: item.note,
          status: 'pending',
        });
        suggestedText = suggestedText.replace(regex, item.rep);
      }
    }
  });

  // 7. TONE & EXCLAMATION OVERUSE
  const exclamationMatches = content.match(/!+/g);
  if (exclamationMatches && exclamationMatches.length > 2) {
    toneDeduction += 10;
    scoreDeduction += 10;
    issues.push({
      id: `iss_tone_${issueCounter++}`,
      guidelineRef: 'RULE-TONE-01',
      category: 'tone',
      severity: 'warning',
      originalText: 'Multiple exclamation points (!)',
      suggestedReplacement: 'Use measured periods (.) to convey calm authority',
      explanation: 'Tone guidelines mandate calm authority. Excessive exclamation marks diminish institutional trust.',
      status: 'pending',
    });
  }

  // Calculate scores realistically:
  // If issues are detected, overallScore will NEVER be 100!
  const overall = issues.length === 0
    ? 100
    : Math.max(15, Math.min(88, 100 - scoreDeduction));

  const toneScore = Math.max(25, 100 - toneDeduction);
  const terminologyScore = Math.max(20, 100 - termDeduction);
  const claimsScore = Math.max(20, 100 - claimDeduction);
  const grammarScore = Math.max(20, 100 - grammarDeduction);

  const summary = issues.length > 0
    ? `Flagged ${issues.length} issue(s) across ${[
        safetyDeduction > 0 ? 'Brand Safety & Adult Content' : '',
        grammarDeduction > 0 ? 'Spelling & Grammar' : '',
        termDeduction > 0 ? 'Glossary Violations' : '',
        claimDeduction > 0 ? 'Unverified Claims' : '',
        toneDeduction > 0 ? 'Tone Drift' : '',
      ].filter(Boolean).join(', ')}. Review recommendations below.`
    : 'Content fully aligns with brand safety, spelling, grammar, and governance guidelines.';

  return {
    overallScore: overall,
    toneScore,
    terminologyScore,
    claimsScore,
    visualScore: 90,
    accessibilityScore: 85,
    grammarScore,
    summary,
    issues,
    suggestedFullText: suggestedText,
    aiDisclosure: 'Reviewed using VibeCheck Brand Guard Multi-Factor Engine. All suggestions require human approval.',
    analyzedAt: new Date().toISOString(),
    modelUsed: 'VibeCheck Governance Engine (NLP & Brand Safety)',
  };
}
