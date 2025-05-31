export type ValueType = "null" | "number";

export interface runtimeValue {
    type: ValueType;
}
export interface NullValue extends runtimeValue {
    type: "null",
    value: null;
}
export interface NumberValue extends runtimeValue {
    type: "number",
    value: number;
}