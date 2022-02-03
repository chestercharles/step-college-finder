import { v4 } from "uuid";
import bcrypt from "bcryptjs";

type UserId = string;

export type User = {
  id: UserId;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
};

export type UserRepo = {
  add: (user: User) => Promise<User>;
  update: (user: User) => Promise<User>;
  find: (params: { id?: string; email?: string }) => Promise<User[]>;
};

type RegisterUser = (
  userRepo: UserRepo
) => (params: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}) => Promise<UserId>;

export const RegisterUser: RegisterUser = (userRepo) => {
  async function hashPassword(password: string) {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  }

  return async (params) => {
    const hashedPassword = await hashPassword(params.password);
    const user = {
      id: v4(),
      email: params.email,
      password: hashedPassword,
      firstName: params.firstName,
      lastName: params.lastName,
    };
    await userRepo.add(user);
    return user.id;
  };
};

type AuthenticateUser = (
  userRepo: UserRepo
) => (params: { email: string; password: string }) => Promise<UserId | null>;

export const AuthenticateUser: AuthenticateUser = (userRepo) => {
  async function comparePassword(password: string, hashedPassword: string) {
    return await bcrypt.compare(password, hashedPassword);
  }

  return async (params) => {
    const [user] = await userRepo.find({ email: params.email });
    if (!user) {
      return null;
    }
    const isPasswordValid = await comparePassword(
      params.password,
      user.password
    );
    if (!isPasswordValid) {
      return null;
    }
    return user.id;
  };
};

type GetUser = (userRepo: UserRepo) => (userId: UserId) => Promise<{
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}>;

export const GetUser: GetUser = (userRepo) => async (userId) => {
  const [user] = await userRepo.find({ id: userId });
  if (!user) {
    throw new Error("User not found");
  }
  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
  };
};
