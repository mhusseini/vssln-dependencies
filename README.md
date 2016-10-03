# vssln-dependencies
Creates an ordered list of projects from the projects dependency graph in a Visual Studio Solution (sln) file.

## Installation
Install package with NPM and add it to your development dependencies:

`npm install vssln-dependencies --save-dev`

## Usage
### From [VsSolutionFile](https://github.com/mhusseini/vssln-parser/blob/master/src/solution-items/VsSolutionFile.ts)
```typescript
var sortProjects = require("vssln-dependencies").sortProjects;

const solution: VsSolutionFile; // Get this from external code.
const sortedProjects = sortProjects(solution);

const projectNames = sortedProjects.map(p => p.name);
console.log(projectNames);
```

### From stream
```typescript
var sortProjects = require("vssln-dependencies").sortProjects;
var fs = require("fs");

const stream = fs.createReadStream("test.sln");
sortProjects(stream, sortedProjects => {
    const projectNames = sortedProjects.map(p => p.name);
    console.log(projectNames);
});
```

### From file
```typescript
var sortProjects = require("vssln-dependencies").sortProjects;

sortProjects("test.sln", sortedProjects => {
    const projectNames = sortedProjects.map(p => p.name);
    console.log(projectNames);
});
```

### From [VsSolutionFile](https://github.com/mhusseini/vssln-parser/blob/master/src/solution-items/VsSolutionFile.ts) - complete example
```typescript
var sortProjects = require("vssln-dependencies").sortProjects;
var parse = require("vssln-parser").parse;
var fs = require("fs");

const stream = fs.createReadStream("test.sln");
parse(stream, solution => {
    const sortedProjects = sortProjects(solution);
    const projectNames = sortedProjects.map(p => p.name);
    console.log(projectNames);
});
```


## License
[MIT License](http://en.wikipedia.org/wiki/MIT_License)