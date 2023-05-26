/*
typedef struct vzFile
{
	byte	vzmagic[4];    // VZF0
	byte	filename[17];
	byte	ftype;         // 0xF0 or 0xF1
	byte	start_addrl;
	byte	start_addrh;
} VZFILE;
*/

import { hex, stringToUint8, uint8ToString, hi, lo } from "./bytes";

export const VZ_BASIC   = 0xF0;
export const VZ_BINARY  = 0xF1;

export function packvz(filename: string, type: number, start: number, data: Uint8Array) {
   console.assert(type == VZ_BASIC || type == VZ_BINARY, `unknown VZ data type ${hex(type)}`);

   const VZ: number[] = [];

   // VZ header
   stringToUint8("VZF0").forEach(e=>VZ.push(e));

   // file name
   let fname = (filename + "\0".repeat(18)).substr(0,17);
   stringToUint8(fname).forEach(e=>VZ.push(e));

   // VZ type
   VZ.push(type);

   // start address
   VZ.push(lo(start));
   VZ.push(hi(start));

   // VZ data
   data.forEach(e=>VZ.push(e));

   return new Uint8Array(VZ);
}

interface VZInfo {
   filename: string;
   type: number;
   start: number;
   data: Uint8Array;
}

export function unpackvz(vz: Uint8Array): VZInfo {
   // TODO check header
   const header = uint8ToString(vz.slice(0,4));
   const start  = vz[22]+vz[23]*256;
   const data   = vz.slice(24);
   const type   = vz[21];

   //console.assert(header == "VZF0", `unknown VZ header '${header}'`);
   console.assert(type == VZ_BASIC || type == VZ_BINARY, `unknown VZ data type ${hex(type)}`);

   let filename = "";
   for(let t=0; t<16; t++) {
       let c = vz[t+4];
       if(c==0) break;
       filename += String.fromCharCode(c);
   }

   return { filename, type, start, data };
}
