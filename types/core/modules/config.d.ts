declare module '$:/core/modules/config.js' {
  export const preferences: {
    notificationDuration: number;
    jsonSpaces: number;
    textPrimitives: {
      upperLetter: string;
      lowerLetter: string;
      anyLetter: string;
      blockPrefixLetters: string;
      unWikiLink: string;
      wikiLink: string;
    };
    htmlEntities: Record<string, number>;
    htmlVoidElements: string;
    htmlBlockElements: string;
    htmlUnsafeElements: string[];
  };
}
