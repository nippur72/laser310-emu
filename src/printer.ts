// simplified printer, it prints to console and it is always ready

export class Printer {
   printerBuffer = "";
   ready = 0x00;
   printerTimeLastReceived = 0;

   // this version prints the whole buffer into one console line, allowing copy & paste
   // print is done if nothing is received from the computer within 2 seconds
   consumeBuffer() {
      const d = new Date().valueOf() - this.printerTimeLastReceived;
      if(d > 2000 && this.printerBuffer !== "") {
         console.log(this.printerBuffer);
         this.printerBuffer = "";
         return;
      }
      setTimeout(()=>this.consumeBuffer(), 2000);
   }

   print(byte: number) {
      this.printerBuffer += String.fromCharCode(byte & 0xFF);
      this.printerTimeLastReceived = new Date().valueOf();
      this.consumeBuffer();
   }
}
