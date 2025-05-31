import { ValueType, runtimeValue, NumberValue, MK_NULL } from "./value.ts";
import { NodeType, Stemt, NumericLiteral, BinaryExpr, Program, Identifier } from "../frontend/ast.ts";
import Environment from "./environment.ts";
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
function evaluateBinaryExpr(astNode: BinaryExpr, env: Environment): runtimeValue {
    const lhs = evaluate(astNode.left, env);
    const rhs = evaluate(astNode.right, env);
    if (lhs.type == "number" && rhs.type == "number") {
        return eval_numeric_binary_expr(lhs as NumberValue, rhs as NumberValue, astNode.operator);
    }
    return MK_NULL();
}
function evaluateProgram(astNode: Program, env: Environment): runtimeValue {
    let lastEvaluated: runtimeValue = MK_NULL();
    for (const statement of astNode.body) {
        lastEvaluated = evaluate(statement,env);
    }
    return lastEvaluated;
}
function eval_identifier(astNode: Identifier, env: Environment): runtimeValue {
    const value = env.lookupVariable(astNode.symbol);
    return value || MK_NULL();
}

export function evaluate(astNode: Stemt, env: Environment): runtimeValue {
    switch (astNode.kind) {
        case "NumericLiteral":
            return {value: (astNode as NumericLiteral).value, type: "number"} as NumberValue;
        case "Identifier":
            return eval_identifier(astNode as Identifier, env);
        case "BinaryExpr":
            return evaluateBinaryExpr(astNode as BinaryExpr, env);
        case "Program":
            return evaluateProgram(astNode as Program, env);
        default:
            console.error("Trio's interpreter error: Unsupported AST node kind", astNode.kind);
            Deno.exit(1);
    }
}