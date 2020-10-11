import { BaseRepository, GenericObject } from "./base-repository";
import { User } from "../user";

export class UserRepository extends BaseRepository<User> {

  constructor() {
    super('user', User);
  }

}
