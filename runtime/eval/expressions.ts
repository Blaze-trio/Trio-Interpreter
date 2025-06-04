import { NumberValue, runtimeValue, MK_NULL, ObjectValue, NativeFunctionValue, FunctionValue, ArrayValue, StringValue, MK_BOOL, BooleanValue } from "../value.ts";
import { evaluate } from "../Interpreter.ts";
import Environment from "../environment.ts";
import { AssignmentExpr, BinaryExpr, CallExpr, Identifier, MemberExpr, NewExpr, ObjectLiteral } from "../../frontend/ast.ts";

function eval_numeric_binary_expr(lhs: NumberValue, rhs: NumberValue, operator: string): runtimeValue {
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
    }else if(operator == "<") {
        return MK_BOOL(lhs.value < rhs.value);
    }else if(operator == "=<") {
        return MK_BOOL(lhs.value <= rhs.value);
    }else if(operator == ">") {
        return MK_BOOL(lhs.value > rhs.value);
    }else if(operator == "=>") {
        return MK_BOOL(lhs.value >= rhs.value);
    }else if(operator == "==") {
        return MK_BOOL(lhs.value == rhs.value);
    }else if(operator == "===") {
        return MK_BOOL(lhs.value === rhs.value);
    }else if(operator == "=~") {
        return MK_BOOL(lhs.value !== rhs.value);
    }else{
        console.error("Trio's interpreter error: Unsupported binary operator", operator);
        Deno.exit(1);
    }
    return {type: "number", value: result} as NumberValue;
}
export function evaluateBinaryExpr(astNode: BinaryExpr, env: Environment): runtimeValue {
    const lhs = evaluate(astNode.left, env);
    const rhs = evaluate(astNode.right, env);
    if (lhs.type == "number" && rhs.type == "number") {
        return eval_numeric_binary_expr(lhs as NumberValue, rhs as NumberValue, astNode.operator);
    }
    if (lhs.type == "string" && rhs.type == "string") {
        const lhsStr = (lhs as StringValue).value;
        const rhsStr = (rhs as StringValue).value;
        if(astNode.operator == "==") {
            return MK_BOOL(lhsStr === rhsStr);
        }else if(astNode.operator == "=~") {
            return MK_BOOL(lhsStr !== rhsStr);
        }
    }
    if (lhs.type == "boolean" && rhs.type == "boolean") {
        const lhsBool = (lhs as BooleanValue).value;
        const rhsBool = (rhs as BooleanValue).value;
        if(astNode.operator == "==") {
            return MK_BOOL(lhsBool === rhsBool);
        }else if(astNode.operator == "=~") {
            return MK_BOOL(lhsBool !== rhsBool);
        }
    }
    return MK_NULL();
}

export function eval_identifier(astNode: Identifier, env: Environment): runtimeValue {
    const value = env.lookupVariable(astNode.symbol);
    return value || MK_NULL();
}

export function eval_assignment_expr(astNode: AssignmentExpr, env: Environment): runtimeValue {
    if (astNode.assignee.kind === "Identifier") {
        const identifier = (astNode.assignee as Identifier).symbol;
        return env.assignVariable(identifier, evaluate(astNode.value, env));
    } else if (astNode.assignee.kind === "MemberExpr") {
        const memberExpr = astNode.assignee as MemberExpr;
        const object = evaluate(memberExpr.object, env);
        
        if (object.type === "array" && memberExpr.computed) {
            const arrayObj = object as ArrayValue;
            const index = evaluate(memberExpr.property, env);
            
            if (index.type !== "number") {
                throw "Trio's interpreter error: Array index must be a number";
            }
            
            const idx = (index as NumberValue).value;
            if (idx < 1 || idx > arrayObj.size) {
                throw `Trio's interpreter error: Array index ${idx} out of bounds. Array indices start from 1 and end at ${arrayObj.size}`;
            }
            
            const value = evaluate(astNode.value, env);
            arrayObj.elements[idx - 1] = value; // Convert to 0-based indexing
            return value;
        }
    }
    
    throw 'Trio\'s interpreter error: Invalid assignment target';
}

export function eval_object_expr(astNode: ObjectLiteral, env: Environment): runtimeValue {
  const object = { type: "object", properties: new Map() } as ObjectValue;
  for (const { key, value } of astNode.properties) {
    const runtimeVal = (value == undefined)
      ? env.lookupVariable(key)
      : evaluate(value, env);

    object.properties.set(key, runtimeVal);
  }

  return object;
}
export function eval_new_expr(astNode: NewExpr, env: Environment): runtimeValue {
    const constructor = evaluate(astNode.callee, env);
    const args = astNode.args.map(arg => evaluate(arg, env));
    if (constructor.type === "nativefunction") {
        const nativeFunc = constructor as NativeFunctionValue;
        return nativeFunc.call(args, env);
    }
    throw "Trio's interpreter error: Invalid constructor in new expression";
}
export function eval_member_expr(astNode: MemberExpr, env: Environment): runtimeValue {
    const object = evaluate(astNode.object, env);
    
    if (object.type === "array") {
        const arrayObj = object as ArrayValue;
        
        if (astNode.computed) {
            // arr[index] syntax
            const index = evaluate(astNode.property, env);
            if (index.type !== "number") {
                throw "Trio's interpreter error: Array index must be a number";
            }
            
            const idx = (index as NumberValue).value;
            if (idx < 1 || idx > arrayObj.size) {
                throw `Trio's interpreter error: Array index ${idx} out of bounds. Array indices start from 1 and end at ${arrayObj.size}`;
            }
            
            return arrayObj.elements[idx - 1]; // Convert to 0-based indexing
        } else {
            // arr.property syntax (like arr.size)
            if (astNode.property.kind === "Identifier") {
                const prop = (astNode.property as Identifier).symbol;
                if (prop === "size") {
                    return { type: "number", value: arrayObj.size } as NumberValue;
                }
            }
        }
    }
    
    if (object.type === "object") {
        const obj = object as ObjectValue;
        let property: runtimeValue;
        
        if (astNode.computed) {
            property = evaluate(astNode.property, env);
        } else {
            if (astNode.property.kind !== "Identifier") {
                throw "Trio's interpreter error: Non-computed member access requires identifier";
            }
            property = { type: "string", value: (astNode.property as Identifier).symbol } as StringValue;
        }
        
        if (property.type === "string") {
            return obj.properties.get((property as StringValue).value) || MK_NULL();
        }
    }
    
    return MK_NULL();
}

export function eval_call_expr(astNode: CallExpr, env: Environment): runtimeValue {
  const args = astNode.args.map((arg) => evaluate(arg, env));
  const func = evaluate(astNode.callee, env);
  if(func.type == "nativefunction") {
     const result = (func as NativeFunctionValue).call(args, env);
     return result;
  }
  if(func.type == "function") {
    const userfunction = func as FunctionValue;
    const scope = new Environment(userfunction.declarationEnv);
    //create the varables for the parameters list
    for(let i = 0; i < userfunction.parameters.length; i++) {
        //TODO: check the bounds here 
        //verify the arity of the function
        const varname = userfunction.parameters[i];
        scope.declareVariable(varname, args[i], false);
    }
    let result: runtimeValue = MK_NULL();
    //evaluate the TrioFunc body line by line
    for(const statement of userfunction.body) {
        result = evaluate(statement, scope);
    }
    return result;
  }
  throw 'Trio\'s interpreter error: Call expression must be a function or native function, got ' + func.type;
}
