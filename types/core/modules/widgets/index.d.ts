type $AnyFixMe = any;
type $FnFixMe = (...args: $AnyFixMe[]) => $AnyFixMe | void;

type Callback<R = unknown> = (e: Error | null, p?: R) => void;
