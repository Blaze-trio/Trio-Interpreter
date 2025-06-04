import { ForStatement, FunctionDeclaration, IfStatement, Program, VariableDeclaration } from '../../frontend/ast.ts';
import Environment from '../environment.ts';
import { runtimeValue, MK_NULL, FunctionValue, BooleanValue } from '../value.ts';
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
export function evaluateFunctionDeclaration(declaration: FunctionDeclaration, env: Environment): runtimeValue {
    const fn = {
        type: "function",
        name: declaration.name,
        parameters: declaration.parameters,
        declarationEnv: env,
        body: [declaration.body],
    } as FunctionValue;
    return env.declareVariable(declaration.name, fn, true);
}
export function evaluateIfStatement(ifStmt: IfStatement, env: Environment): runtimeValue {
    const condition = evaluate(ifStmt.condition, env);
    let conditionValue = false;
    if (condition.type === "boolean") {
        conditionValue = (condition as BooleanValue).value;
    } else if (condition.type === "number") {
        conditionValue = (condition as any).value !== 0;
    } else if (condition.type === "string") {
        conditionValue = (condition as any).value !== "";
    } else if (condition.type === "null") {
        conditionValue = false;
    } else {
        conditionValue = true;
    }
    if (conditionValue) {
        let result: runtimeValue = MK_NULL();
        for (const statement of ifStmt.thenBody) {
            result = evaluate(statement, env);
        }
        return result;
    } else if (ifStmt.elseBody) {
        let result: runtimeValue = MK_NULL();
        for (const statement of ifStmt.elseBody) {
            result = evaluate(statement, env);
        }
        return result;
    }
    
    return MK_NULL();
}

export function evaluateForStatement(forStmt: ForStatement, env: Environment): runtimeValue {
    const forEnv = new Environment(env);
    if (forStmt.init) {
        evaluate(forStmt.init, forEnv);
    }
    let result: runtimeValue = MK_NULL();
    
    while (true) {
        if (forStmt.condition) {
            const condition = evaluate(forStmt.condition, forEnv);
            let conditionValue = false;
            if (condition.type === "boolean") {
                conditionValue = (condition as BooleanValue).value;
            } else if (condition.type === "number") {
                conditionValue = (condition as any).value !== 0;
            } else if (condition.type === "string") {
                conditionValue = (condition as any).value !== "";
            } else if (condition.type === "null") {
                conditionValue = false;
            } else {
                conditionValue = true;
            }
            
            if (!conditionValue) {
                break;
            }
        } else {
            //if no condition is provided, we assume the loop should run indefinitely
            //this is usually not desired, so we can warn and break to prevent infinite loops
            console.warn("Trio warning: For loop without condition detected. Breaking to prevent infinite loop.");
            break;
        }
        
        for (const statement of forStmt.body) {
            result = evaluate(statement, forEnv);
        }
        
        if (forStmt.increment) {
            evaluate(forStmt.increment, forEnv);
        }
        if (!forStmt.condition) {
            console.warn("Trio warning: For loop without condition detected. Breaking to prevent infinite loop.");
            break;
        }
    }
    
    return result;
}