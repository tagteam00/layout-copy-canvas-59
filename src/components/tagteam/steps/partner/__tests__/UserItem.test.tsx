
import React from "react";
import { render } from "@testing-library/react";
import { screen } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import { UserItem } from "../UserItem";

describe("UserItem", () => {
  const mockUser = {
    id: "123",
    fullName: "John Doe",
    username: "johndoe",
  };

  const mockUserWithAvatar = {
    ...mockUser,
    avatarUrl: "https://example.com/avatar.jpg"
  };

  const mockOnSelectPartner = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

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

  it("calls onSelectPartner when Select button is clicked", async () => {
    const user = userEvent.setup();
    render(
      <UserItem 
        user={mockUser} 
        onSelectPartner={mockOnSelectPartner} 
        isAvailable={true} 
      />
    );
    
    await user.click(screen.getByText("Select"));
    
    expect(mockOnSelectPartner).toHaveBeenCalledWith("John Doe", "123");
  });

  it("renders avatar image when avatarUrl is provided", () => {
    render(
      <UserItem 
        user={mockUserWithAvatar} 
        onSelectPartner={mockOnSelectPartner} 
        isAvailable={true} 
      />
    );
    
    const avatarImg = screen.getByAltText("John Doe");
    expect(avatarImg).toBeInTheDocument();
    expect(avatarImg).toHaveAttribute("src", "https://example.com/avatar.jpg");
  });

});
