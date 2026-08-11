export type ProposalId =
	| "mejora-mi-barrio"
	| "cuaderno-matematico"
	| "encuentra-mi-mascota"
	| "nutrivision";

export type ProposalCriterionKey =
	| "calidad"
	| "productividad"
	| "innovacion"
	| "monetizacion"
	| "dificultadTecnica"
	| "iaFutura";

export type ProposalCriterion = {
	score: number;
	note: string;
};

export type Proposal = {
	id: ProposalId;
	name: string;
	shortName: string;
	category: string;
	eyebrow: string;
	summary: string;
	problem: string;
	beneficiaries: string[];
	primaryFunction: string;
	quality: string;
	productivity: string;
	innovation: string;
	monetization: string;
	prototypeLimits: string;
	futureDirection: string;
	technologies: string[];
	flow: string[];
	criteria: Record<ProposalCriterionKey, ProposalCriterion>;
	accent: "teal" | "cobalt" | "violet" | "amber";
	appUrlEnvVar: string;
};
