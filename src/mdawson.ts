//
// functions originally copied from https://www.mdawson.net/vic20chrome/vic20.php
// and adapted for this library
//

interface ExternalLoad
{
   externalLoad(url: string): Promise<any>;
   load(src: any): void;
   resolve(bytes: any): void;
}

export function externalLoad(url: string): Promise<any> {
   let subfile = "";
   let cmd = "externalLoad.load";
	let head = document.getElementsByTagName('head')[0];
	let script = document.createElement('script');
	script.type= 'text/javascript';
	script.src= `https://www.mdawson.net/vic20chrome/vic20/prgtojsloader.php?cmd=${cmd}&prgurl=${url}&subfile=${subfile}&rnd=${new Date().valueOf()}`;
	head.appendChild(script);
   return new Promise((resolve,reject)=>{(externalLoad as any as ExternalLoad).resolve = resolve;});
}

(window as any).externalLoad = externalLoad;

externalLoad.load = function(src: any) {
   function encodedbinToArray(data: string) {
      let bincodes = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789.!";
      let v=0,cnt=0,out=[],ii=0;
      for(let i=0;i<data.length;i++) {
         v+=bincodes.indexOf(data[i])<<cnt;
         cnt+=6;
         if(cnt>=8) {
            out[ii++]=(v&255);
            cnt-=8;
            v>>=8;
         }
      }
      return out;
   }
   if(src.length !== 1) return;
   let bytes = encodedbinToArray(src[0]);
   (externalLoad as any as ExternalLoad).resolve(bytes);
}
