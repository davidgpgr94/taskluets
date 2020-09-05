import { DbModel } from "../../db-model";
import db from '../../../../database';

type FindQuery = {[column: string]: any};

class BaseRepository<T extends DbModel> {

  protected readonly __tableName__: string;

  constructor(tableName: string) {
    this.__tableName__ = tableName;
  }

  async findById(id: string): Promise<T|undefined> {
    let res = await db(this.__tableName__).andWhere({id: id}).select('*');
    return res[0];
  }

  async find(query: FindQuery = {}): Promise<Array<T>> {
    return await db(this.__tableName__).where(query).select('*');
  }

  // Buscar como devolver un objeto de tipo T. Ahora mismo lo que devuelve es un JSON
  async findOne(query: FindQuery = {}): Promise<T|undefined> {
    let res = await db(this.__tableName__).where(query).select('*');
    return res[0];
  }
}

export default BaseRepository;
