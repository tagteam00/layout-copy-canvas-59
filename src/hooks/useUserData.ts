
export interface UserData {
  fullName: string;
  username: string;
  dateOfBirth: string;
  gender: string;
  interests: string[];
  commitmentLevel: string;
}

export const useUserData = () => {
  const saveUserData = (data: UserData) => {
    localStorage.setItem('userData', JSON.stringify(data));
    // Also add to users list
    const users = getAllUsers();
    if (!users.find(user => user.username === data.username)) {
      users.push(data);
      localStorage.setItem('usersData', JSON.stringify(users));
    }
  };

  const getUserData = (): UserData | null => {
    const data = localStorage.getItem('userData');
    return data ? JSON.parse(data) : null;
  };

  const getAllUsers = (): UserData[] => {
    const data = localStorage.getItem('usersData');
    return data ? JSON.parse(data) : [];
  };

  return { saveUserData, getUserData, getAllUsers };
};
