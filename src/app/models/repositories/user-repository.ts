import { BaseRepository } from "./base-repository";
import { User } from "../user";
import { AssignedRepository } from "./assigned-repository";

export class UserRepository extends BaseRepository<User> {

  public static TABLE_NAME: string = 'user';
  private assignedRepository: AssignedRepository;

  constructor(assignedRepository?: AssignedRepository) {
    super(UserRepository.TABLE_NAME, User);
    if (assignedRepository) this.assignedRepository = assignedRepository;
    else this.assignedRepository = new AssignedRepository(undefined, this);
  }

}
