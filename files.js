// console command
async function run(filename) {
    if(!await storage.fileExists(filename)) {
       console.log(`file "${filename}" not found`);
       return;
    }
    const ext = getFileExtension(filename);
    if(ext === ".vz" ) await load_vz(filename, true);
    else console.log(`extension '${ext}' not supported`);
}

// console command
async function load(filename) {
    if(!await storage.fileExists(filename)) {
       console.log(`file "${filename}" not found`);
       return;
    }
    const ext = getFileExtension(filename);
    if(ext === ".vz" ) await load_vz(filename, false);
    else console.log(`extension '${ext}' not supported`);
}

// console command
async function save(filename) {
    const ext = getFileExtension(filename);
    if(ext == ".vz" ) await save_vz(filename, undefined, undefined);
    else console.log(`extension '${ext}' not supported`);
}

// console command
async function bsave(filename, start, end) {
    const ext = getFileExtension(filename);
    if(ext == ".vz" ) await save_vz(filename, start, end);
    else console.log(`extension '${ext}' not supported`);
}

// =====================================================================================

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

const VZ_BASIC   = 0xF0
const VZ_BINARY  = 0xF1

async function load_vz(filename, runAfterLoad) {
    const vz_bytes = await storage.readFile(filename);
    const VZ = unpackvz(vz_bytes);

    // write data into memory
    for(let i=0; i<VZ.data.length; i++) {
        mem_write(i+VZ.start, VZ.data[i]);
    }

    if(VZ.type == VZ_BASIC) {
        console.log(`loaded "${filename}" ('${VZ.filename}') as BASIC program of ${VZ.data.length} bytes from ${hex(VZ.start,4)}h to ${hex(VZ.start+VZ.data.length,4)}h`);
    }
    else if(VZ.type == VZ_BINARY) {
        console.log(`loaded "${filename}" ('${VZ.filename}') as binary data of ${VZ.data.length} bytes from ${hex(VZ.start,4)}h to ${hex(VZ.start+VZ.data.length,4)}h`);
    }

    // binary program
    if(VZ.type == VZ_BINARY) {
        if(runAfterLoad) {
            USR(VZ.start); // set USR(0) address;
            emulatekey(KEY_X);
            emulatekey(KEY_SHIFT, KEY_MINUS);
            emulatekey(KEY_U);
            emulatekey(KEY_S);
            emulatekey(KEY_R);
            emulatekey(KEY_SHIFT, KEY_8);
            emulatekey(KEY_X);
            emulatekey(KEY_SHIFT, KEY_9);
            emulatekey(KEY_RETURN);
        }
    }

    // basic program
    if(VZ.type == VZ_BASIC) {
        // modify end of basic program pointer
        let end = VZ.start + VZ.data.length;
        if(VZ.start === mem_read_word(BASTXT)) mem_write_word(BASEND, end+1);
        if(runAfterLoad) {
            emulatekey(KEY_R);
            emulatekey(KEY_U);
            emulatekey(KEY_N);
            emulatekey(KEY_RETURN);
        }
    }
}

async function save_vz(filename, start, end) {
    let type = VZ_BINARY;

    if(start == undefined || end == undefined) {
        start = mem_read_word(BASTXT);
        end = mem_read_word(BASEND)-1;
        type = VZ_BASIC;
    }

    let data = [];
    for(let i=0,t=start; t<=end; i++,t++) {
        data.push(mem_read(t));
    }

    // make name uppercase and remove extension
    let vzname = filename.toUpperCase().replace(".VZ","");

    let VZ = packvz(vzname, type, start, data);

    await storage.writeFile(filename, VZ);

    if(type == VZ_BASIC) {
        console.log(`saved "${filename}" as BASIC program of ${data.length} bytes from ${hex(start,4)}h to ${hex(end,4)}h`);
    }
    else if(type == VZ_BINARY) {
        console.log(`saved "${filename}" as binary data of ${data.length} bytes from ${hex(start,4)}h to ${hex(end,4)}h`);
    }
}

function packvz(filename, type, start, data) {
    console.assert(type == VZ_BASIC || type == VZ_BINARY, `unknown VZ data type ${hex(type)}`);

    const VZ = [];

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

function unpackvz(vz) {
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
