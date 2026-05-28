import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import Portal from "@/components/Portal";

describe("Portal", () => {
  afterEach(() => {
    cleanup();
    document.body.innerHTML = "";
  });

  it("returns null during SSR (mounted=false)", () => {
    const { container } = render(
      <div id="parent">
        <Portal>Content</Portal>
      </div>
    );
    expect(container.querySelector("#parent")?.textContent).toBe("");
  });

  it("renders children in document.body after mount", async () => {
    render(<Portal>PortalContent</Portal>);

    const el = await screen.findByText("PortalContent");
    expect(el).toBeInTheDocument();
    expect(document.body.contains(el)).toBe(true);
  });

  it("renders multiple children correctly", async () => {
    render(
      <Portal>
        <span data-testid="child1">A</span>
        <span data-testid="child2">B</span>
      </Portal>
    );

    expect(await screen.findByTestId("child1")).toBeInTheDocument();
    expect(await screen.findByTestId("child2")).toBeInTheDocument();
  });

  it("does not render in parent container", async () => {
    const { container } = render(
      <div id="wrapper">
        <Portal>Outside</Portal>
      </div>
    );

    const el = await screen.findByText("Outside");
    expect(el).toBeInTheDocument();
    expect(container.querySelector("#wrapper")?.textContent).not.toContain("Outside");
  });
});
