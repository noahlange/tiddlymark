declare module '$:/core/modules/tiddler.js' {
  // the tiddler class is actually stored in the boot script, this just has some
  // helper methods that aren't attached to the former's prototype for some reason.
}

type TiddlerModificationFields = {
  modified: number;
  modifier?: string;
};

type TiddlerCreationFields = {
  created: number;
};

type TiddlerTextFields = {
  title: string;
  type: string;
  text: string;
  tags: string;
  bag: string;
};

type TiddlerFields = TiddlerTextFields &
  TiddlerModificationFields &
  TiddlerCreationFields;

type FieldStringOptions<T> = {
  exclude: T[];
};

declare class Tiddler<
  U extends Record<string, any> = {},
  T extends U & TiddlerFields = U & TiddlerFields,
  K extends keyof T = keyof T
> {
  fields: T;
  isDraft(): boolean;
  isPlugin(): boolean;
  hasTag(tag: string): boolean;
  getFieldString(field: K): string;
  getFieldStrings(
    options?: FieldStringOptions<keyof T>
  ): Record<keyof T, string>;
  getFieldStringBlock(options?: FieldStringOptions<keyof T>): string;
  getFieldList(field: keyof T): string[];
  getFieldDay(field: keyof T): Date;
  hasField(field: string): boolean;
  isEqual(tiddler: Tiddler, exclude?: string[]): boolean;
  /**
   * Construct a Tiddler from an arbitrary number of key-value objects, merged from right.
   */
  constructor(...tiddlers: Array<Tiddler | Record<string, $AnyFixMe>>);
}
