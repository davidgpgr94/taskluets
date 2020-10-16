import * as Knex from "knex";
import { Task, User } from '../../app/models';
import { UserRepository, TaskRepository } from '../../app/models/repositories';

export async function seed(knex: Knex): Promise<void> {

  const userRepository: UserRepository = new UserRepository();
  const taskRepository: TaskRepository = new TaskRepository();

  let task1: Task = new Task({
    title: 'First task',
    description: 'The initial task to setup all stuff'
  });
  const user: User|undefined = await userRepository.findOne({ login: 'user001' });
  if (user) {
    task1.addAssigned(user);
    await taskRepository.save(task1);
  }

};
