/**
 * Custom blocks
 * KEYESTUDIO Motor Shield Pins
 * Standby Pin P14
 * Motor 1 - Forward - P13(high), P12(low), PWM - P1
 * Motor 2 - Forward - P15(high), P16(low),PWM - P2
 */
//% weight=50 color=#07a8ed icon="\uf21a"
//% groups='["New style blocks","Basic","Advanced","Special","Ultrasonic","Line Sensor","5x5 Matrix","BitFace","OLED 128x64","Old style blocks"]'
namespace blubot {

    let leftBias = 0;
    let rightBias = 0;
    let stbyPin = DigitalPin.P14;
    let lMotorD0 = DigitalPin.P13;
    let lMotorD1 = DigitalPin.P12;
    let lMotorA0 = AnalogPin.P1;
    let rMotorD0 = DigitalPin.P15;
    let rMotorD1 = DigitalPin.P16;
    let rMotorA0 = AnalogPin.P2;

//% block="test function"
    export function go() 
    {
                pins.analogWritePin(lMotorA0,600);
                pins.digitalWritePin(lMotorD0, 1);
                pins.digitalWritePin(lMotorD1, 0);
                pins.analogWritePin(rMotorA0,600);
                pins.digitalWritePin(rMotorD0, 1);
                pins.digitalWritePin(rMotorD1, 0);
                basic.pause(3000);
                pins.analogWritePin(lMotorA0, 0);
                pins.digitalWritePin(lMotorD0, 0);
                pins.digitalWritePin(lMotorD1, 0);
                pins.analogWritePin(rMotorA0, 0);
                pins.digitalWritePin(rMotorD0, 0);
                pins.digitalWritePin(rMotorD1, 0);
                basic.pause(3000);
                pins.analogWritePin(lMotorA0,600);
                pins.digitalWritePin(lMotorD0, 0);
                pins.digitalWritePin(lMotorD1, 1);
                pins.analogWritePin(rMotorA0,600);
                pins.digitalWritePin(rMotorD0, 0);
                pins.digitalWritePin(rMotorD1, 1);
                basic.pause(3000);
                pins.analogWritePin(lMotorA0, 0);
                pins.digitalWritePin(lMotorD0, 0);
                pins.digitalWritePin(lMotorD1, 0);
                pins.analogWritePin(rMotorA0, 0);
                pins.digitalWritePin(rMotorD0, 0);
                pins.digitalWritePin(rMotorD1, 0);

    }


}
