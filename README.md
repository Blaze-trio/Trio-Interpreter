Markdown

# Trio Programming Language Documentation  TrioScript

Welcome to the official documentation for Trio, a custom programming language designed with a simple syntax, primarily for educational purposes. Trio features variables, arrays, objects, control flow statements, and built-in functions. A distinctive feature of Trio is its use of prefix notation for keywords (e.g., `TrioLet`, `TrioPrint`).

---

## Table of Contents

* [Overview](#overview)
* [Basic Syntax](#basic-syntax)
* [Variables](#variables)
    * [Variable Declaration](#variable-declaration)
    * [Variable Assignment](#variable-assignment)
* [Data Types](#data-types)
* [String Literals](#string-literals)
* [Arrays](#arrays)
    * [Array Creation](#array-creation)
    * [Array Access and Assignment](#array-access-and-assignment)
* [Objects](#objects)
    * [Object Creation](#object-creation)
    * [Object Access](#object-access)
* [Control Flow](#control-flow)
    * [If Statements](#if-statements)
    * [For Loops](#for-loops)
* [Operators](#operators)
    * [Arithmetic Operators](#arithmetic-operators)
    * [Comparison Operators](#comparison-operators)
    * [Assignment Operator](#assignment-operator)
* [Built-in Functions](#built-in-functions)
    * [TrioPrint](#trioprint)
    * [TrioTime](#triotime)
    * [TrioArray (Constructor)](#trioarray-constructor)
* [Examples](#examples)
    * [Complete Program Example](#complete-program-example)
    * [Object Example](#object-example)
* [Language Features Summary](#language-features-summary)

---

## Overview

Trio is a custom programming language with a simple syntax designed for educational purposes. It features variables, arrays, objects, control flow statements, and built-in functions. The language uses a prefix notation for its keywords (e.g., `TrioLet`, `TrioPrint`).

---

## Basic Syntax

* Statements **sometimes** end with semicolons (`;`). The language has specific rules for where they are required.
* Code blocks are enclosed in curly braces (`{}`).
* Comments are **not currently supported** in the lexer (they were considered overkill for the current stage).
* Trio is a **case-sensitive** language.

---

## Variables

### Variable Declaration

Variables are declared using `TrioLet` for mutable variables and `TrioConst` for immutable constants.

* `TrioLet variableName = value;`
* `TrioConst constantName = value;`

**Notes:**
* `TrioLet` declares a mutable variable.
* `TrioConst` declares an immutable constant.
* Constants **must** be initialized with a value upon declaration.
* The variable name `x` is a **reserved value** and is always equal to `0`, as programs often use it.

**Examples:**
```trio
TrioLet trio = 42;
TrioLet name = "Trio";
TrioConst PI = 3; // Note: PI is a simplified version here
TrioPrint(x); // Will output 0

Variable Assignment

Values can be assigned to mutable variables (declared with TrioLet) using the assignment operator (=).

variableName = newValue

Note: Semicolons are only required for certain parts of the language, and often not for simple assignments if they are single statements.

Example:
Code snippet

TrioLet counter = 0;
counter = counter + 1

Data Types

Trio supports the following data types:

    Number: Represents both integer and floating-point numbers.
    String: A sequence of characters enclosed in quotes.
    Boolean: Can be true or false.
    Array: An ordered collection of elements.
    Object: A collection of key-value pairs.
    Null: Represents the intentional absence of any object value.

String Literals

Trio offers flexible ways to define string literals:
Code snippet

TrioLet simple = "hello world";      // Using double quotes
TrioLet single = 'hello world';      // Using single quotes
TrioLet double = ""hello world"";      // Double quotes within double quotes (escaped style)
TrioLet triple = '''hello world''';   // Triple single quotes
TrioLet mixed = ""'complex string'"";   // Mixed quotes
TrioLet mega = """"""hello world''''''""""""; // Multiple nested quotes

Arrays
Array Creation

Arrays are created using the TrioNew TrioArray() constructor, specifying the size of the array.

TrioLet arrayName = TrioNew TrioArray(size);
Array Access and Assignment

    Arrays in Trio use 1-based indexing (the first element is at index 1, not 0).
    Access elements using array[index].
    Get the size of an array using array.size.

Examples:
Code snippet

TrioLet arr = TrioNew TrioArray(4);
arr[1] = "Hello";
arr[2] = 42;
arr[3] = true;
arr[4] = TrioNew TrioArray(2); // Arrays can contain other arrays

TrioPrint(arr[1]);   // Outputs: Hello
TrioPrint(arr.size); // Outputs: 4

Objects
Object Creation

Objects are collections of key-value pairs, defined using curly braces. Keys can be defined with or without an explicit value (if without, the value is often implicitly true or handled by the interpreter).
Code snippet

TrioLet objectName = {
    key1: value1,
    key2: value2,
    key3 // Example of a key without an explicit value here
};

Example:
Code snippet

TrioLet person = {
    name: "Trio User",
    age: 30,
    isDeveloper: true
};

Object Access

Access object properties using dot notation or bracket notation.

    objectName.propertyName
    objectName["propertyName"]

Example:
Code snippet

TrioLet myObject = { title: "Trio Book", pages: 100 };
TrioPrint(myObject.title);     // Outputs: Trio Book
TrioPrint(myObject["pages"]); // Outputs: 100

Control Flow
If Statements

Conditional execution is handled by TrioIf and TrioElse statements.
Code snippet

TrioIf (condition) {
    // Code to execute if condition is true
} TrioElse {
    // Code to execute if condition is false
}

Example:
Code snippet

TrioLet y = 5;
TrioIf (y > 3) {
    TrioPrint("y is greater than 3");
} TrioElse {
    TrioPrint("y is not greater than 3");
}

For Loops

Loops can be created using the TrioFor statement.
Code snippet

TrioFor (initialization; condition; increment) {
    // Code to repeat
}

Example:
Code snippet

TrioFor (TrioLet i = 0; i < 5; i = i + 1) {
    TrioPrint(i);
}

Operators
Arithmetic Operators

    + : Addition
    - : Subtraction
    * : Multiplication
    / : Division
    % : Modulo

Comparison Operators

    < : Less than
    =< : Less than or equal to (Note: Trio uses =< not <=)
    > : Greater than
    => : Greater than or equal to (Note: Trio uses => not >=)
    == : Equal to (value comparison)
    ===: Strict equal to (value and type comparison)
    =~ : Not equal to (Note: Trio uses =~ not != or !==)

Assignment Operator

    = : Assignment

Built-in Functions
TrioPrint

Outputs one or more values to the console.

TrioPrint(value1, value2, ...);

Example:
Code snippet

TrioPrint("Hello from Trio!", 123, true);

TrioTime

Returns the current timestamp (typically as a Unix timestamp or similar numerical representation).

TrioLet currentTime = TrioTime();

Example:
Code snippet

TrioLet now = TrioTime();
TrioPrint("Current time:", now);

TrioArray (Constructor)

Creates a new array with the specified size. This is used with TrioNew.

TrioLet myArray = TrioNew TrioArray(size);

Example:
Code snippet

TrioLet data = TrioNew TrioArray(5); // Creates an array of size 5

Examples
Complete Program Example
Code snippet

// Variable declarations
TrioLet message = "Welcome to Trio!";
TrioLet count = 10;
TrioConst MAX_SIZE = 100;

// Print messages
TrioPrint(message);
TrioPrint("Count:", count);

// Array operations
TrioLet numbers = TrioNew TrioArray(3);
numbers[1] = 10;
numbers[2] = 20;
numbers[3] = 30;

// Control flow
TrioIf (count < MAX_SIZE) {
    TrioPrint("Count is within limit");
} TrioElse {
    TrioPrint("Count exceeds limit");
}

// Loop example (using 1-based indexing for Trio arrays)
TrioFor (TrioLet i = 1; i <= numbers.size; i = i + 1) {
    TrioPrint("Element", i, ":", numbers[i]);
}

Object Example
Code snippet

TrioLet person = {
    name: "Trio",
    age: 25,
    city: "Trio Republic"
};

TrioPrint("Name:", person.name);
TrioPrint("Age:", person["age"]);
TrioPrint("City:", person.city);

Language Features Summary

    Interpreted Language: Trio code is parsed and executed by the Trio interpreter.
    Dynamic Typing: Variables can hold values of different types, and their types can change during execution.
    1-based Array Indexing: Arrays start from index 1, not 0. This is a key distinction from many other languages.
    Prefix Keywords: All language-specific keywords start with "Trio" (e.g., TrioLet, TrioIf, TrioPrint).
    Simple Syntax: Designed to be easy to learn and understand, especially for educational purposes.
    Expression Evaluation: Supports complex expressions with proper operator precedence.
