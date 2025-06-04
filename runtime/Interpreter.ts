import { ValueType, runtimeValue, NumberValue, MK_NULL, StringValue } from "./value.ts";
import { NodeType, Stemt, NumericLiteral, BinaryExpr, Program, Identifier, VariableDeclaration, AssignmentExpr, ObjectLiteral, CallExpr, FunctionDeclaration, StringLiteral, NewExpr, MemberExpr } from "../frontend/ast.ts";
import Environment from "./environment.ts";
import { eval_assignment_expr, eval_identifier, evaluateBinaryExpr, eval_object_expr, eval_call_expr, eval_new_expr, eval_member_expr } from "./eval/expressions.ts";
import { evaluateFunctionDeclaration, evaluateProgram, evaluateVariableDeclaration } from "./eval/statments.ts";

export function evaluate(astNode: Stemt, env: Environment): runtimeValue {
    switch (astNode.kind) {
        case "NumericLiteral":
            return {type: "number",value: (astNode as NumericLiteral).value} as NumberValue;
        case "StringLiteral":
            return {type: "string",value: (astNode as StringLiteral).value} as StringValue;
        case "ObjectLiteral":
            return eval_object_expr(astNode as ObjectLiteral, env);
        case "CallExpr":
            return eval_call_expr(astNode as CallExpr, env);
        case "NewExpr":
            return eval_new_expr(astNode as NewExpr, env);
        case "MemberExpr":
            return eval_member_expr(astNode as MemberExpr, env);
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
        case "FunctionDeclaration":
            return evaluateFunctionDeclaration(astNode as FunctionDeclaration, env);
        default:
            console.error("Trio's interpreter error: Unsupported AST node kind", astNode.kind);
            Deno.exit(1);
    }
}

