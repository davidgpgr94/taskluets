import Knex from 'knex';
import { v4 as uuidv4 } from 'uuid';

import db from '../../../database';
import { BaseModel } from '../base-model';

type FindQuery = { [column: string]: any };
export type GenericObject = { [key: string]: any };

export abstract class BaseRepository<T extends BaseModel> {
  protected readonly tableName: string;
  protected readonly __klass__: typeof BaseModel;
  protected db: Knex;

  constructor(tableName: string, klass: new(...args: any) => BaseModel) {
    this.tableName = tableName;
    this.db = db;
    this.__klass__ = klass;
  }

  public async findById(id: string): Promise<T|undefined> {
    let aryRes = await this.db(this.tableName).andWhere({ id: id }).select('*');
    let res = aryRes[0];
    if (res) {
      return this.createInstance(res);
    } else {
      return res;
    }
  }

  public async find(query: FindQuery = {}): Promise<Array<T>> {
    return await this.db(this.tableName).where(query).select('*');
  }

  public async findOne(query: FindQuery = {}): Promise<T|undefined> {
    let aryRes = await this.db(this.tableName).where(query).select('*');
    let res = aryRes[0];
    if (res) {
      return this.createInstance(res);
    } else {
      return res;
    }
  }

  public async save(entity: T): Promise<boolean> {
    let properties = entity.getPropertyNames();
    if (entity.id) {
      // Update entity
      const res: GenericObject[] = await this.db(this.tableName).andWhere({ id: entity.id }).select(properties);
      let entry = res[0];
      if (!entry) {
        throw new Error(`Unexpected error. Entry with id = ${entity.id} not found in ${this.tableName}`);
      }
      const entityAsGeneric: GenericObject = entity;
      let toUpdate: GenericObject = {};

      // Check which properties have changed
      for (let i = 0; i < properties.length; i++) {
        const prop = properties[i];
        if (entry[prop] !== entityAsGeneric[prop]) toUpdate[prop] = entityAsGeneric[prop];
      }

      if (Object.keys(toUpdate).length === 0) {
        return false;
      }

      const entriesUpdated = await this.db(this.tableName).update(toUpdate, ['id']).where({id: entity.id}) as unknown as number;
      return entriesUpdated == 1;
    } else {
      // New entry
      let toInsert: GenericObject = {};
      const entityAsGeneric: GenericObject = entity;
      for (let i = 0; i < properties.length; i++) {
        const prop = properties[i];
        toInsert[prop] = entityAsGeneric[prop];
      }
      toInsert['id'] = uuidv4();

      const res = await this.db(this.tableName).insert(toInsert, ['id']);
      return res.length > 0;
    }
  }

  async delete(entity: T): Promise<boolean> {
    let deleted: boolean = false;
    if (entity.id) {
      let entriesDeleted = await this.db(this.tableName).where({ id: entity.id }).delete();
      deleted = entriesDeleted > 0;
    }
    return deleted;
  }

  private createInstance(source: GenericObject): T {
    let instance = {};
    Object.assign(instance, source);
    Object.setPrototypeOf(instance, this.__klass__.prototype);
    return instance as T;
  }

}
