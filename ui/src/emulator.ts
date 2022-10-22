interface IEmulator {
   reset(): void;
   droppedFiles(files: FileList): void;
   setMachineType(machineType: string): void;
   setMemory(memory: string): void;
   getJoystickConnected(): boolean;
   connectJoystick(isconnected: boolean): void;
}

export { IEmulator };

