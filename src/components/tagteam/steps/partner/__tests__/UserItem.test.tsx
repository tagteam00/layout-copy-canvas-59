
import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { UserItem } from "../UserItem";
import { useNavigate } from "react-router-dom";

// Mock the react-router-dom's useNavigate hook
jest.mock("react-router-dom", () => ({
  useNavigate: jest.fn()
}));

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
  const mockNavigate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
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

  it("navigates to user profile page when Profile button is clicked", async () => {
    const user = userEvent.setup();
    render(
      <UserItem 
        user={mockUser} 
        onSelectPartner={mockOnSelectPartner} 
        isAvailable={true} 
      />
    );
    
    await user.click(screen.getByText("Profile"));
    
    expect(mockNavigate).toHaveBeenCalledWith("/user/123");
  });
});
