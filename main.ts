import Parser from "./frontend/parser.ts";
import Environment from "./runtime/environment.ts";
import { evaluate } from "./runtime/Interpreter.ts";
import { NumberValue, MK_NUMBER,MK_NULL,MK_BOOL } from "./runtime/value.ts";

run("./test.txt");
//repl();
async function repl() {
    const parser = new Parser();
    const env = new Environment();

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
async function run(filename: string){
    console.log("Running TRIO's interpreter on file:", filename);
    const parser = new Parser();
    const env = new Environment();

    const  input = await Deno.readTextFile(filename);
    const program = parser.produceAST(input);
    const result = evaluate(program, env);
    console.log(result);
}
