import { Cell } from "../../logic/Cell";
import { Deduction } from "../../logic/Deduction";
import { TableState } from "../../logic/rulesets/TableState";
import { nakedTuple } from "./naked-tuples";

export function hiddenTuple(cell : Cell, table : TableState, t : number) : Deduction{
    // STRATEGY:        We extend the notion of naked tuples by finding hidden tuples, that is, cells which
    //                  form a tuple based on the location of n values being found only in those cells.
    //                  The complement of a hidden tuple is a naked tuple of size 9 - n.
    return nakedTuple(cell, table, 9 - t);
}