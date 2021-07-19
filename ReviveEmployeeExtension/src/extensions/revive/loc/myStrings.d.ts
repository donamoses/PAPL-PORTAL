declare interface IReviveCommandSetStrings {
  Command1: string;
  Command2: string;
}

declare module 'ReviveCommandSetStrings' {
  const strings: IReviveCommandSetStrings;
  export = strings;
}
