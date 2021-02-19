rem /mnt/c/Users/Nino1/Desktop/USB/GitHub/laser310/12-Home computer$
rem  ~/bin/zasm -uwy --z80 ./laser310-firmware-r3133.asm

set DEST=rom.asm
set VER=r314
set laser310PATH=..\laser310
echo ; > %DEST%
type %laser310PATH%\include\bootloader\bootloader-%VER%.asm >> %DEST%
type %laser310PATH%\include\vdp\vdp-%VER%.asm >> %DEST%
type %laser310PATH%\include\psg\psg-%VER%.asm >> %DEST%
type %laser310PATH%\include\basic\basic32k-%VER%.asm >> %DEST%
type %laser310PATH%\include\utils\utils-r11.asm >> %DEST%
type %laser310PATH%\include\vdp\6x8fonts-r15.asm >> %DEST%
type %laser310PATH%\include\vdp\8x8fonts-r18.asm >> %DEST%
type %laser310PATH%\include\vdp\logo-fonts.asm >> %DEST%
type %laser310PATH%\"12-Home computer\laser310-firmware-%VER%.asm" >> %DEST%

explorer http://k1.spdns.de/cgi-bin/zasm.cgi






