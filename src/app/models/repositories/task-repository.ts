import { Transaction } from "knex";

import { BaseRepository, FindQuery } from "./base-repository";
import { AssignedRepository } from './assigned-repository';
import { Task } from '../task';
import { User } from '../user';
import { Assigned } from '../assigned';

export class TaskRepository extends BaseRepository<Task> {

  public static readonly TABLE_NAME: string = 'task';

  private assignedRepository: AssignedRepository;

  constructor(assignedRepository?: AssignedRepository) {
    super(TaskRepository.TABLE_NAME, Task);
    if (assignedRepository) this.assignedRepository = assignedRepository;
    else this.assignedRepository = new AssignedRepository(this);
  }

  public async save(entity: Task): Promise<boolean> {
    if (entity.id) {
      // We are updating a existing task
      let currentAssignees = await this.assignedRepository.find({ taskId: entity.id! });
      let assigneesToRemove = currentAssignees.filter(currentAssigned => {
        return entity.assignees.findIndex(a => a.id == currentAssigned.userId) == -1;
      });
      let assigneesToCreate = entity.assignees.filter(newAssigned => {
        return currentAssignees.findIndex(a => a.userId == newAssigned.id!) == -1;
      });
      let trx: Transaction = await this.db.transaction();
      entity.updatedOn = new Date();
      let entityUpdated: boolean = await super.save(entity, trx);
      let assigneesRemoved: boolean[] = Array(assigneesToRemove.length).fill(false);
      let assigneesCreated: boolean[] = Array(assigneesToCreate.length).fill(false);
      for (let i = 0; i < assigneesToRemove.length; i++) {
        const assignedToRemove = assigneesToRemove[i];
        assigneesRemoved[i] = await this.assignedRepository.delete(assignedToRemove, trx);
      }
      let allAssigneesRemoved: boolean = assigneesRemoved.reduce((acc, c, i) => {
        if (i == 0) return acc || c
        else return acc && c
      }, false);
      for (let i = 0; i < assigneesToCreate.length; i++) {
        const assignedToCreate = assigneesToCreate[i];
        let assigned: Assigned = new Assigned({ taskId: entity.id!, userId: assignedToCreate.id! });
        assigneesCreated[i] = await this.assignedRepository.save(assigned, trx);
      }
      let allAssigneesCreated: boolean = assigneesCreated.reduce((acc, c, i) => {
        if (i == 0) return acc || c
        else return acc && c
      }, false);
      trx.commit();
      return entityUpdated || allAssigneesRemoved || allAssigneesCreated;
    } else {
      // It's a new task
      let trx: Transaction = await this.db.transaction();
      entity.updatedOn = new Date();
      let entityUpdated: boolean = await super.save(entity, trx);
      let assignedCreated: boolean = false;
      for (let i = 0; i < entity.assignees.length; i++) {
        const userAssigned = entity.assignees[i];
        const assigned: Assigned = new Assigned({taskId: entity.id!, userId: userAssigned.id!});
        assignedCreated = await this.assignedRepository.save(assigned, trx);
        if (!assignedCreated) {
          trx.rollback();
          break;
        }
      }
      trx.commit();
      return entityUpdated && assignedCreated;
    }
  }

  public async getTaskAssignees(task: Task): Promise<Array<User>> {
    return await this.assignedRepository.getTaskUsersAssignees(task.id!);
  }

  /**
   * Fetch tasks with their related entities
   * @param query
   */
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
