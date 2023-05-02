export type User = {
  id: string;
  name: string;
  email: string;
  profileImagePath: string | null;
  isVerified: boolean;
  gender: string;
  birthDate: Date;
  createdAt: Date;
  updatedAt: Date | null;
};
