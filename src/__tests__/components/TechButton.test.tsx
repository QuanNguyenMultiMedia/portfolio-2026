import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import TechButton from "@/components/TechButton";

describe("TechButton", () => {
  it("renders children text", () => {
    render(<TechButton>CLICK_ME</TechButton>);
    expect(screen.getByText("CLICK_ME")).toBeInTheDocument();
  });

  it("renders as a <button> by default", () => {
    render(<TechButton>Click</TechButton>);
    const btn = screen.getByRole("button");
    expect(btn).toBeInTheDocument();
    expect(btn.tagName).toBe("BUTTON");
  });

  it("renders as an <a> tag when href is provided", () => {
    render(<TechButton href="/works">View</TechButton>);
    const link = screen.getByText("View").closest("a");
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/works");
  });

  it("applies primary variant styles by default", () => {
    render(<TechButton>Primary</TechButton>);
    const btn = screen.getByRole("button");
    expect(btn.className).toContain("border-primary");
  });

  it("applies ghost variant styles", () => {
    render(<TechButton variant="ghost">Ghost</TechButton>);
    const btn = screen.getByRole("button");
    expect(btn.className).toContain("border-transparent");
  });

  it("fires onClick handler", () => {
    let clicked = false;
    render(<TechButton onClick={() => { clicked = true; }}>Click</TechButton>);
    screen.getByRole("button").click();
    expect(clicked).toBe(true);
  });
});
