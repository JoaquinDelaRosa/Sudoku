import { Rule } from "./Rule";
export interface Cell {
    row : number,
    column : number,
    regions: Cell[][],
    value : number,
    isGiven : boolean,
    candidates : number[],
    rules : Rule[]
}

export function intersects (c : Cell, o : Cell) : boolean {
    if (c.row === o.row && c.column === o.column)
        return false;
    
    if (c.value !== 0 || o.value !== 0)
        return false;

    for (let i = 0; i < c.candidates.length; i++) {
        if(o.candidates.includes(c.candidates[i]))
            return true;
    }
    return false;
}

export function getRegionUnion (r : Cell[], s: Cell[]) : Cell[] {
    const result : Cell[] = [];
    
    for (let i = 0; i < s.length; i++) {
        result.push(s[i]);
    }

    for (let i = 0; i < r.length; i++) {
        if (!s.includes(r[i])) {
            result.push(r[i]);
        }
    }

    return result;
}

export function getRegionIntersection (r : Cell[], s : Cell[]) : Cell[] {
    const result  : Cell[] = [];
    for (let i = 0; i < r.length; i ++) {
        if (s.includes(r[i]))
            result.push(r[i]);
    }

    return result;
}

export function getRegionDifference (r : Cell[], s : Cell[]) : Cell[] {
    const result  : Cell[] = [];

    for (let i = 0; i < r.length; i ++) {
        if (!s.includes(r[i]))
            result.push(r[i]);
    }
    
    return result;
}

export function getElementsWithCandidate (r : Cell[], n : number) : Cell[] {
    let result  : Cell[] = [];
    for (let i = 0; i < r.length; i ++) {
        if (r[i].candidates.includes(n) && r[i].value === 0) {
            result.push(r[i]);
        }
        if (r[i].value === n) {
            return [];
        }
    }

    return result;
}

export function regionHasValue (r : Cell[], n : number) : boolean {
    for (let i = 0; i < r.length; i ++) {
        if (r[i].value === n) {
            return true;
        }
    }

    return false;
}

export function regionEliminateCandidate(r : Cell[], n : number) : boolean{
    const s : Cell[]= [];
    for (let i = 0; i < r.length; i ++) {
        if (r[i].candidates.includes(n) && r[i].value === 0) {
            s.push(r[i]);
        }
    }
    
    for (let i = 0; i < s.length; i++) {
        s[i].candidates = s[i].candidates.filter ( (value : number) => {return value !== n} );
    }

    return true;
}

export function isNeighbors(c : Cell, d : Cell) : boolean{
    let rneighbor : boolean = false;
    let sneighbor : boolean = false;

    if (c.row === d.row && c.column === d.column)
        return false;

    for (let i = 0; i < c.regions.length; i ++) {
        if (c.regions[i].includes(d)) {
            rneighbor = true;
            break;
        }
    }

    for (let i = 0; i < d.regions.length; i ++) {
        if (d.regions[i].includes(c)) {
            sneighbor = true;
            break;
        }
    }

    return (rneighbor && sneighbor);
}

export function isDisjoint (region : Cell[]) : boolean {
    for (let i = 0; i < region.length ; i++) {
        for (let j = i + 1 ; j < region.length; j++) {
            if (isNeighbors(region[i], region[j]))
                return false;
        }
    }
    
    return true;
} 