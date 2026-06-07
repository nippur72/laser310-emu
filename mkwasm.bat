@echo off

if "%EMSDK%"=="" (
   call ..\..\emsdk\emsdk_env.bat
)

if not exist dist mkdir dist

call emcc wasm\prova.c -O3 ^
   -s EXPORTED_RUNTIME_METHODS=ccall,cwrap,HEAPU8,HEAPU32,HEAPF32 ^
   -s ENVIRONMENT=web ^
   -s MODULARIZE=1 ^
   -s EXPORT_NAME="emscripten_module" ^
   -s ALLOW_MEMORY_GROWTH=1 ^
   -s EXPORT_ES6=1 ^
   -o dist\emscripten_module.js

echo done
