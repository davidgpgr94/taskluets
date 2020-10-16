import { BaseModel } from "./base-model";
import { User } from '.';

export class Task extends BaseModel {

  private title: string;
  private description: string;
  private __assignedTo__: Array<User> = [];

  constructor(opts: Task.TaskConstructorOpts) {
    super(opts);
    this.title = opts.title;
    this.description = opts.description;
    this.__assignedTo__ = [];
  }

  public addAssigned(user: User) {
    if (!user.id) throw new Error('The user has to be created first');
    // if (!this.__assignedTo__) this.__assignedTo__ = [];
    this.__assignedTo__.push(user);
  }

  public addAssignees(users: Array<User>) {
    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      this.addAssigned(user);
    }
  }

  public get assignees(): Array<User> {
    return this.__assignedTo__;
  }

}

export namespace Task {
  export type TaskConstructorOpts = {
    title: string,
    description: string
  } & BaseModel.BaseModelConstructorOpts;
}
