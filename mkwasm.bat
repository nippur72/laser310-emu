@echo off

rem abilitare il path con
rem ..\emsdk-master\emsdk_env.bat

call emcc wasm\prova.c -O3 ^
   -s EXPORTED_RUNTIME_METHODS=ccall,cwrap ^
   -s ENVIRONMENT=web ^
   -s MODULARIZE=1 ^
   -s EXPORT_NAME="emscripten_module" ^
   -s ALLOW_MEMORY_GROWTH=1 ^
   -s EXPORT_ES6=1 ^
   -o emscripten_module.js

echo done
