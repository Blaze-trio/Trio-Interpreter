export type NodeType = "Program" | "VariableDeclaration" | "NumericLiteral" | "Identifier" | "BinaryExpr" | "AssignmentExpr";
export interface Stemt{
    kind: NodeType;
}
export interface Program extends Stemt {
    kind: "Program";
    body: Stemt[];
}
export interface VariableDeclaration extends Stemt {
    kind: "VariableDeclaration";
    const: boolean;
    identifier: string;
    value?: Expr;
}
export interface Expr extends Stemt {}
//let x = {foo: 1, bar: 2};
//x.foo = foobar; so that is why we need assignee is Expr
export interface AssignmentExpr extends Expr {
    kind: "AssignmentExpr";
    assignee: Expr;
    value: Expr;
}
export interface BinaryExpr extends Expr {
    left : Expr;
    right: Expr;
    operator: string;
}
export interface Identifier extends Expr {
    kind: "Identifier";
    symbol: string;
}
export interface NumericLiteral extends Expr {
    kind: "NumericLiteral";
    value: number;
}