import { Knex } from "knex";
import { UserRepo, User } from "~/modules/user";

export default function UserRepo(client: Knex): UserRepo {
  return {
    add: async (user: User) => {
      await client
        .insert({
          first_name: user.firstName,
          last_name: user.lastName,
          id: user.id,
          email: user.email,
          password: user.password,
        })
        .into("users");
      return user;
    },
    update: async (user: User) => {
      await client.update(user).into("users").where("id", user.id);
      return user;
    },
    find: async (params: { email?: string; id?: string }) => {
      const users = await client.select("*").from("users").where(params);
      return users.map((user) => ({
        id: user.id,
        email: user.email,
        password: user.password,
        firstName: user.first_name,
        lastName: user.last_name,
      }));
    },
  };
}
