import { ValueType, runtimeValue, NullValue, NumberValue } from "./value.ts";
import { NodeType, Stemt, NumericLiteral, BinaryExpr, Program } from "../frontend/ast.ts";
function eval_numeric_binary_expr(lhs: NumberValue, rhs: NumberValue, operator: string): NumberValue {
    let result: number;
    if(operator == "+") {
        result = lhs.value + rhs.value;
    }else if(operator == "-") {
        result = lhs.value - rhs.value;
    }else if(operator == "*") {
        result = lhs.value * rhs.value;
    }else if(operator == "/") {
        if(rhs.value === 0) {
            console.error("Trio's interpreter error: Division by zero.");
            Deno.exit(1);
        }
        result = lhs.value / rhs.value;
    }else if(operator == "%") {
        result = lhs.value % rhs.value;
    }else {
        console.error("Trio's interpreter error: Unsupported binary operator", operator);
        Deno.exit(1);
    }
    return {type: "number", value: result};
}
function evaluateBinaryExpr(astNode: BinaryExpr): runtimeValue {
    const lhs = evaluate(astNode.left);
    const rhs = evaluate(astNode.right);
    if (lhs.type == "number" && rhs.type == "number") {
        return eval_numeric_binary_expr(lhs as NumberValue, rhs as NumberValue, astNode.operator);
    }
    return {type: "null", value: null} as NullValue;
}
function evaluateProgram(astNode: Program): runtimeValue {
    let lastEvaluated: runtimeValue = {value: null, type: "null"} as NullValue;
    for (const statement of astNode.body) {
        lastEvaluated = evaluate(statement);
    }
    return lastEvaluated;
}
export function evaluate(astNode: Stemt): runtimeValue {
    switch (astNode.kind) {
        case "NumericLiteral":
            return {value: (astNode as NumericLiteral).value, type: "number"} as NumberValue;
        case "NullLiteral":
            return {value: null, type: "null"} as NullValue;
        case "BinaryExpr":
            return evaluateBinaryExpr(astNode as BinaryExpr);
        case "Program":
            return evaluateProgram(astNode as Program);
        default:
            console.error("Trio's interpreter error: Unsupported AST node kind", astNode.kind);
            Deno.exit(1);
    }
}