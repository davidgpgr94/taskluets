import { BaseRepository } from "./base-repository";
import { TaskRepository } from "./task-repository";
import { UserRepository } from "./user-repository";
import { Assigned } from '../assigned';
import { User } from "../user";
import { Task } from "../task";

export class AssignedRepository extends BaseRepository<Assigned> {

  public static TABLE_NAME: string = 'assigned';

  private taskRepository: TaskRepository;
  private userRepository: UserRepository;

  constructor(taskRepository?: TaskRepository, userRepository?: UserRepository) {
    super(AssignedRepository.TABLE_NAME, Assigned);
    if (taskRepository) {
      this.taskRepository = taskRepository;
    } else {
      this.taskRepository = new TaskRepository(this);
    }
    if (userRepository) {
      this.userRepository = userRepository;
    } else {
      this.userRepository = new UserRepository(this);
    }
  }

  public async getTaskUsersAssignees(taskId: string): Promise<Array<User>> {
    const assignees = await this.find({ taskId: taskId });
    const users = await this.userRepository.find({ id: assignees.map(a => a.userId) });
    return users;
  }

  public async getUserTasks(userId: string): Promise<Array<Task>> {
    const assignees = await this.find({ userId: userId });
    const tasks = await this.taskRepository.find({id: assignees.map(a => a.taskId)});
    return tasks;
  }

}
