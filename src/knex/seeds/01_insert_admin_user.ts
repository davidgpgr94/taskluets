import * as Knex from "knex";
import { User } from '../../app/models/user';
import { UserRepository } from '../../app/models/repositories/user-repository';

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex("user").del();

  const repository: UserRepository = new UserRepository();

  // Inserts seed entries
  let admin01: User = new User('admin01', 'admin01@example.com', '12345', true);

  await repository.save(admin01);
};
