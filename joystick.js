/*
Joystick 1:

up    = ~(inp(&h2b) &  1)
down  = ~(inp(&h2b) &  2)
left  = ~(inp(&h2b) &  4)
right = ~(inp(&h2b) &  8)
fire  = ~(inp(&h2b) & 16)
fire2 = ~(inp(&h27) & 16)

Remarks: bits are with negated logic, 0 when button in pressed.
         Direction and first fire are on port &h2b, the
         other fire button is on port &h27.
         Basic provides the JOY(n) function,
         JOY(0) = direction 1,2,3,4,5,6,8 starting from up and then clockwise
         JOY(1) = 1 fire1 button
         JOY(2) = 1 fire2 button
*/

let joy0 = 0;
let joy1 = 0;

const JOY_UP    =  1;
const JOY_DOWN  =  2;
const JOY_LEFT  =  4;
const JOY_RIGHT =  8;
const JOY_FIRE  = 16;
const JOY_ARM   = 32;

/*
// not implemented: joystick emulation via keyboard TODO
function handleJoyStick(key, press)
{
   let joystick_key = true;
   if(press)
   {
           if(key === "Numpad8")       joy0 = set(joy0, JOY_UP);
      else if(key === "Numpad9")       joy0 = set(joy0, JOY_UP | JOY_RIGHT);
      else if(key === "Numpad6")       joy0 = set(joy0, JOY_RIGHT);
      else if(key === "Numpad3")       joy0 = set(joy0, JOY_RIGHT | JOY_DOWN);
      else if(key === "Numpad2")       joy0 = set(joy0, JOY_DOWN);
      else if(key === "Numpad1")       joy0 = set(joy0, JOY_DOWN | JOY_LEFT);
      else if(key === "Numpad4")       joy0 = set(joy0, JOY_LEFT);
      else if(key === "Numpad7")       joy0 = set(joy0, JOY_UP | JOY_LEFT);
      else if(key === "Numpad0")       joy0 = set(joy1, JOY_FIRE);
      else if(key === "ControlRight")  joy0 = set(joy0, JOY_ARM);
      else joystick_key = false;
   }
   else
   {
           if(key === "Numpad8")       joy0 = reset(joy0, JOY_UP);
      else if(key === "Numpad9")       joy0 = reset(joy0, JOY_UP | JOY_RIGHT);
      else if(key === "Numpad6")       joy0 = reset(joy0, JOY_RIGHT);
      else if(key === "Numpad3")       joy0 = reset(joy0, JOY_RIGHT | JOY_DOWN);
      else if(key === "Numpad2")       joy0 = reset(joy0, JOY_DOWN);
      else if(key === "Numpad1")       joy0 = reset(joy0, JOY_DOWN | JOY_LEFT);
      else if(key === "Numpad4")       joy0 = reset(joy0, JOY_LEFT);
      else if(key === "Numpad7")       joy0 = reset(joy0, JOY_UP | JOY_LEFT);
      else if(key === "Numpad0")       joy0 = reset(joy1, JOY_FIRE);
      else if(key === "ControlRight")  joy0 = reset(joy0, JOY_ARM);
      else joystick_key = false;
   }
   return joystick_key;
}
*/

export function updateGamePad() {
   let gamepads = navigator.getGamepads();
   if(gamepads.length >= 1) {
      // joy 0
      let g0 = gamepads[0];
      if(g0)
      {
         if(g0.axes[0] < -0.5)                              joy0 = set(joy0, JOY_LEFT);   else joy0 = reset(joy0, JOY_LEFT);
         if(g0.axes[0] >  0.5)                              joy0 = set(joy0, JOY_RIGHT);  else joy0 = reset(joy0, JOY_RIGHT);
         if(g0.axes[1] < -0.5)                              joy0 = set(joy0, JOY_UP);     else joy0 = reset(joy0, JOY_UP);
         if(g0.axes[1] >  0.5)                              joy0 = set(joy0, JOY_DOWN);   else joy0 = reset(joy0, JOY_DOWN);
         if(g0.buttons[0].pressed || g0.buttons[3].pressed) joy0 = set(joy0, JOY_FIRE);   else joy0 = reset(joy0, JOY_FIRE);
         if(g0.buttons[1].pressed || g0.buttons[2].pressed) joy0 = set(joy0, JOY_ARM);    else joy0 = reset(joy0, JOY_ARM);
      }

      // second (optional) joystick
      if(gamepads.length >= 2) {
         let g1 = gamepads[1];
         if(g1)
         {
            if(g1.axes[0] < -0.5)                              joy1 = set(joy1, JOY_LEFT);   else joy1 = reset(joy1, JOY_LEFT);
            if(g1.axes[0] >  0.5)                              joy1 = set(joy1, JOY_RIGHT);  else joy1 = reset(joy1, JOY_RIGHT);
            if(g1.axes[1] < -0.5)                              joy1 = set(joy1, JOY_UP);     else joy1 = reset(joy1, JOY_UP);
            if(g1.axes[1] >  0.5)                              joy1 = set(joy1, JOY_DOWN);   else joy1 = reset(joy1, JOY_DOWN);
            if(g1.buttons[0].pressed || g1.buttons[3].pressed) joy1 = set(joy1, JOY_FIRE);   else joy1 = reset(joy1, JOY_FIRE);
            if(g1.buttons[1].pressed || g1.buttons[2].pressed) joy1 = set(joy1, JOY_ARM);    else joy1 = reset(joy1, JOY_ARM);
         }
      }
   }

   return { joy0, joy1 };
}
