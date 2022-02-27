declare module '$:/core/modules/commander.js' {
  export interface Command {
    execute(): null;
    new (params: string[], commander: Commander): Command;
  }
  export interface CommandInfo {
    name: string;
    synchronous: boolean;
  }

  export class Commander {
    public static initCommands(moduleType: ModuleType): void;

    /**
     * Log a string if the verbose flag is set.
     */
    public log(message: string): void;
    /**
     * Write a string if the verbose flag is set.
     */
    public write(message: string): void;

    public addCommandTokens(commandTokens: string[]): void;
    public execute(): void;
    public executeNextCommand(): void;

    /*
      Given an array of parameter strings `params` in name:value format, and an
      array of mandatory parameter names in `mandatoryParameters`, returns a
      hashmap of values or a string if error.
    */
    public extractNamedParameters(
      params: string[],
      mandatoryParams: string[]
    ): UnknownRecord | string;

    public constructor(
      commandTokens: string[],
      callback: Callback,
      wiki: TiddlyWiki,
      streams: $AnyFixMe
    );
  }
}
