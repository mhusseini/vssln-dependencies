///<reference path="../_references.ts"/>
import {VsSolutionFile} from "../typings/modules/vssln-parser/index";
import {VsSolutionProject} from "../typings/modules/vssln-parser/index";
import ReadableStream = NodeJS.ReadableStream;
var toposort = require('toposort');
var vsslnparse = require("vssln-parser");
var fs;

function getOrderedList(solution: VsSolutionFile): VsSolutionProject[] {
    const projects = solution.projects.filter(p => p.projectGuid && p.type !== "Solution Folder");
    const nodes = projects.map(p => p.projectGuid);
    const edges = [];

    projects.forEach(project => {
        const dependencies = project.projectDependencies;
        for (let dependency in dependencies) {
            if (dependencies.hasOwnProperty(dependency)) {
                edges.push([project.projectGuid, dependency]);
            }
        }
    });

    const sortedGuids = toposort.array(nodes, edges).reverse();
    const projectsByGuids = {};
    projects.forEach(p => projectsByGuids[p.projectGuid] = p);

    return sortedGuids.map(guid => projectsByGuids[guid]);
}

export function fromStream(stream: ReadableStream, callback?: (list: VsSolutionProject[]) => void) : void{
    vsslnparse(stream, solution => callback(getOrderedList(solution)));
}

export function fromFile(fileName: string, callback?: (list: VsSolutionProject[]) => void) : void {
    if (!fs) {
        fs = require("fs");
    }

    const stream = fs.createReadStream(fileName);
    vsslnparse(stream, solution => callback(getOrderedList(solution)));
}

export function fromString(content: string) :  VsSolutionProject[] {
    let result: VsSolutionProject[];

    vsslnparse(content, solution => result = getOrderedList(solution));

    return result;
}

export function fromSolution(solution: VsSolutionFile) :  VsSolutionProject[] {
    return getOrderedList(solution);
}