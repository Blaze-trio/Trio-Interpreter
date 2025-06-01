import { runtimeValue } from "./value.ts";

export default class Environment{
    private parent?: Environment;
    private variables: Map<string, runtimeValue>;
    private constants: Set<string>;
    constructor(parent?: Environment) {
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