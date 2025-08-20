
import React from "react";
import { render } from "@testing-library/react";
import { screen } from "@testing-library/dom";
import { NoAvailablePartnersAlert } from "../NoAvailablePartnersAlert";

describe("NoAvailablePartnersAlert", () => {
  it("renders the alert with the correct title", () => {
    render(<NoAvailablePartnersAlert selectedCategory="Fitness" />);
    
    expect(screen.getByText("No available partners")).toBeInTheDocument();
  });

  it("includes the selected category in the description", () => {
    render(<NoAvailablePartnersAlert selectedCategory="Fitness" />);
    
    expect(screen.getByText(/No users interested in Fitness are available/)).toBeInTheDocument();
  });
});
