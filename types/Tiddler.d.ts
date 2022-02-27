declare module '$:/core/modules/tiddler.js' {
  // the tiddler class itself is stored in the boot script, this just has some
  // helper methods that aren't attached to the former's prototype for some reason.
}

interface TiddlerModificationFields {
  modified: number;
  modifier?: string;
}

interface TiddlerCreationFields {
  created: number;
}

interface TiddlerTextFields {
  title: string;
  type: string;
  text: string;
  tags: string;
  bag: string;
}

type Fields = TiddlerTextFields &
  TiddlerModificationFields &
  TiddlerCreationFields;

/**
 * Union type of standard tiddler fields.
 */
type TiddlerFields<K extends keyof Fields = keyof Fields> = Record<
  K,
  Fields[K]
>;

interface FieldStringOptions<T> {
  exclude: T[];
}

declare class Tiddler<
  U extends UnknownRecord = UnknownRecord,
  T = U & TiddlerFields,
  K = keyof T
> {
  public fields: T;

  /**
   * Checks if the tiddler is a draft.
   */
  public isDraft(): boolean;

  /**
   * Checks if the tiddler is a plugin.
   */
  public isPlugin(): boolean;

  /**
   * Checks for the existence of a field.
   */
  public hasField(field: K): boolean;

  /**
   * Checks for the presence of a tag.
   */
  public hasTag(tag: string): boolean;

  /**
   * Return the value of a field as a string.
   */
  public getFieldString(field: K): string;

  /**
   * Returns an object with fields mapped to string values.
   */
  public getFieldStrings(
    options?: FieldStringOptions<keyof T>
  ): Record<keyof T, string>;

  /**
   * Stringify fields into key:value metadata block.
   * @param options: fields to exclude
   */
  public getFieldStringBlock(options?: FieldStringOptions<keyof T>): string;

  /**
   * Get the value of a field as an array.
   */
  public getFieldList(field: keyof T): string[];

  /**
   * Parse the value of a field as a Date.
   */
  public getFieldDay(field: keyof T): Date;

  /**
   * Compares two tiddlers for equality.
   * @param tiddler: the tiddler to compare
   * @param exclude: field names to exclude from comparison
   */
  public isEqual(tiddler: Tiddler, exclude?: Array<keyof T>): boolean;

  /**
   * Construct a Tiddler from an arbitrary number of key-value objects, merged from right.
   */
  public constructor(...tiddlers: Array<Tiddler | UnknownRecord>);
}
