
export const TO_HIDE_PROPERTY_CHARACTER: string = '__';

export class BaseModel {

  readonly id?: string;

  constructor(id?: string) {
    this.id = id;
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
