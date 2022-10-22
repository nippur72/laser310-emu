import React, { useRef } from "react";
import { DefaultButton } from '@fluentui/react';

/*
<input type="file" id="input" onChange={()=>console.log("changed")}></input>
                <!--
                <div>This is a counter: {this.state.count}</div>
                <button onClick={()=>this.click()}>Click me</button>
                -->
accept=".jpg, .png, .jpeg, .gif, .bmp, .tif, .tiff|image/*">
*/

interface UploaderProps {
   accept: string;
   value: string;
   onUpload(files: FileList): void;
}

function Uploader(props: UploaderProps) {
   const inputElementRef = useRef<HTMLInputElement>(null);

   function onChange() {
      const files = inputElementRef.current?.files;
      if(!files) return;
      if(props.onUpload) props.onUpload(files);
   }

   function showDialog() {
      inputElementRef.current?.click();
   }

   return (
      <span>
         <input
            type="file"
            ref={inputElementRef}
            style={{display: "none"}}
            onChange={onChange}
            accept={props.accept}
         ></input>
         <DefaultButton onClick={showDialog}>{props.value}</DefaultButton>
      </span>
   );
}

export { Uploader };