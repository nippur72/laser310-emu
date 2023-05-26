interface EmscriptenModuleCwrap extends EmscriptenModule
{
    cwrap(ident: string, returnType: string|null, argTypes?: any[]);
}

export default function caller(options?: any): any;

