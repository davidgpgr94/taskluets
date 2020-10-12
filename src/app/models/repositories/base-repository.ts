import Knex from 'knex';
import { v4 as uuidv4 } from 'uuid';

import db from '../../../database';
import { BaseModel } from '../base-model';
import { handleDbError } from '../../../common/errors/db/handler';

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
    let aryRes = await this.db(this.tableName).where(query).select('*');
    let entities = [];
    for (let i = 0; i < aryRes.length; i++) {
      let entry = aryRes[i];
      const entity = this.createInstance(entry);
      entities.push(entity);
    }
    return entities;
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

      try {
        const entriesUpdated = await this.db(this.tableName).update(toUpdate).where({id: entity.id});
        return entriesUpdated == 1;
      } catch (err) {
        throw handleDbError(err);
      }
    } else {
      // New entry
      let toInsert: GenericObject = {};
      const entityAsGeneric: GenericObject = entity;
      for (let i = 0; i < properties.length; i++) {
        const prop = properties[i];
        toInsert[prop] = entityAsGeneric[prop];
      }
      toInsert['id'] = uuidv4();

      try {
        const res = await this.db(this.tableName).insert(toInsert);
        return res.length > 0;
      } catch (err) {
        throw handleDbError(err);
      }
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
