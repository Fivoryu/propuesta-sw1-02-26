import { detectedFoods, type Food, type Macros } from "../../domain/nutrition";

export type MockStatus =
	| "success"
	| "low_confidence"
	| "duplicate"
	| "no_match"
	| "error";

export type FoodAnalysisOptions = {
	scenarioId?: string;
	latencyMs?: number;
	signal?: AbortSignal;
};

export type FoodAnalysis = Macros & { foods: Food[]; disclaimer: "simulated" };

type FoodAnalysisMeta = {
	scenarioId: string;
	latencyMs: number;
	disclaimer: "simulated";
};

export type FoodAnalysisSuccess = FoodAnalysis &
	FoodAnalysisMeta & {
		status: Exclude<MockStatus, "error">;
	};

export type FoodAnalysisError = FoodAnalysisMeta & {
	status: "error";
	error: { code: "MOCK_ANALYSIS_UNAVAILABLE"; message: string };
};

export type FoodAnalysisResult = FoodAnalysisSuccess | FoodAnalysisError;

const DEFAULT_SCENARIO = "food-success-high";
const statusByScenario: Record<string, Exclude<MockStatus, "error">> = {
	"food-success-high": "success",
	"food-low-confidence": "low_confidence",
	"food-duplicate": "duplicate",
	"food-no-match": "no_match",
};

function createAbortError(): DOMException {
	return new DOMException("La solicitud fue cancelada.", "AbortError");
}

function waitForLatency(
	latencyMs: number,
	signal?: AbortSignal,
): Promise<void> {
	if (signal?.aborted) return Promise.reject(createAbortError());

	return new Promise((resolve, reject) => {
		let timer: ReturnType<typeof setTimeout>;
		const cancel = () => {
			clearTimeout(timer);
			signal?.removeEventListener("abort", cancel);
			reject(createAbortError());
		};
		const finish = () => {
			signal?.removeEventListener("abort", cancel);
			resolve();
		};
		timer = setTimeout(finish, latencyMs);
		signal?.addEventListener("abort", cancel, { once: true });
	});
}

function chooseLatency(latencyMs?: number): number {
	return typeof latencyMs === "number" ? Math.max(0, latencyMs) : 2800;
}

export async function analyzeFoodMock(
	_image?: string,
	options: FoodAnalysisOptions = {},
): Promise<FoodAnalysisResult> {
	const scenarioId = options.scenarioId ?? DEFAULT_SCENARIO;
	const latencyMs = chooseLatency(options.latencyMs);
	await waitForLatency(latencyMs, options.signal);
	if (options.signal?.aborted) throw createAbortError();

	const status = statusByScenario[scenarioId];
	if (!status) {
		const meta = {
			scenarioId,
			status: "error" as const,
			latencyMs,
			disclaimer: "simulated" as const,
		};
		return {
			...meta,
			error: {
				code: "MOCK_ANALYSIS_UNAVAILABLE",
				message:
					"No pudimos analizar la comida. Tu imagen sigue en la demostración.",
			},
		};
	}

	const meta = {
		scenarioId,
		status,
		latencyMs,
		disclaimer: "simulated" as const,
	};
	return {
		...meta,
		calories: 610,
		protein: 52,
		carbs: 66,
		fats: 16,
		foods: structuredClone(detectedFoods),
	};
}
