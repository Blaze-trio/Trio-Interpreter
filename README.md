Trio Programming Language Documentation
Table of Contents
Overview
Basic Syntax
Variables
Data Types
String Literals
Arrays
Objects
Control Flow
Operators
Built-in Functions
Examples
Overview
Trio is a custom programming language with a simple syntax designed for educational purposes. It features variables, arrays, objects, control flow statements, and built-in functions. The language uses a prefix notation for its keywords (e.g., TrioLet, TrioPrint).

Basic Syntax
Statements end with semicolons (;) not everytime
Code blocks are enclosed in curly braces ({})
Comments are not currently supported in the lexer because they are overkill
Case-sensitive language
Variables
Variable Declaration
TrioLet variableName = value;
TrioConst constantName = value;
TrioLet declares a mutable variable
TrioConst declares an immutable constant
Constants must be initialized with a value
Examples:
TrioLet trio = 42;
TrioLet name = "Trio";
TrioConst PI = 3;
we decided that x is a recerved value of 0 since programes use it alot 
Variable Assignment
variableName = newValue
we decided that semicolons are just for some parts of our language 
Example:
TrioLet counter = 0;
counter = counter + 1
Data Types
Trio supports the following data types:

Number: Integer and floating-point numbers
String: Text enclosed in quotes
Boolean: true or false
Array: Ordered collection of elements
Object: Key-value pairs
Null: Represents absence of value
String Literals
Trio supports multiple string literal formats:
TrioLet simple = "hello world";      
TrioLet single = 'hello world';      
TrioLet double = ""hello world"";      
TrioLet triple = '''hello world''';   
TrioLet mixed = ""'complex string'"";   
TrioLet mega = """"""hello world''''''"""""";
Arrays
Array Creation
TrioLet arrayName = TrioNew TrioArray(size);
Array Access and Assignment
Arrays use 1-based indexing (not 0-based)
Access elements with array[index]
Get array size with array.size
Examples:
TrioLet arr = TrioNew TrioArray(4);
arr[1] = "Hello";
arr[2] = 42;
arr[3] = true;
arr[4] = TrioNew TrioArray(2); 

TrioPrint(arr[1]);   
TrioPrint(arr.size); 
Objects
Object Creation
TrioLet objectName = {
    key1: value1,
    key2: value2,
    key3
};
Object Access
objectName.propertyName      
objectName["propertyName"]   
Control Flow
If Statements
TrioIf (condition) {
 
} TrioElse {

}
Example:
TrioLet y = 5;
TrioIf (y > 3) {
    TrioPrint("y is greater than 3");
} TrioElse {
    TrioPrint("y is not greater than 3");
}
For Loops
TrioFor (initialization; condition; increment) {
  
}
Example:
TrioFor (TrioLet i = 0; i < 5; i = i + 1) {
    TrioPrint(i);
}
Operators
Arithmetic Operators
+ Addition
- Subtraction
* Multiplication
/ Division
% Modulo
Comparison Operators
< Less than
=< Less than or equal to
> Greater than
=> Greater than or equal to
== Equal to
=== Strict equal to
=~ Not equal to
Assignment Operator
= Assignment
Built-in Functions
TrioPrint
Outputs values to the console.
TrioPrint(value1, value2, ...);
TrioTime
Returns the current timestamp.
TrioLet currentTime = TrioTime();
TrioArray
Creates a new array with the specified size.
TrioLet myArray = TrioNew TrioArray(size);
Examples
Complete Program Example
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

// Loop example
TrioFor (TrioLet i = 1; i <= numbers.size; i = i + 1) {
    TrioPrint("Element", i, ":", numbers[i]);
}
Object Example
TrioLet person = {
    name: "Trio",
    age: 25,
    city: "Trio Republic"
};

TrioPrint("Name:", person.name);
TrioPrint("Age:", person["age"]);
Language Features Summary
Interpreted Language: Trio code is parsed and executed by the Trio interpreter
Dynamic Typing: Variables can hold values of different types
1-based Array Indexing: Arrays start from index 1, not 0
Prefix Keywords: All language keywords start with "Trio"
Simple Syntax: Easy to learn and understand
Expression Evaluation: Supports complex expressions with proper operator precedence










