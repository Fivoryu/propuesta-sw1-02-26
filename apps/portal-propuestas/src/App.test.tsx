import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { ToastProvider } from "@propuestas/ui";
import App from "./App";

function renderPortal(initialEntry = "/") {
	return render(
		<MemoryRouter initialEntries={[initialEntry]}>
			<ToastProvider>
				<App />
			</ToastProvider>
		</MemoryRouter>,
	);
}

describe("Portal de Propuestas main flow", () => {
	it("renders all five cards and reaches each proposal detail and app entry action", async () => {
		const user = userEvent.setup();
		renderPortal();

		expect(screen.getAllByRole("link", { name: "Ver ficha" })).toHaveLength(5);

		for (const proposalName of [
			"Mejora Mi Barrio",
			"Cuaderno Matemático",
			"Encuentra Mi Mascota",
			"NutriVision",
			"SignBridge AI",
		]) {
			const detailLinks = screen.getAllByRole("link", { name: "Ver ficha" });
			const proposalIndex = [
				"Mejora Mi Barrio",
				"Cuaderno Matemático",
				"Encuentra Mi Mascota",
				"NutriVision",
				"SignBridge AI",
			].indexOf(proposalName);
			await user.click(detailLinks[proposalIndex]);

			expect(
				await screen.findByRole("heading", { name: proposalName }),
			).toBeInTheDocument();
			expect(
				screen.getByRole("link", { name: "Abrir prototipo" }),
			).toHaveAttribute("href", "/");

			await user.click(screen.getByRole("link", { name: "Volver al portal" }));
			expect(
				await screen.findByRole("heading", {
					name: /Propuestas que se pueden recorrer/,
				}),
			).toBeInTheDocument();
		}
	});
});
