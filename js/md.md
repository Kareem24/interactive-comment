# Understanding types of functions in JavaScript and their use cases

JavaScript functions are block of code that perform a specific task. They can be define and invoke in different ways from simple function declaration to more advance techniques, each approach has it pros and cons plus its use cases.We have different function declaration, but in this article, let's explore the three main types of function declaration in javascript, which are :

- Function declaration
- Function expression
- Arrow function

### Function declaration :

It is on of the most common ways to define a function in javascript. It is a statement that defines a named function with the `function` keyword, followed by the function name, list of parameter(s), and the function body

#### syntax:

```js
function sayHello(name) {
  return `hello ${name}`;
}

console.log(sayHello("john")); // hello john
```

### Function expression :

A function expression involve assigning a function declaration to a variable it is define with a `function` keyword, followed by the function name, list of parameter(s), and the function body. It is of two type

#### syntax:

- 1 Anonymous function expression

```js
const sayHello = function (name) {
  return `hello ${name}`;
  console.log(sayHello("john")); // hello john
};
```

- 2 Named function expression

```js
const sayHello = function hello(name) {
  return `hello ${name}`;
  console.log(sayHello("john")); // hello john
};
```

The `Named function expression ` has a function name while the `Anonymous function expression` has it name implies doesn't have a function name

### Arrow Function

It is introduced in `Es6`, it provide a concise syntax fir writing functions. They are particularly useful for short, single function expression

#### syntax:

```js
const sayHello = (name) => `hello ${name}`;

console.log(sayHello("john")); // hello john
```

## Differences and use cases

<ol>
  <li>

`Function declaration` are hoisted which means it can be invoke/called before it is defined

```js
//Function declaration
doSomething(); // do something
function doSomething() {
  console.log("do somethig");
} //Works fine
```

while `Function expression` are not hoisted which means it is created when execution reaches it. In a null-shell `Function expression` can't be invoke/called before declaration

```js
//Function expression

doSomething(); // Uncaught ReferenceError: Cannot access 'doSomething' before initialization
const doSomething = function () {
  console.log("do somethig");
}; //Error
```

  </li>
  <li>
  
 In <strong> `strict mode` </strong> when a `Function Declaration ` is within a code block it is only visible in the code block but not visible outside the block

```js
let age = 17;

if (age < 18) {
  function verify() {
    console.log("you're not up to a verified age ");
  }
} else {
  function verify() {
    console.log("you're not up to a verified age ");
  }
}
verify(); //ReferenceError: verify is not defined
```

while `Fuction expression` can be use later after declaration in the code block . It can be access later outside the codeblock

```js
let age = 17;
let verify;

if (age < 18) {
  verify = function () {
    console.log("you're not up to a verified age ");
  };
} else {
  verify = function () {
    console.log("you're not up to a verified age ");
  };
}
verify(); //you're not up to a verified age

//Works fine
```

  </li>
  <li>

`Arrow function` don't have <strong>this</strong> keyword so it cant be use for `constructor Function `while both` Function Declaration` and `Function Expression` have <strong>this</strong> keyword present

  </li>
  <li>

In some situation we don't want to loose the <strong>this</strong> keyword of the parent object, that is where `Arrow function` comes in handy

```js
const users = {
	tag: "developer",
	students: ["jay", "sussy", "john"],
	addTag() {
		this.students.forEach((student) => console.log(`${this.tag} ${student}`););
	},
};
users.addTag(); // developer jay
//developer sussy .....

//works fine
```

But with regular function

```js
const users = {
  tag: "developer",
  students: ["jay", "sussy", "john"],
  addTag() {
    this.students.forEach(function (student) {
      return `${this.tag} ${student}`;
    });
  },
};
users.addTag(); //undefined jay
//undefined sussy
//undefined john

//returns undefine
```

This happens because in regular function `this` keyword points to `undefine`.

  </li>
  
</ol>
