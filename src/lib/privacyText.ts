import type { PrivateTextRisk, PrivateTextRiskKind } from "./types";

export const PRIVACY_REVIEW_COPY =
  "Privacy review is an automated screen for common contact, classroom, location, access-code, grade, and face/photo details; it is not a complete guarantee.";

const privateTextPatterns: Array<{
  kind: PrivateTextRiskKind;
  label: string;
  detail: string;
  pattern: RegExp;
}> = [
  {
    kind: "contact",
    label: "Contact detail",
    detail: "Email, phone, or direct contact-like text detected.",
    pattern: /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}|\b(?:\+?1[-.\s]?)?(?:\(?\d{3}\)?[-.\s]?)\d{3}[-.\s]?\d{4}\b/i
  },
  {
    kind: "student_or_class_id",
    label: "Student or class ID",
    detail: "Student, class, roster, or ID-number wording detected.",
    pattern: /\b(?:student|class|roster|school)\s*(?:id|number|#)\s*[:#-]?\s*[a-z0-9-]{3,}\b/i
  },
  {
    kind: "grade_or_class_period",
    label: "Grade or class period",
    detail: "Grade level or class-period wording detected.",
    pattern: /\b(?:grade\s*(?:[1-9]|1[0-2])|(?:period|per\.?)\s*[1-9])\b/i
  },
  {
    kind: "address",
    label: "Address",
    detail: "Street-address-like text detected.",
    pattern: /\b\d{1,6}\s+[A-Za-z0-9.'-]+(?:\s+[A-Za-z0-9.'-]+){0,5}\s+(?:street|st\.?|avenue|ave\.?|road|rd\.?|drive|dr\.?|lane|ln\.?|boulevard|blvd\.?|court|ct\.?|way)\b/i
  },
  {
    kind: "access_code",
    label: "Access code",
    detail: "Access-code, join-code, password, or PIN wording detected.",
    pattern: /\b(?:access|join|invite|classroom|canvas|lms|password|passcode|pin)\s*(?:code|key|pin|password)?\s*[:#-]?\s*[A-Z0-9-]{4,}\b/i
  },
  {
    kind: "coordinates",
    label: "Coordinates",
    detail: "Latitude/longitude-like coordinates detected.",
    pattern: /\b-?(?:[1-8]?\d(?:\.\d+)?|90(?:\.0+)?)\s*,\s*-?(?:(?:1[0-7]\d|[1-9]?\d)(?:\.\d+)?|180(?:\.0+)?)\b/
  },
  {
    kind: "photo_or_face",
    label: "Photo or face reference",
    detail: "Photo, face, selfie, or image-of-student wording detected.",
    pattern: /\b(?:face|faces|photo|photos|selfie|headshot|student image|picture of)\b/i
  }
];

export function scanPrivateText(value: string): { safe: boolean; reasons: PrivateTextRisk[] } {
  const reasons = privateTextPatterns
    .filter((risk) => risk.pattern.test(value))
    .map(({ kind, label, detail }) => ({ kind, label, detail }));

  return {
    safe: reasons.length === 0,
    reasons
  };
}
