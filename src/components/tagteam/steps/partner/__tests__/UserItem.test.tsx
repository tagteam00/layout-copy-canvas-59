
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { UserItem } from "../UserItem";

describe("UserItem", () => {
  const mockUser = {
    id: "123",
    fullName: "John Doe",
    username: "johndoe",
  };

  const mockOnSelectPartner = jest.fn();

  it("renders user information correctly", () => {
    render(
      <UserItem 
        user={mockUser} 
        onSelectPartner={mockOnSelectPartner} 
        isAvailable={true} 
      />
    );
    
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("@johndoe")).toBeInTheDocument();
  });

  it("shows Select button for available users", () => {
    render(
      <UserItem 
        user={mockUser} 
        onSelectPartner={mockOnSelectPartner} 
        isAvailable={true} 
      />
    );
    
    expect(screen.getByText("Select")).toBeInTheDocument();
  });

  it("shows 'Has active team' for unavailable users", () => {
    render(
      <UserItem 
        user={mockUser} 
        isAvailable={false} 
      />
    );
    
    expect(screen.getByText("Has active team")).toBeInTheDocument();
    expect(screen.queryByText("Select")).not.toBeInTheDocument();
  });

  it("calls onSelectPartner when Select button is clicked", () => {
    render(
      <UserItem 
        user={mockUser} 
        onSelectPartner={mockOnSelectPartner} 
        isAvailable={true} 
      />
    );
    
    fireEvent.click(screen.getByText("Select"));
    
    expect(mockOnSelectPartner).toHaveBeenCalledWith("John Doe", "123");
  });
});
