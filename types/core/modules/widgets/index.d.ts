type $AnyFixMe = any;
type $FnFixMe = (...args: unknown[]) => unknown | void;

type Callback<R = unknown> = (e: Error | null, p?: R) => void;
