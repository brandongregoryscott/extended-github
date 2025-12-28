/**
 * DeepPartial
 * @desc Partial that works for deeply nested structure
 * @see https://github.com/piotrwitek/utility-types/blob/7c81e8d2ad04dd4e7313a97f83af314f38b3eea1/src/mapped-types.ts#L495-L527
 * @example
 *   // Expect: {
 *   //   first?: {
 *   //     second?: {
 *   //       name?: string;
 *   //     };
 *   //   };
 *   // }
 *   type NestedProps = {
 *     first: {
 *       second: {
 *         name: string;
 *       };
 *     };
 *   };
 *   type PartialNestedProps = DeepPartial<NestedProps>;
 */
type DeepPartial<T> = { [P in keyof T]?: _DeepPartial<T[P]> };

type _DeepPartial<T> = T extends Function
    ? T
    : T extends Array<infer U>
      ? _DeepPartialArray<U>
      : T extends object
        ? DeepPartial<T>
        : T | undefined;

type _DeepPartialArray<T> = {} & Array<_DeepPartial<T>>;

export type { DeepPartial };
