import BaseRepository from "./base/base-repository";
import { User } from "../user";

class UserRepository extends BaseRepository<User> {

  constructor() {
    super('user', User);
  }

}

export default UserRepository;
