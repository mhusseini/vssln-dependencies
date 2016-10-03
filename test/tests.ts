///<reference path="../_references.ts"/>

var slnparser = require("vssln-parser");
var sortProjects = require("../../").sortProjects;
var fs = require('fs');
var expect: Chai.ExpectStatic = require('chai').expect;

describe('Sln Dependencies', function () {
    const solutionFileName = "dist/test/test.sln";

    function assertDefault(sortedProjects){
        const sortedNames = sortedProjects.map(p => p.name);
        expect(sortedNames).to.members(["Project4", "Project3", "Project2", "Project1", "Project5"]);
    }

    it("read from solution", done => {
        const stream = fs.createReadStream(solutionFileName);
        slnparser.parse(stream, solution => {
            const sortedProjects = sortProjects(solution);
            assertDefault(sortedProjects);
            done();
        });
    });

    it("read from stream", done => {
        const stream = fs.createReadStream(solutionFileName);
        sortProjects(stream, sortedProjects => {
            assertDefault(sortedProjects);
            done();
        });
    });

    it("read from file name", done => {
        sortProjects(solutionFileName, sortedProjects => {
            assertDefault(sortedProjects);
            done();
        });
    });
});