export enum TokenType{
    Number,
    Identifier,
    String,
    Quote,
    Equals,
    SemiColon, Comma, Colon, Dot,
    OpenParen,// (
    CloseParen,// )
    OpenBrace, CloseBrace, // { }
    OpenBracket, CloseBracket, // [ ]//for computed values
    BinaryOperator,
    Let,//let
    Const,
    EOF, //end of file
    Fn, //function
}
const KEYWORDS: Record<string, TokenType> = {
    "let": TokenType.Let,
    "const": TokenType.Const,
    "if": TokenType.Identifier, 
    "else": TokenType.Identifier, 
    "while": TokenType.Identifier,
    "for": TokenType.Identifier, 
    "TrioFunc": TokenType.Fn, 
};
export interface Token {
    value: string;
    type: TokenType;
}
function token(value= "", type: TokenType): Token {
    return {
        value,
        type
    };
}
function isalpha(src:string){
    return src.toUpperCase() != src.toLowerCase();
}
function isskippable(src: string) {
    return src == ' ' || src == '\n' || src == '\t' || src == '\r' || src == '\f';
}
function isInt(src: string) {
    const c = src.charCodeAt(0);
    const bounds = ['0'.charCodeAt(0),'9'.charCodeAt(0)]; // 0-9
    return c >= bounds[0] && c <= bounds[1];
}  
function isQuote(char: string): boolean {
    return char === '"' || char === "'";
} 
export function tokenize (sourceCode: string): Token[] {
    const tokens = new Array<Token>();
    const src = sourceCode.split("");
    //building the tokens
    while (src.length > 0) {
        if(src[0] == '('){
            tokens.push(token(src.shift(), TokenType.OpenParen));
        }else if(src[0] == ')'){
            tokens.push(token(src.shift(), TokenType.CloseParen));
        }else if(src[0] == '{'){
            tokens.push(token(src.shift(), TokenType.OpenBrace));
        }else if(src[0] == '}'){
            tokens.push(token(src.shift(), TokenType.CloseBrace));
        }else if(src[0] == '['){
            tokens.push(token(src.shift(), TokenType.OpenBracket));
        }else if(src[0] == ']'){
            tokens.push(token(src.shift(), TokenType.CloseBracket));
        }else if(src[0] == '+' || src[0] == '-' || src[0] == '*' || src[0] == '/' || src[0] == '%'){
            tokens.push(token(src.shift(), TokenType.BinaryOperator));
        }else if(src[0] == '='){
            tokens.push(token(src.shift(), TokenType.Equals));
        }else if(src[0] == ';'){
            tokens.push(token(src.shift(), TokenType.SemiColon));
        }else if(src[0] == ','){
            tokens.push(token(src.shift(), TokenType.Comma));
        }else if(src[0] == '.'){
            tokens.push(token(src.shift(), TokenType.Dot));
        }else if(src[0] == ':'){
            tokens.push(token(src.shift(), TokenType.Colon));
        }else if(isQuote(src[0])){
            tokens.push(token(src.shift(), TokenType.Quote));
        }else{
            //more than one character
            if(isInt(src[0])){
                let num = "";
                while(src.length > 0 && isInt(src[0])){
                    num += src.shift();
                }
                tokens.push(token(num, TokenType.Number));
            }else if(isalpha(src[0])){
                let id = "";
                while(src.length > 0 && isalpha(src[0])){
                    id += src.shift();
                }
                //check keywords
                const reserved = KEYWORDS[id];
                if(typeof reserved === "number"){
                    tokens.push(token(id, reserved));
                }else{
                    tokens.push(token(id, TokenType.Identifier));
                }
            }else if(isskippable(src[0])){//skip useless junk
                src.shift();
            }else{
                console.log("Unknown character found by trio: " + src[0]);
                Deno.exit(1);
            }
        }
    }
    tokens.push(token("", TokenType.EOF)); //end of file token
    return tokens;
}

// const source = await Deno.readTextFile("./test.txt");
// for (const token of tokenize(source)){
//     console.log(token);
// }