import { ValueType } from '../runtime/value.ts';
import { Stemt,Program, Expr, BinaryExpr, Identifier, NumericLiteral, VariableDeclaration} from './ast.ts';
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
    private expect(type: TokenType, message: any){
        const prev = this.tokens.shift() as Token;
        if (!prev || prev.type != type) {
            console.error("TrioParser error: \n", message, prev, "Trio expects token type: ", type);
            Deno.exit(1);
        }
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
        switch(this.at().type) {
            case TokenType.Let:
            case TokenType.Const:
                return this.parse_variable_declaration();
            default:
                return this.parse_expr();
        }
    }
    //let or const
    parse_variable_declaration(): Stemt {
        const isConst = this.eats().type == TokenType.Const;
        const identifier = this.expect(TokenType.Identifier, "Trio found unexpected token, expected identifier").value;
        if(this.at().type == TokenType.SemiColon) {
            this.eats(); //consume the ';'
            if(isConst){
                throw "Trio cannot declare constant variable without value";
            }
            return {kind: "VariableDeclaration", const: false, value: undefined, identifier} as VariableDeclaration;
        }
        this.expect(TokenType.Equals, "Trio found unexpected token, expected '=' after variable declaration");
        const declaration = {kind: "VariableDeclaration", const: isConst, value: this.parse_expr(), identifier} as VariableDeclaration;
        this.expect(TokenType.SemiColon, "Trio's variable declaration statement must end with semicolon.");
        return declaration;
    }
    private parse_expr(): Expr {
        return this.parse_additive_expr();
    }
    // 10 + 5 - 5 left hand is more important
    private parse_additive_expr(): Expr {
        let left = this.parse_multiplicative_expr();
        while(this.at().value == '+' || this.at().value == '-'){
            const operator = this.eats().value;
            const right = this.parse_multiplicative_expr();
            left = {
                kind: "BinaryExpr",
                left,
                right,
                operator,
            } as BinaryExpr;
        }
        return left;
    }
    private parse_multiplicative_expr(): Expr {
        let left = this.parse_primary_expr();
        while(this.at().value == '/' || this.at().value == '*' || this.at().value == '%'){
            const operator = this.eats().value;
            const right = this.parse_primary_expr();
            left = {
                kind: "BinaryExpr",
                left,
                right,
                operator,
            } as BinaryExpr;
        }
        return left;
    }
    //order of precedence:
    // AssignmentExpr
    // MemberExpr
    // FunctionCall
    // LogicalExpr
    // ComparisonExpr
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
            case TokenType.OpenPaeren:
                this.eats();
                const expr = this.parse_expr();
                this.expect(TokenType.ClosePaerenn, "Unexpected token, expected closing parenthesis"); //consume the ')'
                return expr;
            default:
                //trick the typescript compiler
                console.error("Unexpected token type found by trio: ", this.at());
                Deno.exit(1);
        }
    }

}