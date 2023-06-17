import { customAlphabet, nanoid } from 'nanoid';
import {numbers} from 'nanoid-dictionary';

export function generateMembersUID() {
    const generate10UniqueNumbers = customAlphabet(numbers, 10);

    const uniqueId = `FBIMS${generate10UniqueNumbers()}`
    return uniqueId;
}

export function generateUID() {
    return nanoid(15);
}


