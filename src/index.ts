///<reference path="../_references.ts"/>
import {VsSolutionFile} from "../typings/modules/vssln-parser/index";
import {VsSolutionProject} from "../typings/modules/vssln-parser/index";
import ReadableStream = NodeJS.ReadableStream;
var toposort = require('toposort');
var parse;
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

function getFromStream(stream: ReadableStream, callback?: (list: VsSolutionProject[]) => void) {
    if (!parse) {
        parse = require("vssln-parser").parse;
    }

    parse(stream, solution => callback(getOrderedList(solution)));
}

function getFromFile(fileName: string, callback?: (list: VsSolutionProject[]) => void) {
    if (!fs) {
        fs = require("fs");
    }

    const stream = fs.createReadStream(fileName);
    getFromStream(stream, callback);
}

export function sortProjects(input: VsSolutionFile|string|ReadableStream,
                             callback?: (list: VsSolutionProject[]) => void): VsSolutionProject[] {
    let result;

    if (typeof input === "string") {
        if (!callback) {
            throw new Error("sortProjects expects the callback parameter to be non-null when the input parameter is a file name.");
        }
        getFromFile(input as string, callback);
    }
    else if ((input as ReadableStream).pipe) {
        if (!callback) {
            throw new Error("sortProjects expects the callback parameter to be non-null when the input parameter is a stream.");
        }
        getFromStream(input as ReadableStream, callback);
    }
    else {
        result = getOrderedList(input as VsSolutionFile);
    }

    return result;
}