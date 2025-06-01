import { ValueType, runtimeValue, NumberValue, MK_NULL } from "./value.ts";
import { NodeType, Stemt, NumericLiteral, BinaryExpr, Program, Identifier, VariableDeclaration, AssignmentExpr } from "../frontend/ast.ts";
import Environment from "./environment.ts";
import { eval_assignment_expr, eval_identifier, evaluateBinaryExpr } from "./eval/expressions.ts";
import { evaluateProgram, evaluateVariableDeclaration } from "./eval/statments.ts";

export function evaluate(astNode: Stemt, env: Environment): runtimeValue {
    switch (astNode.kind) {
        case "NumericLiteral":
            return {value: (astNode as NumericLiteral).value, type: "number"} as NumberValue;
        case "Identifier":
            return eval_identifier(astNode as Identifier, env);
        case "BinaryExpr":
            return evaluateBinaryExpr(astNode as BinaryExpr, env);
        case "AssignmentExpr":
            return eval_assignment_expr(astNode as AssignmentExpr, env);
        case "Program":
            return evaluateProgram(astNode as Program, env);
        case "VariableDeclaration":
            return evaluateVariableDeclaration(astNode as VariableDeclaration, env);
        default:
            console.error("Trio's interpreter error: Unsupported AST node kind", astNode.kind);
            Deno.exit(1);
    }
}

