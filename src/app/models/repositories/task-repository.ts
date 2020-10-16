import { BaseRepository, FindQuery } from "./base-repository";
import { AssignedRepository } from './assigned-repository';
import { UserRepository } from './user-repository';
import { Task } from '../task';
import { Assigned } from '../assigned';

export class TaskRepository extends BaseRepository<Task> {

  public static TABLE_NAME: string = 'task';

  private assignedRepository: AssignedRepository;

  constructor(assignedRepository?: AssignedRepository) {
    super(TaskRepository.TABLE_NAME, Task);
    if (assignedRepository) this.assignedRepository = assignedRepository;
    else this.assignedRepository = new AssignedRepository(this);
  }

  public async save(entity: Task): Promise<boolean> {
    let successful: boolean = true;
    successful = await super.save(entity);
    if (successful) {
      for (let i = 0; i < entity.assignees.length; i++) {
        const userAssigned = entity.assignees[i];
        const assigned: Assigned = new Assigned({taskId: entity.id!, userId: userAssigned.id!});
        successful = await this.assignedRepository.save(assigned);
        if (!successful) break;
      }
    }
    return successful;
  }

  public async findWithRelations(query: FindQuery) {
    const tasks = await this.find(query);
    for (let i = 0; i < tasks.length; i++) {
      const task = tasks[i];
      const users = await this.assignedRepository.getTaskUsersAssignees(task.id!);
      task.addAssignees(users);
    }
    return tasks;
  }

}
