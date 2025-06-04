import { ValueType } from '../runtime/value.ts';
import { Stemt,Program, Expr, BinaryExpr, Identifier, NumericLiteral, VariableDeclaration, FunctionDeclaration, AssignmentExpr, PropertyLiteral, ObjectLiteral, CallExpr, MemberExpr, StringLiteral, NewExpr, IfStatement, ForStatement} from './ast.ts';
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
    private parse_new_expr(): NewExpr {
        this.eats(); //consume 'TrioNew'
        const callee = this.parse_primary_expr();
        if(this.at().type !== TokenType.OpenParen) {
            throw "Trio Parser: Expected opening parenthesis '(' after constructor name in new expression";
        }
        const args = this.parse_args();
        return {
            kind: "NewExpr",
            callee,
            args,
        } as NewExpr;
    }
    private parse_string_literal(): StringLiteral {
        while (this.not_eof() && this.at().type === TokenType.Quote) {
            this.eats();
        } 
        console.log("Trio Debug: Parsing string literal");
        const contentTokens: Token[] = [];
        let foundClosing = false;
        while (this.not_eof()) {
            if( this.at().type === TokenType.Quote) {
                foundClosing = true;
                this.eats();
                break; 
            }
            contentTokens.push(this.eats());
        }
        if (!foundClosing) {
           throw "Trio Parser: Unterminated string literal. Expected closing quotes"
        }
        while( this.not_eof() && this.at().type === TokenType.Quote) {
            this.eats();
        }
        const stringContent = this.tokens_to_string(contentTokens);
        console.log(`Trio Debug: Final string content: "${stringContent}"`);
        
        return {
            kind: "StringLiteral",
            value: stringContent
        } as StringLiteral;
    }
    private tokens_to_string(tokens: Token[]): string {
        let result = "";
        let i = 0;
        while (i < tokens.length) {
            const token = tokens[i];
            //handle escape sequences
            if (token.type === TokenType.BinaryOperator && token.value === '/' && 
                i + 1 < tokens.length && tokens[i + 1].value === '/') {
                //skip comments if any got through
                while (i < tokens.length && tokens[i].type !== TokenType.EOF) {
                    i++;
                }
                continue;
            }
            //handle escape backslash
            if (token.value === '\\' && i + 1 < tokens.length) {
                i++;
                const nextToken = tokens[i];
                switch (nextToken.value) {
                    case 'n': result += '\n'; break;
                    case 't': result += '\t'; break;
                    case 'r': result += '\r'; break;
                    case '\\': result += '\\'; break;
                    case '"': result += '"'; break;
                    case "'": result += "'"; break;
                    default: 
                        result += nextToken.value;
                }
            } else {
                if (token.type === TokenType.Identifier || token.type === TokenType.Number) {
                    result += token.value;
                    if (i + 1 < tokens.length && (tokens[i + 1].type === TokenType.Identifier || tokens[i + 1].type === TokenType.Number)) {
                        result += " ";
                    }
                } else {
                    result += token.value;
                }
            }
            i++;
        }
        return result;
    }

    private parse_stemt(): Stemt{
        switch(this.at().type) {
            case TokenType.Let:
            case TokenType.Const:
                return this.parse_variable_declaration();
            case TokenType.Fn:
                return this.parse_function_declaration();
            case TokenType.If:
                return this.parse_if_statement();
            case TokenType.For:
                return this.parse_for_statement();
            default:
                return this.parse_expr();
        }
    }
    private parse_for_statement(): ForStatement {
        this.eats(); //consume 'TrioFor'
        this.expect(TokenType.OpenParen, "Trio found unexpected token, expected opening parenthesis '(' after TrioFor");
        let init: Stemt | undefined = undefined;
        if (this.at().type !== TokenType.SemiColon) {
            if (this.at().type === TokenType.Let || this.at().type === TokenType.Const) {
                init = this.parse_variable_declaration();
            } else {
                init = this.parse_expr();
                this.expect(TokenType.SemiColon, "Trio found unexpected token, expected ';' after TrioFor init");
            }
        } else {
            this.eats();
        }
        let condition: Expr | undefined = undefined;
        if (this.at().type !== TokenType.SemiColon) {
            condition = this.parse_expr();
        }
        this.expect(TokenType.SemiColon, "Trio found unexpected token, expected semicolon ';' after TrioFor condition");
        let increment: Expr | undefined = undefined;
        if (this.at().type !== TokenType.CloseParen) {
            increment = this.parse_expr();
        }
        this.expect(TokenType.CloseParen, "Trio found unexpected token, expected closing parenthesis ')' after TrioFor increment");
        const body = this.parse_block_or_statement();
        return {
            kind: "ForStatement",
            init,
            condition,
            increment,
            body: body,
        } as ForStatement;
    }
    private parse_if_statement(): IfStatement {
        this.eats(); //consume 'TrioIf'
        this.expect(TokenType.OpenParen, "Trio found unexpected token, expected opening parenthesis '(' after TrioIf");
        const condition = this.parse_expr();
        this.expect(TokenType.CloseParen, "Trio found unexpected token, expected closing parenthesis ')' after TrioIf condition");
        const thenBody = this.parse_block_or_statement();
        let elseBody: Stemt[] | undefined = undefined;
        if (this.at().type === TokenType.Else) {
            this.eats(); //consume 'TrioElse'
            elseBody = this.parse_block_or_statement();
        }
        return {
            kind: "IfStatement",
            condition,
            thenBody,
            elseBody,
        } as IfStatement;
    }
    private parse_block_or_statement(): Stemt[] {
        if (this.at().type === TokenType.OpenBrace) {
            this.eats(); // consume '{'
            const statements: Stemt[] = [];
            while (this.not_eof() && this.at().type !== TokenType.CloseBrace) {
                statements.push(this.parse_stemt());
            }
            this.expect(TokenType.CloseBrace, "Trio found unexpected token, expected closing brace '}' after block");
            return statements;
        } else {
            return [this.parse_stemt()];
        }
    }
    private parse_function_declaration(): FunctionDeclaration {
        this.eats();
        const name = this.expect(TokenType.Identifier, "Trio found unexpected token, expected function name after TrioFunc declaration").value;
        const args = this.parse_args();
        const parameters: string[] = [];
        for (const arg of args) {
            if (arg.kind !== "Identifier") {
                throw "Trio function declaration error: Expected argument to be an identifier inside TrioFunc declaration";
            }
            parameters.push((arg as Identifier).symbol);
        }
        this.expect(TokenType.OpenBrace, "Trio found unexpected token, expected opening brace '{' after TrioFunc arguments");
        const body: Stemt[] = [];
        while(this.at().type !== TokenType.EOF && this.at().type !== TokenType.CloseBrace) {
            body.push(this.parse_stemt());
        }
        this.expect(TokenType.CloseBrace, "Trio found unexpected token, expected closing brace '}' after TrioFunc body");
        const fn = {
            kind: "FunctionDeclaration",
            name,
            parameters: parameters,
            body: {
                kind: "Program",
                body,
            },
        } as FunctionDeclaration;
        return fn;
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
        return this.parse_comparison_expr();
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

    private parse_comparison_expr(): Expr {
        console.log("Trio Debug: Parsing comparison expression");
        let left = this.parse_additive_expr();
        while(this.at().type === TokenType.ComparisonOperator){
            const operator = this.eats().value;
            const right = this.parse_additive_expr();
            left = {
                kind: "BinaryExpr",
                left,
                right,
                operator,
            } as BinaryExpr;
        }
        return left;
    }
    // 10 + 5 - 5 left hand is more important
    private parse_additive_expr(): Expr {
        console.log("Trio Debug: Parsing additive expression");
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
        console.log("Trio Debug: Parsing multiplicative expression");
        let left = this.parse_call_member_expr();
        while(this.at().value == '/' || this.at().value == '*' || this.at().value == '%'){
            const operator = this.eats().value;
            const right = this.parse_call_member_expr();
            left = {
                kind: "BinaryExpr",
                left,
                right,
                operator,
            } as BinaryExpr;
        }
        return left;
    }
    //foo.x()()
    private parse_call_member_expr(): Expr {
        console.log("Trio Debug: Parsing call/member expression");
        const member = this.parse_member_expr();
        if(this.at().type == TokenType.OpenParen) {
            return this.parse_call_expr(member);
        }else{
            return member;
        }
    }
    private parse_call_expr(caller: Expr): Expr {
        console.log("Trio Debug: Parsing call expression");
        let call_expr: Expr = {
        kind: "CallExpr",
        callee: caller,
        args: this.parse_args(),
        } as CallExpr;
        if (this.at().type == TokenType.OpenParen) {
        call_expr = this.parse_call_expr(call_expr);
        }
        return call_expr;
    }
    //add(x + 5,foo) expression is parsed as arguments
    private parse_args(): Expr[] {
        console.log("Trio Debug: Parsing function arguments");
        this.expect(TokenType.OpenParen, "Trio found unexpected token, expected opening parenthesis '(' for function call before arguments");
        const args = this.at().type == TokenType.CloseParen ? [] : this.parse_arguments_list();
        this.expect(TokenType.CloseParen, "Trio found unexpected token, expected closing parenthesis ')' for function call after arguments");
        return args;
    }
    //foo(x=5, y=10) so we can assign values to arguments
    private parse_arguments_list(): Expr[] {
        const args = [this.parse_assignment_expr()];
        while(this.not_eof() && this.at().type == TokenType.Comma && this.eats()) {
            args.push(this.parse_assignment_expr());
        }
        return args;
    }
    private parse_member_expr(): Expr {
        let object = this.parse_primary_expr();
        while (this.at().type == TokenType.Dot || this.at().type == TokenType.OpenBracket) {
            const operator = this.eats();
            let property: Expr;
            let computed: boolean;
            //non-computed value obj.expr
            if(operator.type == TokenType.Dot){
                computed = false;
                property = this.parse_primary_expr();
                if (property.kind !== "Identifier") {
                    throw "Trio's member expression error: Expected identifier after dot operator.";
                }
            }else{//alows obj["expr"]
                computed = true;
                property = this.parse_expr();
                this.expect(TokenType.CloseBracket, "Trio found unexpected token, expected closing bracket ']' after computed property access");
            }
            object = {kind: "MemberExpr", object, property, computed} as MemberExpr;
        }
        return object;
    }
    //order of precedence:
    // AssignmentExpr
    // ObjectExpr
    // LogicalExpr
    // ComparisonExpr
    // AdditiveExpr 
    // MultiplicativeExpr
    // CallExpr
    // MemberExpr
    // PrimaryExpr
    private parse_primary_expr(): Expr {
        const tk = this.at().type;
        switch (tk) {
            case TokenType.Identifier: 
                return {kind: "Identifier", symbol: this.eats().value} as Identifier;
            case TokenType.Number:
                return {kind: "NumericLiteral", value: parseFloat(this.eats().value)} as NumericLiteral;
            case TokenType.Quote:
                return this.parse_string_literal();
            case TokenType.New:
                return this.parse_new_expr();
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