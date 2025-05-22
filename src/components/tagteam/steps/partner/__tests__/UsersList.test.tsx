
import React from "react";
import { render, screen } from "@testing-library/react";
import { UsersList } from "../UsersList";

// Mock the UserItem component
jest.mock("../UserItem", () => ({
  UserItem: ({ user }: { user: any }) => (
    <div data-testid="user-item">{user.fullName}</div>
  ),
}));

describe("UsersList", () => {
  const mockUsers = [
    { id: "1", fullName: "User One", username: "user1" },
    { id: "2", fullName: "User Two", username: "user2" },
  ];

  const mockOnSelectPartner = jest.fn();

  it("renders the title when users exist", () => {
    render(
      <UsersList
        users={mockUsers}
        onSelectPartner={mockOnSelectPartner}
        isAvailable={true}
        title="Available users"
      />
    );
    
    expect(screen.getByText("Available users")).toBeInTheDocument();
  });

  it("renders nothing when users array is empty", () => {
    const { container } = render(
      <UsersList
        users={[]}
        onSelectPartner={mockOnSelectPartner}
        isAvailable={true}
        title="Available users"
      />
    );
    
    expect(container.firstChild).toBeNull();
  });

  it("renders UserItem for each user", () => {
    render(
      <UsersList
        users={mockUsers}
        onSelectPartner={mockOnSelectPartner}
        isAvailable={true}
        title="Available users"
      />
    );
    
    const userItems = screen.getAllByTestId("user-item");
    expect(userItems.length).toBe(2);
    expect(userItems[0]).toHaveTextContent("User One");
    expect(userItems[1]).toHaveTextContent("User Two");
  });
});
