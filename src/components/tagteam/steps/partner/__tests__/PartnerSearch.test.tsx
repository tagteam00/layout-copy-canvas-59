
import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PartnerSearch } from "../PartnerSearch";

describe("PartnerSearch", () => {
  const mockOnSearch = jest.fn();
  const defaultProps = {
    searchQuery: "",
    onSearch: mockOnSearch,
    selectedCategory: "Fitness"
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the search input with correct placeholder", () => {
    render(<PartnerSearch {...defaultProps} />);
    
    expect(screen.getByPlaceholderText("Search by name or username")).toBeInTheDocument();
  });

  it("displays the selected category", () => {
    render(<PartnerSearch {...defaultProps} />);
    
    expect(screen.getByText("Fitness")).toBeInTheDocument();
  });

  it("calls onSearch when typing in the search input", async () => {
    const user = userEvent.setup();
    render(<PartnerSearch {...defaultProps} />);
    
    const searchInput = screen.getByPlaceholderText("Search by name or username");
    await user.type(searchInput, "test");
    
    expect(mockOnSearch).toHaveBeenCalledWith("test");
  });
});
