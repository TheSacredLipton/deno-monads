export interface MatchO<T, U> {
  some: (val: T) => U;
  none: (() => U) | U;
}

export interface Option<T> {
  type: symbol;
  isSome(): boolean;
  isNone(): boolean;
  match<U>(fn: MatchO<T, U>): U;
  map<U>(fn: (val: T) => U): Option<U>;
  andThen<U>(fn: (val: T) => Option<U>): Option<U>;
  or<U>(optb: Option<U>): Option<T | U>;
  and<U>(optb: Option<U>): Option<U>;
  unwrapOr(def: T): T;
  unwrap(): T | never;
}

export interface OptSome<T> extends Option<T> {
  unwrap(): T;
  map<U>(fn: (val: T) => U): OptSome<U>;
  or<U>(optb: Option<U>): Option<T>;
  and<U>(optb: Option<U>): Option<U>;
}

export interface OptNone<T> extends Option<T> {
  unwrap(): never;
  map<U>(fn: (val: T) => U): OptNone<U>;
  or<U>(optb: Option<U>): Option<U>;
  and<U>(optb: Option<U>): OptNone<U>;
}

export interface MatchR<T, E, U> {
  ok: (val: T) => U;
  err: (val: E) => U;
}

export interface Result<T, E> {
  type: symbol;
  isOk(): boolean;
  isErr(): boolean;
  ok(): Option<T>;
  err(): Option<E>;
  unwrap(): T | never;
  unwrapOr(optb: T): T;
  unwrapOrElse(fn: (err: E) => T): T;
  unwrapErr(): E | never;
  match<U>(fn: MatchR<T, E, U>): U;
  map<U>(fn: (val: T) => U): Result<U, E>;
  mapErr<U>(fn: (err: E) => U): Result<T, U>;
  andThen<U>(fn: (val: T) => Result<U, E>): Result<U, E>;
  orElse<U>(fn: (err: E) => Result<U, E>): Result<T, E> | Result<U, E>;
}

export interface ResOk<T, E = never> extends Result<T, E> {
  unwrap(): T;
  unwrapOr(optb: T): T;
  unwrapOrElse(fn: (err: E) => T): T;
  unwrapErr(): never;
  match<U>(fn: MatchR<T, never, U>): U;
  map<U>(fn: (val: T) => U): ResOk<U, never>;
  mapErr<U>(fn: (err: E) => U): ResOk<T, never>;
  andThen<U>(fn: (val: T) => Result<U, E>): Result<U, E>;
  orElse<U>(fn: (err: E) => Result<U, E>): Result<T, E>;
}

export interface ResErr<T, E> extends Result<T, E> {
  unwrap(): never;
  unwrapOr(optb: T): T;
  unwrapOrElse(fn: (err: E) => T): T;
  unwrapErr(): E;
  match<U>(fn: MatchR<never, E, U>): U;
  map<U>(fn: (val: T) => U): ResErr<never, E>;
  mapErr<U>(fn: (err: E) => U): ResErr<never, U>;
  andThen<U>(fn: (val: T) => Result<U, E>): ResErr<never, E>;
  orElse<U>(fn: (err: E) => Result<U, E>): Result<U, E>;
}

export interface MatchE<L, R, U> {
  left: (val: L) => U;
  right: (val: R) => U;
}

export interface Either<L, R> {
  type: symbol;
  isLeft(): boolean;
  isRight(): boolean;
  left(): Option<L>;
  leftAndThen<U>(fn: (val: L) => Either<U, R>): Either<U, R>;
  right(): Option<R>;
  rightAndThen<U>(fn: (val: R) => Either<L, U>): Either<L, U>;
  unwrap(): L | R;
  unwrapLeft(): L | never;
  unwrapLeftOr(other: L): L;
  unwrapLeftOrElse(fn: (right: R) => L): L;
  unwrapRight(): R | never;
  unwrapRightOr(other: R): R;
  unwrapRightOrElse(fn: (left: L) => R): R;
  match<U>(fn: MatchE<L, R, U>): U;
  map<U>(fn: (val: L | R) => U): Either<U, U>;
  mapLeft<U>(fn: (left: L) => U): Either<U, R>;
  mapRight<U>(fn: (right: R) => U): Either<L, U>;
}

export interface ResLeft<L, R> extends Either<L, R> {
  unwrap(): L;
  unwrapLeft(): L;
  unwrapRight(): never;
  match<U>(fn: MatchE<L, never, U>): U;
  map<U>(fn: (val: L) => U): ResLeft<U, never>;
  mapLeft<U>(fn: (left: L) => U): Either<U, never>;
  mapRight<U>(fn: (right: R) => U): ResLeft<L, never>;
}

export interface ResRight<L, R> extends Either<L, R> {
  unwrap(): R;
  unwrapLeft(): never;
  unwrapRight(): R;
  match<U>(fn: MatchE<never, R, U>): U;
  map<U>(fn: (val: R) => U): ResRight<never, U>;
  mapLeft<U>(fn: (left: L) => U): Either<never, R>;
  mapRight<U>(fn: (right: R) => U): ResRight<never, U>;
}
