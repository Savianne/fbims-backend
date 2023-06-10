import bcrypt from "bcrypt";

export async function incryptPassword(password: string) {
    const hash = await bcrypt.hash(password, 10);
    return hash;
}

export async function decryptPassword(password: string, toCompare: string) {
    const decrypted = await bcrypt.compare(password, toCompare);
    return decrypted;
}

// async function incryptPassword(password: string) {
//     const hash = await bcrypt.hash(password, 10);
//     return hash;
// }

// incryptPassword("savianne").then(value => console.log(value));
      
