import * as Knex from "knex";
import { User } from '../../app/models/user';
import { UserRepository } from '../../app/models/repositories/user-repository';

export async function seed(knex: Knex): Promise<void> {

  const repository: UserRepository = new UserRepository();

  // Inserts seed entries
  let user01: User = new User('user001', 'user001@example.com', '12345', true);
  await repository.save(user01);
};
