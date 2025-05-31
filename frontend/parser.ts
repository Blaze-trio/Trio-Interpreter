import { Stemt,Program, Expr, BinaryExpr, Identifier, NumericLiteral } from './ast.ts';
import { Token,tokenize,TokenType } from './lexer.ts';

export default class Parser {
    private tokens: Token[];
    private not_eof(): boolean {
        return this.tokens.length > 0 && this.tokens[0].type != TokenType.EOF;
    }
    private at(){
        return this.tokens[0] as Token;
    }
    private eats(){
        const prev = this.tokens.shift() as Token;
        return prev;
    }
    public produceAST(sourceCode: string): Program {
        this.tokens = tokenize(sourceCode);
        const program: Program = {
            kind: "Program",
            body: [],
        };

        while (this.not_eof()){
            program.body.push(this.parse_stemt());
        }
        return program;
    }
    private parse_stemt(): Stemt{
        return this.parse_expr();
    }
    private parse_expr(): Expr {
        return this.parse_primary_expr();
    }
    //order of precedence:
    // AdditiveExpr
    // MultiplicativeExpr
    // UniaryExpr
    // PrimaryExpr
    private parse_primary_expr(): Expr {
        const tk = this.at().type;
        switch (tk) {
            case TokenType.Identifier: 
                return {kind: "Identifier", symbol: this.eats().value} as Identifier;
            case TokenType.Number:
                return {kind: "NumericLiteral", value: parseFloat(this.eats().value)} as NumericLiteral;
            default:
                //trick the typescript compiler
                console.error("Unexpected token type found by trio: ", this.at());
                Deno.exit(1);
        }
    }

}