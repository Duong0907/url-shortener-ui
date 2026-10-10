import { render, screen } from "@testing-library/react";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

describe("Card", () => {
  it("renders every part with its data-slot", () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Title</CardTitle>
          <CardDescription>Desc</CardDescription>
          <CardAction>Act</CardAction>
        </CardHeader>
        <CardContent>Body</CardContent>
        <CardFooter>Foot</CardFooter>
      </Card>,
    );
    const slots: Record<string, string> = {
      Title: "card-title",
      Desc: "card-description",
      Act: "card-action",
      Body: "card-content",
      Foot: "card-footer",
    };
    for (const [text, slot] of Object.entries(slots)) {
      expect(screen.getByText(text)).toHaveAttribute("data-slot", slot);
    }
    expect(screen.getByText("Title").closest("[data-slot=card-header]")).toBeInTheDocument();
  });

  it("sets size and merges className", () => {
    render(
      <Card size="sm" className="extra" data-testid="c">
        x
      </Card>,
    );
    const card = screen.getByTestId("c");
    expect(card).toHaveAttribute("data-size", "sm");
    expect(card).toHaveClass("extra");
  });

  it("defaults size to default", () => {
    render(<Card data-testid="c">x</Card>);
    expect(screen.getByTestId("c")).toHaveAttribute("data-size", "default");
  });
});
