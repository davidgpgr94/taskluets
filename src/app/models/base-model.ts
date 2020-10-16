import { GenericObject } from "../../types";

export const TO_HIDE_PROPERTY_CHARACTER: string = '__';

export class BaseModel {

  readonly id?: string;

  constructor(opts: BaseModel.BaseModelConstructorOpts) {
    this.id = opts.id;
  }

  public getPropertyNames(): Array<string> {
    let properties = Object.getOwnPropertyNames(this);
    properties = properties.filter(p => !this.isHiddenProperty(p));
    return properties;
  }

  private isHiddenProperty(propertyName: string): boolean {
    let parts = propertyName.split(TO_HIDE_PROPERTY_CHARACTER);
    return parts.length >= 3 && parts[0].length == 0 && parts[parts.length - 1].length == 0;
  }

}

export namespace BaseModel {
  export type BaseModelConstructorOpts = {
    id?: string
  } & GenericObject;
}
