import * as Knex from "knex";
import { User } from '../../app/models/user';

export async function seed(knex: Knex): Promise<void> {

    // Inserts seed entries
    let user01: User = new User('user001', 'user001@example.com', '12345', true);
    await user01.save();
};
