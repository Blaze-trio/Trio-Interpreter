import { runtimeValue, MK_BOOL,MK_NULL, MK_NUMBER, MK_NATIVE_FUNCTION } from "./value.ts";
export function createGlobalEnvironment() {
    //declare global variables and constants here my bros
    const env = new Environment();
    env.declareVariable("null", MK_NULL(), true);
    env.declareVariable("true", MK_BOOL(true), true);
    env.declareVariable("false", MK_BOOL(false), true);
    env.declareVariable("x", MK_NUMBER(0), true);
    env.declareVariable("TrioPrint", MK_NATIVE_FUNCTION((args, env) => {
        console.log("TrioPrint:", ...args);
        return MK_NULL();
    }), true);
    function timeFunction(args: runtimeValue[], env: Environment): runtimeValue {
        return MK_NUMBER(Date.now());
    }
    env.declareVariable("TrioTime", MK_NATIVE_FUNCTION(timeFunction), true);
    return env;
}
export default class Environment{
    private parent?: Environment;
    private variables: Map<string, runtimeValue>;
    private constants: Set<string>;
    constructor(parent?: Environment) {
        const global = parent ? false : true;
        this.parent = parent;
        this.variables = new Map();
        this.constants = new Set();
    }

    public declareVariable(varname: string, value: runtimeValue, constant: boolean): runtimeValue {
        //console.log("Trio's interpreter: Declaring variable", varname, "with value", value);
        if (this.variables.has(varname)) {
            throw 'Trio cannot redeclare variable "' + varname + '"';
        }
        this.variables.set(varname, value);
        if (constant) {
            this.constants.add(varname);
        }
        return value;
    }

    public assignVariable(varname: string, value: runtimeValue): runtimeValue {
        const env = this.resolveVariable(varname);
        //cannot assign to a constant variable
        if (env.constants.has(varname)) {
            throw 'Trio cannot assign to constant variable "' + varname + '"';
        }
        env.variables.set(varname, value);
        return value;
    }

    public lookupVariable(varname: string): runtimeValue {
        const env = this.resolveVariable(varname);
        if (!env.variables.has(varname)) {
            throw 'Trio cannot find variable "' + varname + '"';
        }
        return env.variables.get(varname) as runtimeValue;
    }

    public resolveVariable(varname: string): Environment {
        if(this.variables.has(varname)) {
            return this;
        }
        if(this.parent == undefined) {
            throw 'Trio cannot resolve variable "' + varname + '"';
        }
        return this.parent.resolveVariable(varname);
    }
}