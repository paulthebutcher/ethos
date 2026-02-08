// Shared proposal store for Launchpad
// In production, this will be backed by Supabase

export interface Proposal {
  slug: string;
  name: string;
  tagline: string;
  color: string;
  icon: string;
  landing: {
    headline: string;
    problem: string;
    solution: string;
    features: Array<{
      icon: string;
      title: string;
      description: string;
    }>;
    cta: string;
  };
  infrastructure: {
    auth: boolean;
    feedback: boolean;
    onboarding: boolean;
    payments: boolean;
    analytics: boolean;
  };
  meta: {
    title: string;
    description: string;
  };
}

export interface StoredProposal {
  id: string;
  idea: string;
  proposal: Proposal;
  createdAt: string;
  status: "draft" | "building" | "complete" | "failed";
}

// In-memory store (will be replaced with Supabase)
const proposals = new Map<string, StoredProposal>();

export function getProposal(id: string): StoredProposal | undefined {
  return proposals.get(id);
}

export function setProposal(id: string, proposal: StoredProposal): void {
  proposals.set(id, proposal);
}

export function hasProposal(id: string): boolean {
  return proposals.has(id);
}
