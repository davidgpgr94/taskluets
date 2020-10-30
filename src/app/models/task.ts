import { BaseModel } from "./base-model";
import { User } from '.';

export class Task extends BaseModel {

  public title: string;
  public description: string;
  public startDate: Date;
  public dueDate?: Date|null;
  public status: Task.TaskStatus;
  public createdOn: Date;
  public updatedOn: Date;
  private __assignedTo__: Array<User> = [];

  constructor(opts: Task.TaskConstructorOpts) {
    super(opts);
    this.title = opts.title;
    this.description = opts.description;
    this.startDate = opts.startDate;
    this.dueDate = opts.dueDate;
    this.status = opts.status || Task.TaskStatus.NEW;
    this.createdOn = new Date();
    this.updatedOn = new Date();
    this.__assignedTo__ = [];
  }

  public addAssigned(user: User) {
    if (!user.id) throw new Error('The user has to be created first');
    if (this.isAssigned(user)) throw new Error(`The user '${user.login}' can not be assigned two times to the same task`);
    this.__assignedTo__.push(user);
  }

  public addAssignees(users: Array<User>) {
    users.forEach(u => {
      let isAlreadyAssigned = this.__assignedTo__.findIndex(u2 => u2.id == u.id) !== -1;
      if (isAlreadyAssigned) throw new Error(`The user '${u.login}' can not be assigned two times to the same task`);
    });
    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      this.addAssigned(user);
    }
  }

  public get assignees(): Array<User> {
    return this.__assignedTo__;
  }

  public isAssigned(user: User): boolean {
    return user.id !== undefined && this.__assignedTo__.findIndex(u => u.id! == user.id!) !== -1;
  }

}

export namespace Task {
  export enum TaskStatus {
    NEW = 'new',
    PROGRESS = 'progress',
    REJECTED = 'rejected',
    FEEDBACK = 'feedback',
    CLOSED = 'closed'
  }

  export type TaskConstructorOpts = {
    title: string,
    description: string,
    startDate: Date,
    dueDate?: Date|null,
    status?: Task.TaskStatus
  } & BaseModel.BaseModelConstructorOpts;
}
