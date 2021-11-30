import { Cell } from "../Cell";
import { Rule } from "../Rule";
import applyNormalRules from "./normal-rules";

export interface TableState{
    cells : Cell[][],
    regions : Cell[][]
}

export function setValueAt (table : TableState, row : number, column : number, value : number) {
    if (row < 1 || column < 1 || value < 1 || row > 9 || column > 9 || value > 9) 
        return table;

    table.cells[row - 1][column - 1].value = value;
}

export function generateTable () : TableState{
    const cells = [];
    for(let i = 0; i < 9; i++) {
        const temp = []
        for(let j = 0; j < 9 ; j++) {
            temp.push ({
                row: i + 1,
                column : j + 1, 
                value : 0,
                isGiven : false,
                candidates : [1, 2, 3, 4, 5, 6, 7, 8, 9],
                rules : [],
                regions : []
            })
        }
        cells.push(temp);
    }

    let table  : TableState=  {
        cells : cells,
        regions : []
    };

    table = applyRules(table);
    table = initializeTable(table);
    return table
}


export function applyRules (table : TableState) : TableState{
    applyNormalRules(table);
    return table;
}

export function isCellSatisfied(cell :Cell) : boolean {
    for (let i = 0; i < cell.rules.length; i++) {
        if (! cell.rules[i].isValid())
            return false;
    }
    return true;
}

export function isTableSatisfied (table : TableState) : boolean {
    for (let i = 0; i < table.cells.length; i++) {
        for (let j = 0; j < table.cells[0].length; j++) {
            if (!isCellSatisfied(table.cells[i][j]))
                return false;
        }
    }
    return true;
}

export function getEmpty (table : TableState) : Cell[] {
    const result : Cell[] = [];
    for (let i = 0; i < table.cells.length ; i ++) {
        for (let j = 0; j < table.cells[0].length; j++) {
            if (table.cells[i][j].value !== 0)
                result.push(table.cells[i][j]);
        }
    }

    return result;
}

export function getAll (table : TableState) : Cell[] {
    const result : Cell[] = [];
    for (let i = 0; i < table.cells.length ; i ++) {
        for (let j = 0; j < table.cells[0].length; j++) {
            result.push(table.cells[i][j]);
        }
    }

    return result;
}

export function initializeTable(table : TableState) : TableState{

    let empty = [   [0, 0, 0,   0, 0, 0,   0, 0, 0],
                    [0, 0, 0,   0, 0, 0,   0, 0, 0],
                    [0, 0, 0,   0, 0, 0,   0, 0, 0],

                    [0, 0, 0,   0, 0, 0,   0, 0, 0],
                    [0, 0, 0,   0, 0, 0,   0, 0, 0],
                    [0, 0, 0,   0, 0, 0,   0, 0, 0], 

                    [0, 0, 0,   0, 0, 0,   0, 0, 0], 
                    [0, 0, 0,   0, 0, 0,   0, 0, 0],
                    [0, 0, 0,   0, 0, 0,   0, 0, 0]]

    let g1 = [    [0, 3, 2,   0, 0, 6,   1, 0, 0],
                    [4, 1, 0,   0, 0, 0,   0, 0, 0],
                    [0, 0, 0,   9, 0, 1,   0, 0, 0],

                    [5, 0, 0,   0, 9, 0,   0, 0, 4],
                    [0, 6, 0,   0, 0, 0,   0, 7, 1],
                    [3, 0, 0,   0, 2, 0,   0, 0, 5], 

                    [0, 0, 0,   5, 0, 8,   0, 0, 0], 
                    [0, 0, 0,   0, 0, 0,   5, 1, 9],
                    [0, 5, 7,   0, 0, 9,   8, 6, 0]]

    let g2 = [    [0, 1, 7,   9, 0, 3,   6, 0, 0],
                    [0, 0, 0,   0, 8, 0,   0, 0, 0],
                    [9, 0, 0,   0, 0, 0,   5, 0, 7],

                    [0, 7, 2,   0, 1, 0,   4, 3, 0],
                    [0, 0, 0,   4, 0, 2,   0, 7, 0],
                    [0, 6, 4,   3, 7, 0,   2, 5, 0], 

                    [7, 0, 1,   0, 0, 0,   0, 6, 5], 
                    [0, 0, 0,   0, 3, 0,   0, 0, 0],
                    [0, 0, 5,   6, 0, 1,   7, 2, 0]];
    
    let g3 =    [   [0, 1, 6,   0, 0, 7,   8, 0, 3],
                    [0, 9, 0,   8, 0, 0,   0, 0, 0],
                    [8, 7, 0,   0, 0, 1,   0, 6, 0],

                    [0, 4, 8,   0, 0, 0,   3, 0, 0],
                    [6, 5, 0,   0, 0, 9,   0, 8, 2],
                    [0, 3, 9,   0, 0, 0,   6, 5, 0], 

                    [0, 6, 0,   9, 0, 0,   0, 2, 0], 
                    [0, 8, 0,   0, 0, 2,   9, 3, 6],
                    [9, 2, 4,   6, 0, 0,   5, 1, 0]]

    let g4 =     [  [0, 2, 0,   0, 0, 0,   0, 9, 4],
                    [7, 6, 0,   9, 1, 0,   0, 5, 0],
                    [0, 9, 0,   0, 0, 2,   0, 8, 1],

                    [0, 7, 0,   0, 5, 0,   0, 1, 0],
                    [0, 0, 0,   7, 0, 9,   0, 0, 0],
                    [0, 8, 0,   0, 3, 1,   0, 6, 7], 

                    [2, 4, 0,   1, 0, 0,   0, 7, 0], 
                    [0, 1, 0,   0, 9, 0,   0, 4, 5],
                    [9, 0, 0,   0, 0, 0,   1, 0, 0]]

    let grid = g4;

    for (let i = 0; i < 9; i ++) {
        for (let j = 0; j < 9; j++) {
            setValueAt(table ,i + 1, j + 1, grid[i][j]);
            if (grid[i][j] !== 0 ) {
                 table.cells[i][j].isGiven = true;
            }
        }
    }
    return table;
}