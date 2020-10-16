import { BaseModel } from "./base-model";

export class Assigned extends BaseModel {

  public readonly taskId: string;
  public readonly userId: string;

  constructor(opts: Assigned.AssignedConstructorOpts) {
    super(opts);
    this.taskId = opts.taskId;
    this.userId = opts.userId;
  }

}

export namespace Assigned {
  export type AssignedConstructorOpts = {
    taskId: string,
    userId: string
  } & BaseModel.BaseModelConstructorOpts;
}
