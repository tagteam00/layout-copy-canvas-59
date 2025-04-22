
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
  };

  const getUserData = (): UserData | null => {
    const data = localStorage.getItem('userData');
    return data ? JSON.parse(data) : null;
  };

  return { saveUserData, getUserData };
};
