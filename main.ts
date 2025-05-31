import Parser from "./frontend/parser.ts";
import { evaluate } from "./runtime/Interpreter.ts";

repl();
async function repl() {
    const parser = new Parser();
    console.log("Repl V0.1");
    while (true) {
        const  input = prompt("trio> ");
        if(!input||input.includes("exit") || input.includes("quit")) {
            console.log("Exiting TRIO'S REPL...");
            Deno.exit(1);
        }
        const program = parser.produceAST(input);
        //console.log(program);
        const result = evaluate(program);
        console.log(result);
        console.log("Type 'exit' or 'quit' to exit the TRIO'S REPL.");
    }
}
