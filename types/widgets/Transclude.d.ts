declare module '$:/core/modules/widgets/transclude.js' {
  import { widget as Widget } from '$:/core/modules/widgets/widget.js';

  type TranscludeMode = 'block' | 'inline';

  class TranscludeWidget extends Widget {
    public transcludeTitle: string;
    public transcludeSubTiddler: string;
    public transcludeField: string;
    public transcludeIndex: number;
    public transcludeMode: TranscludeMode;
  }

  export { TranscludeWidget as transclude };
}
