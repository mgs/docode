#!/usr/bin/env node
console.log("hello world");

var arg1 = process.argv[2];
console.log(process.argv);

if (arg1 == 'build') {
 console.log("hello arg 1");
}
