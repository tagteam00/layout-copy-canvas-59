
import React from "react";
import { render } from "@testing-library/react";
import { screen } from "@testing-library/dom";
import { EmptySearchState } from "../EmptySearchState";

describe("EmptySearchState", () => {
  it("displays the correct message with the selected category", () => {
    render(<EmptySearchState selectedCategory="Fitness" />);
    
    expect(screen.getByText("No users found with interest in Fitness")).toBeInTheDocument();
  });
});
