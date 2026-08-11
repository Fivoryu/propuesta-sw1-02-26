import { describe, expect, it } from "vitest";
import { analyzeFoodMock } from "./analyze-food";

const scenarios = [
	{ scenarioId: "food-success-high", status: "success" },
	{ scenarioId: "food-low-confidence", status: "low_confidence" },
	{ scenarioId: "food-duplicate", status: "duplicate" },
	{ scenarioId: "food-no-match", status: "no_match" },
	{ scenarioId: "food-error", status: "error" },
] as const;

describe("analyzeFoodMock", () => {
	it.each(
		scenarios,
	)("returns the deterministic $scenarioId payload with the requested status", async ({
		scenarioId,
		status,
	}) => {
		const first = await analyzeFoodMock(undefined, {
			scenarioId,
			latencyMs: 0,
		});
		const second = await analyzeFoodMock(undefined, {
			scenarioId,
			latencyMs: 0,
		});

		expect(first).toEqual(second);
		expect(first).toMatchObject({
			scenarioId,
			status,
			latencyMs: 0,
			disclaimer: "simulated",
		});
		if (status === "error") {
			expect(first).toMatchObject({
				error: { code: "MOCK_ANALYSIS_UNAVAILABLE" },
			});
		} else if ("foods" in first) {
			expect(first).toMatchObject({
				calories: 610,
				protein: 52,
				carbs: 66,
				fats: 16,
			});
			expect(first.foods).toHaveLength(4);
			expect(first.foods.map((food) => food.name)).toContain(
				"Pechuga de pollo",
			);
		}
	});

	it("returns cloned food data and supports cancellation", async () => {
		const first = await analyzeFoodMock(undefined, {
			scenarioId: "food-success-high",
			latencyMs: 0,
		});
		const second = await analyzeFoodMock(undefined, {
			scenarioId: "food-success-high",
			latencyMs: 0,
		});

		if ("foods" in first && "foods" in second) {
			first.foods[0].grams = 999;
			expect(second.foods[0].grams).toBe(175);
		}

		const controller = new AbortController();
		const pending = analyzeFoodMock(undefined, {
			scenarioId: "food-success-high",
			latencyMs: 10,
			signal: controller.signal,
		});
		controller.abort();
		await expect(pending).rejects.toMatchObject({ name: "AbortError" });
	});

	it("returns a safe error result for an unknown scenario", async () => {
		const result = await analyzeFoodMock(undefined, {
			scenarioId: "food-unknown",
			latencyMs: 0,
		});

		expect(result).toMatchObject({
			scenarioId: "food-unknown",
			status: "error",
			latencyMs: 0,
			disclaimer: "simulated",
			error: {
				code: "MOCK_ANALYSIS_UNAVAILABLE",
				message:
					"No pudimos analizar la comida. Tu imagen sigue en la demostración.",
			},
		});
	});
});
