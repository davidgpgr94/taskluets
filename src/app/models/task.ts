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
  export type TaskConstructorOpts = {
    title: string,
    description: string
  } & BaseModel.BaseModelConstructorOpts;
}
