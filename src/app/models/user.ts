
import bcrypt from 'bcrypt';
import validator from 'validator';
import { BaseModel } from './base-model';

export class User extends BaseModel {

  static LOGIN_LENGTH: number = 7;

  private email: string;
  readonly login: string;
  private hashedPassword: string;
  private salt: string;
  private active: boolean;

  constructor(opts: User.UserConstructorOpts) {
    super(opts);
    if (!validator.isEmail(opts.email)) throw new TypeError('Email bad format.');
    if (!validator.isLength(opts.login, { min: User.LOGIN_LENGTH, max: User.LOGIN_LENGTH})) throw new TypeError(`Login length must be of ${User.LOGIN_LENGTH}`);
    this.login = opts.login;
    this.email = opts.email;
    this.salt = bcrypt.genSaltSync(5, 'b');
    if (!opts.rawPassword) {
      this.hashedPassword = this.hashPassword(User.initialPassword());
    } else {
      this.hashedPassword = this.hashPassword(opts.rawPassword);
    }
    this.active = opts.active || true;
  }

  private hashPassword(rawPassword: string): string{
    return bcrypt.hashSync(rawPassword, this.salt);
  }

  /**
   * Change user password. Return true if the password has been changed, false otherwise.
   * It will return false if the newPassword is the same than de current password.
   *
   * @param newPassword
   */
  public changePassword(newPassword: string): boolean {
    if (!bcrypt.compareSync(newPassword, this.hashedPassword)) {
      this.hashedPassword = this.hashPassword(newPassword);
      return true;
    } else {
      return false;
    }
  }

  public changeEmail(newEmail: string): boolean {
    if (!validator.isEmail(newEmail)) return false;
    this.email = newEmail;
    return true;
  }

  public getEmail(): string {
    return this.email;
  }

  public setInactive(): void {
    this.active = false;
  }

  public setActive(): void {
    this.active = true;
  }

  public isActive(): boolean {
    return this.active;
  }

  public comparePassword(rawPassword: string): boolean {
    return bcrypt.compareSync(rawPassword, this.hashedPassword);
  }

  // TODO: Retrieve this value from a config
  private static initialPassword(): string {
    return '12345';
  }

}

export namespace User {
  export type UserConstructorOpts = {
    login: string,
    email: string,
    rawPassword: string,
    active?: boolean
  } & BaseModel.BaseModelConstructorOpts;
}
