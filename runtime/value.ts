import Environment from "./environment.ts";

export type ValueType = "null" | "number" | "boolean" | "string" | "object" | "array" | "function" | "undefined" | "nativefunction" | "class" | "instance";

export interface runtimeValue {
    type: ValueType;
}
export interface NullValue extends runtimeValue {
    type: "null",
    value: null;
}
export function MK_NULL(): NullValue {
    return {type: "null", value: null} as NullValue;
}
export interface NumberValue extends runtimeValue {
    type: "number",
    value: number;
}
export function MK_NUMBER(n = 0): NumberValue {
    return {type: "number", value: n} as NumberValue;
}
export interface BooleanValue extends runtimeValue {
    type: "boolean",
    value: boolean;
}
export function MK_BOOL(b = true): BooleanValue {
    return {type: "boolean", value: b} as BooleanValue;
}
export interface ObjectValue extends runtimeValue {
    type: "object",
    properties: Map<string, runtimeValue>;
}
export type FunctionCall = (args: runtimeValue[], env: Environment) => runtimeValue;
export interface NativeFunctionValue extends runtimeValue {
    type: "nativefunction",
    call: FunctionCall
}
export function MK_NATIVE_FUNCTION(call: FunctionCall) {
    return {type: "nativefunction", call} as NativeFunctionValue;
}