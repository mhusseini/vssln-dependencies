# vssln-dependencies
Creates an ordered list of projects from the projects dependency graph in a Visual Studio Solution (sln) file.

Dependencies are resolved using the information created by the "Project Dependencies" tab in the "Solution Properties" window of Visual Studio. Project references set using the "References" item inside each project are not considered.

## Installation
Install package with NPM and add it to your development dependencies:

`npm install vssln-dependencies --save-dev`

## Usage
### From [VsSolutionFile](https://github.com/mhusseini/vssln-parser/blob/master/src/solution-items/VsSolutionFile.ts)
```typescript
var dependencies = require("vssln-dependencies");

const solution: VsSolutionFile; // Get this from external code.
const sortedProjects = dependencies.fromSolution(solution);

const projectNames = sortedProjects.map(p => p.name);
console.log(projectNames);
```

### From stream
```typescript
var dependencies = require("vssln-dependencies");
var fs = require("fs");

const stream = fs.createReadStream("test.sln");
dependencies.fromStream(stream, sortedProjects => {
    const projectNames = sortedProjects.map(p => p.name);
    console.log(projectNames);
});
```

### From file
```typescript
var dependencies = require("vssln-dependencies");

dependencies.fromFile("test.sln", sortedProjects => {
    const projectNames = sortedProjects.map(p => p.name);
    console.log(projectNames);
});
```

### From string
```typescript
var dependencies = require("vssln-dependencies");
var fs = require(fs);

const text = fs.readFileSync("test.sln", "utf-8");
const sortedProjects = dependencies.fromString(text,);

const projectNames = sortedProjects.map(p => p.name);
console.log(projectNames);
```

### From [VsSolutionFile](https://github.com/mhusseini/vssln-parser/blob/master/src/solution-items/VsSolutionFile.ts) - complete example
```typescript
var dependencies = require("vssln-dependencies");
var parse = require("vssln-parser").parse;
var fs = require("fs");

const stream = fs.createReadStream("test.sln");
parse(stream, solution => {
    const sortedProjects = dependencies.fromSolution(solution);
    const projectNames = sortedProjects.map(p => p.name);
    console.log(projectNames);
});
```


## License
[MIT License](http://en.wikipedia.org/wiki/MIT_License)