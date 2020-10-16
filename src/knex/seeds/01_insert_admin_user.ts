import * as Knex from "knex";
import { User } from '../../app/models/user';
import { UserRepository } from '../../app/models/repositories/user-repository';

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex("user").del();

  const repository: UserRepository = new UserRepository();

  // Inserts seed entries
  let admin01: User = new User({
    login: 'admin01',
    email: 'admin01@example.com',
    rawPassword: '12345',
    active: true
  });

  await repository.save(admin01);
};
