import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import PageWrapper from "@/components/PageWrapper";

describe("PageWrapper", () => {
  it("renders children content", () => {
    render(<PageWrapper><h1>Hello</h1></PageWrapper>);
    expect(screen.getByText("Hello")).toBeInTheDocument();
  });

  it("applies default variant with min-h-screen", () => {
    const { container } = render(<PageWrapper>Content</PageWrapper>);
    const main = container.querySelector("main");
    expect(main).toBeInTheDocument();
    expect(main!.className).toContain("min-h-screen");
  });

  it("applies hero variant with h-screen", () => {
    const { container } = render(<PageWrapper variant="hero">Hero</PageWrapper>);
    const main = container.querySelector("main");
    expect(main!.className).toContain("h-screen");
    expect(main!.className).toContain("overflow-hidden");
  });

  it("applies full variant with no horizontal padding", () => {
    const { container } = render(<PageWrapper variant="full">Full</PageWrapper>);
    const inner = container.querySelector("main > div");
    expect(inner!.className).toContain("px-0");
  });

  it("applies story variant with zero padding", () => {
    const { container } = render(<PageWrapper variant="story">Story</PageWrapper>);
    const inner = container.querySelector("main > div");
    expect(inner!.className).toContain("p-0");
  });

  it("passes additional className prop", () => {
    const { container } = render(<PageWrapper className="custom-class">X</PageWrapper>);
    const main = container.querySelector("main");
    expect(main!.className).toContain("custom-class");
  });
});
