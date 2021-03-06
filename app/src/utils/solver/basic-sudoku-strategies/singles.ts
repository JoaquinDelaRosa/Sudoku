import { Cell } from "../../logic/Cell";

export default function single(cell : Cell)  : boolean {
    // STRATEGY:    If there is only 1 candidate that satisfies the constraint. Choose that candidate.
    if (cell.value === 0 && cell.candidates.length === 1) {
        cell.value = cell.candidates[0]; 
        cell.candidates.shift();
        return true;
    }
    return false;
}