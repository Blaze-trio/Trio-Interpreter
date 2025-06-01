import { Program, VariableDeclaration } from '../../frontend/ast.ts';
import Environment from '../environment.ts';
import { runtimeValue, MK_NULL } from '../value.ts';
import { evaluate } from '../Interpreter.ts';

export function evaluateProgram(astNode: Program, env: Environment): runtimeValue {
    let lastEvaluated: runtimeValue = MK_NULL();
    for (const statement of astNode.body) {
        lastEvaluated = evaluate(statement,env);
    }
    return lastEvaluated;
}
export function evaluateVariableDeclaration(declaration: VariableDeclaration, env: Environment): runtimeValue {
    const value = declaration.value ? evaluate(declaration.value, env) : MK_NULL();
    return env.declareVariable(declaration.identifier, value, declaration.const);
}