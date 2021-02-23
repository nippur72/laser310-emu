async function load(filename, p) {   
    if(!await storage.fileExists(filename)) {
       console.log(`file "${filename}" not found`);
       return;
    }

    const ext = getFileExtension(filename);

         if(ext === ".bin") await load_bin(filename, p);
    else if(ext === ".vz" ) await load_vz(filename);
    else console.log(`extension '${ext}' not supported`);
}

async function save(filename, p1, p2) {
    const ext = getFileExtension(filename);

         if(ext == ".bin") await save_bin(filename, p1, p2);
    else if(ext == ".vz" ) await save_vz(filename);
    else console.log(`extension '${ext}' not supported`);
}

function loadBytes(bytes, address, fileName) {
    const startAddress = (address === undefined) ? mem_read_word(BASTXT) : address;
    const endAddress = startAddress + bytes.length - 1;

    for(let i=0,t=startAddress;t<=endAddress;i++,t++) {
       mem_write(t, bytes[i]);
    }

    // modify end of basic program pointer
    if(startAddress === mem_read_word(BASTXT)) mem_write_word(BASEND, endAddress+1);

    if(fileName === undefined) fileName = "autoload";
    console.log(`loaded "${fileName}" ${bytes.length} bytes from ${hex(startAddress,4)}h to ${hex(endAddress,4)}h`);
}

async function load_bin(fileName, address) {
    const bytes = await storage.readFile(fileName);
    loadBytes(bytes, address, fileName);
}

async function save_bin(filename, start, end) {
    if(start === undefined) start = mem_read_word(BASTXT);
    if(end === undefined) end = mem_read_word(BASEND)-1;

    const prg = [];
    for(let i=0,t=start; t<=end; i++,t++) {
       prg.push(mem_read(t));
    }
    const bytes = new Uint8Array(prg);

    await storage.writeFile(filename, bytes);

    console.log(`saved "${filename}" ${bytes.length} bytes from ${hex(start,4)}h to ${hex(end,4)}h`);
}

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

async function load_vz(filename) {
    const vz = await storage.readFile(filename);
    const startAddress = vz[22]+vz[23]*256;
    const bytes        = vz.slice(24);
    loadBytes(bytes, startAddress, filename);
}

async function save_vz(filename) {

}

