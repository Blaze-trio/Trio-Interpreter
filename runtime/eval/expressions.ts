import { NumberValue, runtimeValue, MK_NULL } from "../value.ts";
import { evaluate } from "../Interpreter.ts";
import Environment from "../environment.ts";
import { AssignmentExpr, BinaryExpr, Identifier } from "../../frontend/ast.ts";

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
export function evaluateBinaryExpr(astNode: BinaryExpr, env: Environment): runtimeValue {
    const lhs = evaluate(astNode.left, env);
    const rhs = evaluate(astNode.right, env);
    if (lhs.type == "number" && rhs.type == "number") {
        return eval_numeric_binary_expr(lhs as NumberValue, rhs as NumberValue, astNode.operator);
    }
    return MK_NULL();
}

export function eval_identifier(astNode: Identifier, env: Environment): runtimeValue {
    const value = env.lookupVariable(astNode.symbol);
    return value || MK_NULL();
}

export function eval_assignment_expr(astNode: AssignmentExpr, env: Environment): runtimeValue {
    if (astNode.assignee.kind !== "Identifier") {
        throw 'Trio\'s interpreter error: Assignment target must be an identifier. $(JSON.stringify(astNode.assignee))';
    }
    const identifier = (astNode.assignee as Identifier).symbol;
    return env.assignVariable(identifier, evaluate(astNode.value, env));
}
