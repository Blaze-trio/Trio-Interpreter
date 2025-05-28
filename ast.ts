export type NodeType = "Program" | "NumericLiteral" | "Identifier" | "BinaryExpr";
export interface Stemt{
    kind: NodeType;
}
export interface Program extends Stemt {
    kind: "Program";
    body: Stemt[];
}
export interface Expr extends Stemt {}
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
