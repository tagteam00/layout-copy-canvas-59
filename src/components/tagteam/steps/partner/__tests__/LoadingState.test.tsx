
import React from "react";
import { render, screen } from "@testing-library/react";
import { LoadingState } from "../LoadingState";

describe("LoadingState", () => {
  it("renders the loading skeleton elements", () => {
    render(<LoadingState />);
    
    // Check that we have 3 skeleton elements
    const skeletonElements = document.querySelectorAll(".animate-pulse .bg-gray-100");
    expect(skeletonElements.length).toBe(3);
  });
});
