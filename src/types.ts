
export type GenericObject = { [key: string]: any }

export type ObjectWithConstructor<T> = {
  new(...args: any): T
}
