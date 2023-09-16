import { saveAs } from "file-saver";

export function downloadBytes(fileName: string, buffer: Uint8Array|ArrayBuffer) {
   let blob = new Blob([buffer], {type: "application/octet-stream"});
   saveAs(blob, fileName);
   console.log(`downloaded "${fileName}"`);
}
