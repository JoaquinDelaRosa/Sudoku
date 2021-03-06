import { Cell, intersects } from "../../logic/Cell";
import { Deduction } from "../../logic/Deduction";
import { isCellSatisfied, TableState } from "../../logic/rulesets/TableState";

export function nakedTuple(cell : Cell, table : TableState, t : number) : Deduction{
    // STRATEGY:    By the fact each region must contain unique entries, 
    //              If the candidates for two related cells are exactly the same, then we eliminate those entries from other entries
    //              In the appropriate region.
    let deduction : Deduction  = {
        cause : [],
        effect : []
    }

    if (cell.value === 0 && cell.candidates.length <= t) {
        let candidatesList : Cell[] = [];
        let success = false;


        for (let r = 0; r < cell.regions.length; r++) {
            candidatesList = [];        
            candidatesList.push(cell);
            let empty = 0;

            for (let c = 0; c < cell.regions[r].cells.length; c++) {
                const other = cell.regions[r].cells[c];
                if (intersects(cell, other)){
                    candidatesList.push(other);
                }
                if (other.value === 0) 
                    empty++;
            }

            candidatesList = pruneNonTuple(candidatesList, t);

            if (formsTuple(candidatesList, t) && candidatesList.length !== empty) {
                for (let c = 0; c < cell.regions[r].cells.length ; c++) {
                    const other = cell.regions[r].cells[c];
                    if (!candidatesList.includes(other) && other.value ===0) {
                        const length = other.candidates.length;
                        eliminateCandidates(other, getRunningList(candidatesList));
                        if (length !== other.candidates.length) {
                            success = true;
                            deduction.effect.push(other);
                        }
                    }
                }
            }
            
            if (success){
                deduction.cause = candidatesList;
                return deduction;
            }
        }
    }

    return deduction;
}


export function pruneNonTuple(cells : Cell[], n : number) : Cell[] {
    if (cells.length <= n)
        return cells;

    const runningList = getRunningList(cells);
    let tuple : Cell[] = [];

    // Find the proper tuple.
    // SUB-STRATEGY 1:   We remove elements where the number of candidates is larger than n. This is because these cannot
    //                   Be part of the tuple at the tuple must have cells with at most n candidates.

    cells = cells.filter ( (cell :Cell) => {
        return cell.candidates.length <= n;
    });

    // SUB-STRATEGY2:   This leaves us with elements where the candidate list is at most n-units long. We then examine these
    //                  Remaining cells and find the n-tuple.
    for(let hash = 1 ; hash < 2**(cells.length); hash++) {
        let ctr = hash;
        let power = cells.length - 1;

        while (ctr > 0) {
            if (2 ** power > ctr) {
                power -= 1;
            } else {
                ctr = ctr - 2 ** power;
                tuple.push(cells[power]);
                power -= 1;
            }
        }
        if (tuple.length === n && getRunningList(tuple).size === n ){
            break;
        }
        tuple = [];
    }


    // Then remove the tuple from the list
    cells = cells.filter( (value : Cell) => {
        return tuple.includes(value);
    });

    return cells;
}

export function eliminateCandidates(cell : Cell, candidates : Set<number>) {
    if (cell.value !== 0)
        return;
        
    cell.candidates = cell.candidates.filter((val :number) => (
        !candidates.has(val)
    ));
}

export function getRunningList(cells : Cell[]){
    const runningList : Set<number> = new Set<number>();

    for (let c = 0; c < cells.length; c++) {
        for (let x = 0; x < cells[c].candidates.length; x++) {
            runningList.add(cells[c].candidates[x]);
        }
    }
    return runningList;
}

export function formsTuple(cells : Cell[], n : number) : boolean{
    if (cells.length === 0)
        return false;

    return getRunningList(cells).size === cells.length && cells.length === n;
}
