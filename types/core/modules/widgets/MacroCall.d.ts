declare module '$:/core/modules/widgets/macrocall.js' {
  import { widget as Widget } from '$:/core/modules/widgets/widget.js';
  import type { transclude as TranscludeWidget } from '$:/core/modules/widgets/transclude.js';

  class MacroCallWidget extends Widget {
    public parentWidget: TranscludeWidget;
  }

  export { MacroCallWidget as macrocall };
}
