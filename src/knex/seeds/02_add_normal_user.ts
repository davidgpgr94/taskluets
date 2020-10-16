import * as Knex from "knex";
import { User } from '../../app/models/user';
import { UserRepository } from '../../app/models/repositories/user-repository';

export async function seed(knex: Knex): Promise<void> {

  const repository: UserRepository = new UserRepository();

  // Inserts seed entries
  let user01: User = new User({
    login: 'user001',
    email: 'user001@example.com',
    rawPassword: '12345',
    active: true
  });
  await repository.save(user01);
};
