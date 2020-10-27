declare module '$:/core/modules/story.js' {
  interface StoryOptions {
    wiki: TiddlyWiki;
    storyTitle: string;
    historyTitle: string;
  }

  export class Story {
    public navigateTiddler(
      navigateTo: string,
      navigateFromTitle: string,
      navigateFromClientRect: string
    ): void;

    public constructor(options: StoryOptions);
  }
}
