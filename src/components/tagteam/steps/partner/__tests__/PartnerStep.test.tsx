
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { PartnerStep } from "../../PartnerStep";
import { usePartnerSearch } from "../usePartnerSearch";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

// Mock dependencies
jest.mock("../usePartnerSearch", () => ({
  usePartnerSearch: jest.fn(),
}));

jest.mock("@/contexts/AuthContext", () => ({
  useAuth: jest.fn(),
}));

jest.mock("sonner", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

// Mock child components
jest.mock("../PartnerSearch", () => ({
  PartnerSearch: ({ onSearch }: { onSearch: (query: string) => void }) => (
    <div data-testid="partner-search">
      <button onClick={() => onSearch("test")}>Search</button>
    </div>
  ),
}));

jest.mock("../NoAvailablePartnersAlert", () => ({
  NoAvailablePartnersAlert: () => <div data-testid="no-partners-alert" />,
}));

jest.mock("../UsersList", () => ({
  UsersList: ({ 
    users, 
    onSelectPartner,
    isAvailable 
  }: { 
    users: any[], 
    onSelectPartner?: (name: string, id: string) => void,
    isAvailable: boolean 
  }) => (
    <div data-testid={isAvailable ? "available-users" : "unavailable-users"}>
      {users.map((user) => (
        <div key={user.id} data-testid="user-item">
          {onSelectPartner && (
            <button onClick={() => onSelectPartner(user.fullName, user.id)}>
              Select {user.fullName}
            </button>
          )}
        </div>
      ))}
    </div>
  ),
}));

jest.mock("../EmptySearchState", () => ({
  EmptySearchState: () => <div data-testid="empty-search" />,
}));

jest.mock("../LoadingState", () => ({
  LoadingState: () => <div data-testid="loading-state" />,
}));

describe("PartnerStep", () => {
  const mockSelectedCategory = "Fitness";
  const mockOnSelectPartner = jest.fn();
  const mockOnSelectPartnerId = jest.fn();
  const mockCurrentUserId = "current-user-id";
  
  const mockAvailableUsers = [
    { id: "user1", fullName: "User One", username: "user1" },
    { id: "user2", fullName: "User Two", username: "user2" },
  ];

  const mockUnavailableUsers = [
    { id: "user3", fullName: "User Three", username: "user3", hasActiveTeam: true },
  ];

  const mockHandleSearch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock useAuth
    (useAuth as jest.Mock).mockReturnValue({
      user: { id: mockCurrentUserId },
    });

    // Mock usePartnerSearch
    (usePartnerSearch as jest.Mock).mockReturnValue({
      searchQuery: "",
      availableUsers: mockAvailableUsers,
      unavailableUsers: mockUnavailableUsers,
      loading: false,
      handleSearch: mockHandleSearch,
      searchResults: [...mockAvailableUsers, ...mockUnavailableUsers],
    });
  });

  it("renders the partner search component", () => {
    render(
      <PartnerStep
        selectedCategory={mockSelectedCategory}
        onSelectPartner={mockOnSelectPartner}
        onSelectPartnerId={mockOnSelectPartnerId}
      />
    );
    
    expect(screen.getByTestId("partner-search")).toBeInTheDocument();
  });

  it("renders available and unavailable users lists", () => {
    render(
      <PartnerStep
        selectedCategory={mockSelectedCategory}
        onSelectPartner={mockOnSelectPartner}
        onSelectPartnerId={mockOnSelectPartnerId}
      />
    );
    
    expect(screen.getByTestId("available-users")).toBeInTheDocument();
    expect(screen.getByTestId("unavailable-users")).toBeInTheDocument();
  });

  it("shows loading state when loading", () => {
    (usePartnerSearch as jest.Mock).mockReturnValue({
      searchQuery: "",
      availableUsers: [],
      unavailableUsers: [],
      loading: true,
      handleSearch: mockHandleSearch,
      searchResults: [],
    });

    render(
      <PartnerStep
        selectedCategory={mockSelectedCategory}
        onSelectPartner={mockOnSelectPartner}
        onSelectPartnerId={mockOnSelectPartnerId}
      />
    );
    
    expect(screen.getByTestId("loading-state")).toBeInTheDocument();
  });

  it("shows NoAvailablePartnersAlert when no available users", () => {
    (usePartnerSearch as jest.Mock).mockReturnValue({
      searchQuery: "",
      availableUsers: [],
      unavailableUsers: mockUnavailableUsers,
      loading: false,
      handleSearch: mockHandleSearch,
      searchResults: mockUnavailableUsers,
    });

    render(
      <PartnerStep
        selectedCategory={mockSelectedCategory}
        onSelectPartner={mockOnSelectPartner}
        onSelectPartnerId={mockOnSelectPartnerId}
      />
    );
    
    expect(screen.getByTestId("no-partners-alert")).toBeInTheDocument();
  });

  it("shows EmptySearchState when no results at all", () => {
    (usePartnerSearch as jest.Mock).mockReturnValue({
      searchQuery: "nonexistent",
      availableUsers: [],
      unavailableUsers: [],
      loading: false,
      handleSearch: mockHandleSearch,
      searchResults: [],
    });

    render(
      <PartnerStep
        selectedCategory={mockSelectedCategory}
        onSelectPartner={mockOnSelectPartner}
        onSelectPartnerId={mockOnSelectPartnerId}
      />
    );
    
    expect(screen.getByTestId("empty-search")).toBeInTheDocument();
  });

  it("calls handleSearch when search is triggered", () => {
    render(
      <PartnerStep
        selectedCategory={mockSelectedCategory}
        onSelectPartner={mockOnSelectPartner}
        onSelectPartnerId={mockOnSelectPartnerId}
      />
    );
    
    fireEvent.click(screen.getByText("Search"));
    
    expect(mockHandleSearch).toHaveBeenCalledWith("test");
  });

  it("calls onSelectPartner and onSelectPartnerId when a partner is selected", () => {
    render(
      <PartnerStep
        selectedCategory={mockSelectedCategory}
        onSelectPartner={mockOnSelectPartner}
        onSelectPartnerId={mockOnSelectPartnerId}
      />
    );
    
    fireEvent.click(screen.getByText("Select User One"));
    
    expect(mockOnSelectPartner).toHaveBeenCalledWith("User One");
    expect(mockOnSelectPartnerId).toHaveBeenCalledWith("user1");
    expect(toast.success).toHaveBeenCalledWith("Selected User One as your TagTeam partner");
  });

  it("shows error toast when trying to select self as partner", () => {
    // Mock a user that has the same ID as the current user
    const mockUsersWithSelf = [
      { id: mockCurrentUserId, fullName: "Current User", username: "currentuser" },
      ...mockAvailableUsers,
    ];

    (usePartnerSearch as jest.Mock).mockReturnValue({
      searchQuery: "",
      availableUsers: mockUsersWithSelf,
      unavailableUsers: mockUnavailableUsers,
      loading: false,
      handleSearch: mockHandleSearch,
      searchResults: [...mockUsersWithSelf, ...mockUnavailableUsers],
    });

    render(
      <PartnerStep
        selectedCategory={mockSelectedCategory}
        onSelectPartner={mockOnSelectPartner}
        onSelectPartnerId={mockOnSelectPartnerId}
      />
    );
    
    fireEvent.click(screen.getByText("Select Current User"));
    
    expect(toast.error).toHaveBeenCalledWith("You cannot select yourself as a partner");
    expect(mockOnSelectPartner).not.toHaveBeenCalled();
    expect(mockOnSelectPartnerId).not.toHaveBeenCalled();
  });
});
