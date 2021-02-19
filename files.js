async function load(filename, p) {   
    if(!await storage.fileExists(filename)) {
       console.log(`file "${filename}" not found`);
       return;
    }

    const ext = filename.substr(-4).toLowerCase();

         if(ext === ".prg") await load_file(filename, p);
    else if(ext === ".emu") await load_state(filename);
    else console.log("give filename .prg or .emu extension");
}

async function save(filename, p1, p2) {
    const ext = filename.substr(-4).toLowerCase();

         if(ext == ".prg") await save_file(filename, p1, p2);
    else if(ext == ".emu") await save_state(filename);
    else console.log("give filename .prg or .emu extension");
}

function loadBytes(bytes, address, fileName) {
    const startAddress = (address === undefined) ? mem_read_word(BASTXT) : address;
    const endAddress = startAddress + bytes.length - 1;

    for(let i=0,t=startAddress;t<=endAddress;i++,t++) {
       mem_write(t, bytes[i]);
    }

    // modify end of basic program pointer
    if(startAddress === mem_read_word(BASTXT)) mem_write_word(PROGND, endAddress+1);

    if(fileName === undefined) fileName = "autoload";
    console.log(`loaded "${fileName}" ${bytes.length} bytes from ${hex(startAddress,4)}h to ${hex(endAddress,4)}h`);
}

async function load_file(fileName, address) {
    const bytes = await storage.readFile(fileName);
    loadBytes(bytes, address, fileName);
    //cpu.reset();
}

async function save_file(filename, start, end) {
    if(start === undefined) start = mem_read_word(BASTXT);
    if(end === undefined) end = mem_read_word(PROGND)-1;

    const prg = [];
    for(let i=0,t=start; t<=end; i++,t++) {
       prg.push(mem_read(t));
    }
    const bytes = new Uint8Array(prg);

    await storage.writeFile(filename, bytes);

    console.log(`saved "${filename}" ${bytes.length} bytes from ${hex(start,4)}h to ${hex(end,4)}h`);
    //cpu.reset();
}

