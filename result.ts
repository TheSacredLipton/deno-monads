import { None, Some } from "./option.ts";
import { MatchR, Option, OptNone, ResErr, ResOk, Result } from "./types.ts";

export const ResultType = {
  Ok: Symbol(":ok"),
  Err: Symbol(":err"),
};

export function Ok<T, E = never>(val: T): ResOk<T, E> {
  return {
    type: ResultType.Ok,
    isOk(): boolean {
      return true;
    },
    isErr(): boolean {
      return false;
    },
    ok(): Option<T> {
      return Some(val);
    },
    err(): OptNone<E> {
      return None;
    },
    unwrap(): T {
      return val;
    },
    unwrapOr(_optb: T): T {
      return val;
    },
    unwrapOrElse(_fn: (err: E) => T): T {
      return val;
    },
    unwrapErr(): never {
      throw new ReferenceError("Cannot unwrap Err value of Result.Ok");
    },
    match<U>(matchObject: MatchR<T, never, U>): U {
      return matchObject.ok(val);
    },
    map<U>(fn: (val: T) => U): ResOk<U, never> {
      return Ok(fn(val));
    },
    mapErr<U>(_fn: (err: E) => U): ResOk<T, never> {
      return Ok(val);
    },
    andThen<U>(fn: (val: T) => Result<U, E>): Result<U, E> {
      return fn(val);
    },
    orElse<U>(_fn: (err: E) => Result<U, E>): ResOk<T, E> {
      return Ok(val);
    },
  };
}

export function Err<T, E>(err: E): ResErr<T, E> {
  return {
    type: ResultType.Err,
    isOk(): boolean {
      return false;
    },
    isErr(): boolean {
      return true;
    },
    ok(): Option<T> {
      return None;
    },
    err(): Option<E> {
      return Some(err);
    },
    unwrap(): never {
      throw new ReferenceError("Cannot unwrap Ok value of Result.Err");
    },
    unwrapOr(optb: T): T {
      return optb;
    },
    unwrapOrElse(fn: (err: E) => T): T {
      return fn(err);
    },
    unwrapErr(): E {
      return err;
    },
    match<U>(matchObject: MatchR<never, E, U>): U {
      return matchObject.err(err);
    },
    map<U>(_fn: (_val: T) => U): ResErr<never, E> {
      return Err(err);
    },
    mapErr<U>(fn: (err: E) => U): ResErr<never, U> {
      return Err(fn(err));
    },
    andThen<U>(_fn: (val: T) => Result<U, E>): ResErr<never, E> {
      return Err(err);
    },
    orElse<U>(fn: (err: E) => Result<U, E>): Result<U, E> {
      return fn(err);
    },
  };
}

export function isOk<T, E>(val: Result<T, E>): val is ResOk<T> {
  return val.isOk();
}

export function isErr<T, E>(val: Result<T, E>): val is ResErr<T, E> {
  return val.isErr();
}
