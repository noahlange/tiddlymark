declare module '$:/core/modules/filters.js' {
  import type { widget as Widget } from '$:/core/modules/widgets/widget.js';

  type IteratorFn = (tiddler: Tiddler, title: string) => unknown;
  type CompiledFilter = (source: IteratorFn, widget: unknown) => void;

  interface Operator {
    operator: string;
    operand: string;
  }

  interface Operation {
    prefix: string;
    operators: Operator[];
  }

  export function getFilterOperators(): string;

  export function filterTiddlers(
    filterString: string,
    widget: Widget,
    source: string
  ): string[];

  export function parseFilter(filterString: string): Operation[];
  export function compileFilter(filterString: string): CompiledFilter;
}
