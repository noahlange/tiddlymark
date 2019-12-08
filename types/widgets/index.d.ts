type $AnyFixMe = any;
type $FnFixMe = Function;

type Callback<R = unknown> = (e: Error | null, p?: R) => void;
