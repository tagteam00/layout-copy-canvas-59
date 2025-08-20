
import { renderHook, act } from "@testing-library/react";
import { usePartnerSearch } from "../usePartnerSearch";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

// Mock dependencies
jest.mock("@/integrations/supabase/client", () => ({
  supabase: {
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    contains: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    is: jest.fn().mockReturnThis(),
  },
}));

jest.mock("@/contexts/AuthContext", () => ({
  useAuth: jest.fn(),
}));

jest.mock("sonner", () => ({
  toast: {
    error: jest.fn(),
  },
}));

describe("usePartnerSearch", () => {
  const mockCurrentUserId = "current-user-id";
  const mockProfiles = [
    { 
      id: "user1", 
      full_name: "User One", 
      username: "user1",
      interests: ["Fitness"] 
    },
    { 
      id: "user2", 
      full_name: "User Two", 
      username: "user2",
      interests: ["Fitness"] 
    },
  ];

  const mockTeamsResponse = {
    data: [],
    error: null,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock useAuth
    (useAuth as jest.Mock).mockReturnValue({
      user: { id: mockCurrentUserId },
    });

    // Mock Supabase responses
    (supabase.from as jest.Mock).mockImplementation((table) => {
      if (table === "profiles") {
        return {
          select: jest.fn().mockReturnThis(),
          contains: jest.fn().mockReturnValue({
            data: mockProfiles,
            error: null,
          }),
        };
      } else if (table === "teams") {
        return {
          select: jest.fn().mockReturnThis(),
          contains: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          is: jest.fn().mockReturnValue(mockTeamsResponse),
        };
      }
      return {
        select: jest.fn().mockReturnThis(),
      };
    });
  });

  it("initializes with empty search query and results", () => {
    const { result } = renderHook(() => usePartnerSearch("Fitness"));
    
    expect(result.current.searchQuery).toBe("");
    expect(result.current.availableUsers).toEqual([]);
    expect(result.current.unavailableUsers).toEqual([]);
    expect(result.current.loading).toBe(false);
  });

  it("fetches users when selectedCategory changes", async () => {
    const { result, rerender } = renderHook(
      (props) => usePartnerSearch(props.selectedCategory), 
      { initialProps: { selectedCategory: "Fitness" } }
    );
    
    // Wait for the effect to run
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });
    
    // Re-render with a different category
    rerender({ selectedCategory: "Cooking" });
    
    // Wait for the effect to run again
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });
    
    // Verify that supabase.from was called twice (once for each category)
    expect(supabase.from).toHaveBeenCalledTimes(4); // 2 calls for profiles, 2 for teams
  });

  // Additional tests would be needed for the handleSearch function,
  // filtering logic, and error handling
});
