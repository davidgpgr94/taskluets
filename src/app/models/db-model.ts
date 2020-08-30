
import db from '../../database';
import { v4 as uuidv4 } from 'uuid';

type GenericObject = {[key: string]: any};
export const TO_HIDE_PROPERTY_CHARACTER: string = '__';

export class DbModel {

  readonly __tableName__: string;
  readonly id?: string;

  constructor() {
    this.__tableName__ = this.constructor.name.toLowerCase();
  }

  private getPropertyNames() {
    let properties = Object.getOwnPropertyNames(this);
    properties = properties.filter(p => !this.isHiddenProperty(p));
    return properties;
  }

  private isHiddenProperty(propertyName: string): boolean {
    let parts = propertyName.split(TO_HIDE_PROPERTY_CHARACTER);
    return parts.length >= 3 && parts[0].length == 0 && parts[parts.length - 1].length == 0;
  }

  public async save(): Promise<boolean> {
    let properties = this.getPropertyNames();
    if (this.id) {
      // You have to update the entry.
      const res: GenericObject[] = await db(this.__tableName__).andWhere({id: this.id}).select(properties);
      let entry = res[0];
      const _this: GenericObject = this;
      let toUpdate: GenericObject = {};

      // Check which properties have changed
      for (let i = 0; i < properties.length; i++) {
        const prop = properties[i];
        if (entry[prop] !== _this[prop]) toUpdate[prop] = _this[prop];
      }

      const entriesUpdated = await db(this.__tableName__).update(toUpdate, ['id']).where({id: this.id});
      return entriesUpdated.length > 0;
    } else {
      // It's a new entry. Insert it dude!
      const _this: GenericObject = this;
      let toInsert: GenericObject = {};

      for (let i = 0; i < properties.length; i++) {
        const prop = properties[i];
        toInsert[prop] = _this[prop];
      }
      toInsert['id'] = uuidv4();

      const res = await db(this.__tableName__).insert(toInsert, ['id']);
      return res.length > 0;
    }
  }

  public async delete(): Promise<boolean> {
    if (this.id) {
      let entriesDeleted = await db(this.__tableName__).where({id: this.id}).delete();
      return entriesDeleted > 0;
    } else {
      return false;
    }
  }
}
