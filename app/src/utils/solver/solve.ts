import { Cell } from "../logic/Cell";
import { Deduction, isValid } from "../logic/Deduction";
import { isCellSatisfied, TableState } from "../logic/rulesets/TableState";
import candidateElimination from "./basic-sudoku-strategies/candidate-elimination";
import { hiddenTuple } from "./basic-sudoku-strategies/hidden-tuple";
import intersectionRemoval from "./basic-sudoku-strategies/intersection-removal";
import {nakedTuple} from "./basic-sudoku-strategies/naked-tuples";
import single from "./basic-sudoku-strategies/singles";
import simpleColoring from "./chaining_sudoku_strategies/simple-coloring";
import XWing from "./chaining_sudoku_strategies/x-wings";


export default function solve(table : TableState) : TableState {

    // Fundamental Strategies
    for (let i = 0; i < table.cells.length; i ++) {
        for (let j = 0; j < table.cells[0].length; j++) {
            candidateElimination(table.cells[i][j]);
        }
    }

    for (let i = 0; i < table.cells.length; i ++) {
        for (let j = 0; j < table.cells[0].length; j++) {
            if (single(table.cells[i][j]) )
                console.log("[Singleton] r%d c%d has value %d", i + 1, j + 1, table.cells[i][j].value);
            
        }
    }

    eliminateByCell(table);
    eliminateByCandidate(table);

    return table;
}

function eliminateByCell(table : TableState) {
    let deduction : Deduction
    
    for (let t = 2; t <= 4; t ++) {
        for (let i = 0; i < table.cells.length; i ++) {
            for (let j = 0; j < table.cells[0].length; j++) {
                deduction = nakedTuple(table.cells[i][j], table, t);
                if (isValid(deduction)) {
                    console.log("[Naked tuple] via cells: %s affecting %s", formatCellsAsString(deduction.cause) , formatCellsAsString(deduction.effect));
                    return;
                }
            }
        }
    }

    for (let t = 2; t <= 4; t ++) {
        for (let i = 0; i < table.cells.length; i ++) {
            for (let j = 0; j < table.cells[0].length; j++) {
                deduction = hiddenTuple(table.cells[i][j], table, t);
                if (isValid(deduction)) {
                    console.log("[Hidden tuple] via cells: %s affecting %s", formatCellsAsString(deduction.cause) , formatCellsAsString(deduction.effect));
                    return;
                }
            }
        }
    }
}

function eliminateByCandidate(table : TableState) {
    let deduction : Deduction;
    for (let candidate = 1; candidate <= 9; candidate ++) {
        deduction = intersectionRemoval(table, candidate);
        if (isValid(deduction)) {
            console.log("[Intersection Removal] via candidate %d at cells %s affecting %s", candidate, formatCellsAsString(deduction.cause), formatCellsAsString(deduction.effect));
            return;
        }

        deduction = XWing(table, candidate);
        if (isValid(deduction)) {
            console.log("[Classic X-Wing] via candidate %d at cells %s affecting %s", candidate, formatCellsAsString(deduction.cause), formatCellsAsString(deduction.effect));
            return;
        }

        // deduction = simpleColoring(table, candidate);
        // if (isValid(deduction)) {
        //     console.log("[Simple Coloring] via candidate %d at cells %s affecting %s", candidate, formatCellsAsString(deduction.cause), formatCellsAsString(deduction.effect));
        //     return;
        // }
    }
}


function formatCellsAsString(cells : Cell[]) : String {
    let str = ""
    cells.forEach(element => {
        str +=  ("[" + [element.row, element.column] + "] ")
    });
    return str;
}