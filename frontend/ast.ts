export type NodeType = "Program" | "VariableDeclaration" | "FunctionDeclaration" | "NumericLiteral" | "PropertyLiteral" | "ObjectLiteral" | "StringLiteral" | "Identifier" | "BinaryExpr" | "AssignmentExpr" | "MemberExpr" | "CallExpr" |"NewExpr";
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
export interface FunctionDeclaration extends Stemt {
    kind: "FunctionDeclaration";
    parameters: string[];
    name: string;
    body: Stemt;
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
//foo.bar()
//foo["bar"]() coumputed is true
export interface MemberExpr extends Expr {
    kind: "MemberExpr";
    object: Expr;
    property: Expr;
    computed: boolean;
}
export interface CallExpr extends Expr {
    kind: "CallExpr";
    callee: Expr;
    args: Expr[];
}
export interface NewExpr extends Expr {
    kind: "NewExpr";
    callee: Expr;
    args: Expr[];
}
export interface Identifier extends Expr {
    kind: "Identifier";
    symbol: string;
}
export interface NumericLiteral extends Expr {
    kind: "NumericLiteral";
    value: number;
}
export interface PropertyLiteral extends Expr {
    kind: "PropertyLiteral";
    key: string;
    value?: Expr;
}
export interface ObjectLiteral extends Expr {
    kind: "ObjectLiteral";
    properties: PropertyLiteral[];
}
export interface StringLiteral extends Expr {
    kind: "StringLiteral";
    value: string;
}