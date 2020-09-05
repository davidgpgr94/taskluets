
import bcrypt from 'bcrypt';
import validator from 'validator';
import { DbModel } from './db-model';

export class User extends DbModel {

  static LOGIN_LENGTH: number = 7;

  private email: string;
  readonly login: string;
  private hashedPassword: string;
  private salt: string;
  private active: boolean;

  constructor(login: string, email: string, rawPassword: string, active: boolean = true) {
    super();
    if (!validator.isEmail(email)) throw new TypeError('Email bad format.');
    if (!validator.isLength(login, { min: User.LOGIN_LENGTH, max: User.LOGIN_LENGTH})) throw new TypeError(`Login length must be of ${User.LOGIN_LENGTH}`);
    this.login = login;
    this.email = email;
    this.salt = bcrypt.genSaltSync(5, 'b');
    this.hashedPassword = this.hashPassword(rawPassword);
    this.active = active;
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

}
