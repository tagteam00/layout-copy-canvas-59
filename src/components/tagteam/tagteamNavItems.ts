
export const tagteamNavItems = [
  {
    name: "Home",
    icon: "https://cdn.builder.io/api/v1/image/assets/579c825d05dd49c6a1b702d151caec64/c761f5256fcea0afdf72f5aa0ab3d05e40a3545b?placeholderIfAbsent=true",
    path: "/",
    isActive: (activeTab: string) => activeTab === "home",
  },
  {
    name: "Tagteam",
    icon: "https://cdn.builder.io/api/v1/image/assets/579c825d05dd49c6a1b702d151caec64/99b9d22862884f6e83475b74fa086fd10fb5e57f?placeholderIfAbsent=true",
    path: "/tagteam",
    isActive: (activeTab: string) => activeTab === "tagteam",
  },
  {
    name: "Profile",
    icon: "https://cdn.builder.io/api/v1/image/assets/579c825d05dd49c6a1b702d151caec64/6015a6ceb8f49982ed2ff6177f7ee6374f72c48d?placeholderIfAbsent=true",
    path: "/profile",
    isActive: (activeTab: string) => activeTab === "profile",
  },
];
