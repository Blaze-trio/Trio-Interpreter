import Parser from "./frontend/parser.ts";
import Environment from "./runtime/environment.ts";
import { evaluate } from "./runtime/Interpreter.ts";
import { NumberValue, MK_NUMBER,MK_NULL,MK_BOOL } from "./runtime/value.ts";

repl();
async function repl() {
    const parser = new Parser();
    const env = new Environment();
    env.declareVariable("x", MK_NUMBER(100), false);
    env.declareVariable("true", MK_BOOL(true), true);
    env.declareVariable("false", MK_BOOL(false), true);
    env.declareVariable("null", MK_NULL(), true);
    console.log("Repl V0.1");
    while (true) {
        const  input = prompt("Trio>");
        if(!input||input.includes("exit") || input.includes("quit")) {
            console.log("Exiting TRIO'S REPL...");
            Deno.exit(1);
        }
        const program = parser.produceAST(input);
        //console.log(program);
        const result = evaluate(program, env);
        console.log(result);
        console.log("Type 'exit' or 'quit' to exit the TRIO'S REPL.");
    }
}
