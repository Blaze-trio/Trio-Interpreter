import { ValueType } from '../runtime/value.ts';
import { Stemt,Program, Expr, BinaryExpr, Identifier, NumericLiteral, VariableDeclaration, AssignmentExpr, PropertyLiteral, ObjectLiteral} from './ast.ts';
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
    private parse_variable_declaration(): Stemt {
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
        return this.parse_assignment_expr();
    }
    //let x = foo + bar;
    private parse_assignment_expr(): Expr {
        const left = this.parse_object_expr();//maybe objectExpr, function call, etc.
        if(this.at().type == TokenType.Equals) {
            this.eats();
            const right = this.parse_assignment_expr();//alows chaning the value of a variable
            return {kind: "AssignmentExpr",assignee: left,value: right,} as AssignmentExpr;
        }
        return left;
    }
    private parse_object_expr(): Expr {
        if (this.at().type !== TokenType.OpenBrace) {
        return this.parse_additive_expr();
        }

        this.eats(); 
        const properties = new Array<PropertyLiteral>();

        while (this.not_eof() && this.at().type != TokenType.CloseBrace) {
            const key = this.expect(TokenType.Identifier, "Trio found unexpected token, expected identifier").value;
            if (this.at().type == TokenType.Comma) {
                this.eats(); // advance past comma
                properties.push({ key, kind: "PropertyLiteral" } as PropertyLiteral);
                continue;
            } //{ key }
            else if (this.at().type == TokenType.CloseBrace) {
                properties.push({ key, kind: "PropertyLiteral" } as PropertyLiteral);
                continue;
            }
            //{ key: val }
            this.expect(TokenType.Colon,"Trio found unexpected token, expected colon after property key",);
            const value = this.parse_expr();

            properties.push({ kind: "PropertyLiteral", value, key });
            if (this.at().type != TokenType.CloseBrace) {
                this.expect(TokenType.Comma,"Trio found unexpected token, expected comma after property",);
            }
        }
        this.expect(TokenType.CloseBrace, "Trio found unexpected token, expected closing brace '}'");
        return { kind: "ObjectLiteral", properties } as ObjectLiteral;
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
            case TokenType.OpenParen:
                this.eats();
                const expr = this.parse_expr();
                this.expect(TokenType.CloseParen, "Unexpected token, expected closing parenthesis"); //consume the ')'
                return expr;
            default:
                //trick the typescript compiler
                console.error("Unexpected token type found by trio: ", this.at());
                Deno.exit(1);
        }
    }

}