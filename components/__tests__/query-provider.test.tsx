import { useQueryClient } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";

import { QueryProvider } from "@/components/query-provider";

function Probe() {
  const client = useQueryClient();

  return <p>{client.getDefaultOptions().queries?.retry === 1 ? "retry 1" : "other"}</p>;
}

describe("QueryProvider", () => {
  it("gives its children a query client that retries queries once", () => {
    render(
      <QueryProvider>
        <Probe />
      </QueryProvider>,
    );
    expect(screen.getByText("retry 1")).toBeInTheDocument();
  });
});
