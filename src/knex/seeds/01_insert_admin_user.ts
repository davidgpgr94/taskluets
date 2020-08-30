import * as Knex from "knex";
import { User } from '../../app/models/user';

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await knex("user").del();

    // Inserts seed entries
    let admin01: User = new User('admin01', 'admin01@example.com', '12345', true);
    await admin01.save();
};
