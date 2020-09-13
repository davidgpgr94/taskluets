import { DbModel } from "../../db-model";
import db from '../../../../database';

type FindQuery = {[column: string]: any};
type TypeofDbModel = typeof DbModel;
type GenericDbObject = { [key: string]: any } & DbModel;

class BaseRepository<T extends DbModel> {

  protected readonly __tableName__: string;
  protected readonly __klass__: TypeofDbModel;

  constructor(tableName: string, klass: new(...args: any) => DbModel) {
    this.__tableName__ = tableName;
    this.__klass__ = klass;
  }

  async findById(id: string): Promise<T|undefined> {
    let aryRes = await db(this.__tableName__).andWhere({id: id}).select('*');
    let res = aryRes[0];
    if (res) {
      return this.createInstance(res);
    } else {
      return res;
    }
  }

  async find(query: FindQuery = {}): Promise<Array<T>> {
    return await db(this.__tableName__).where(query).select('*');
  }

  // Buscar como devolver un objeto de tipo T. Ahora mismo lo que devuelve es un JSON
  async findOne(query: FindQuery = {}): Promise<T|undefined> {
    let aryRes = await db(this.__tableName__).where(query).select('*');
    let res = aryRes[0];
    if (res) {
      return this.createInstance(res)
    } else {
      return res;
    }
  }

  private createInstance(source: any): T {
    let insntace = {};
    Object.assign(insntace, source);
    Object.setPrototypeOf(insntace, this.__klass__.prototype);
    return insntace as T;
  }
}

export default BaseRepository;
