/**
  * Enumeration of motors.
  */
enum RBMotor {
    //% block="left"
    Left,
    //% block="right"
    Right,
    //% block="both"
    Both
}

/**
  * Enumeration of forward/reverse directions
  */
enum RBDirection {
    //% block="forward"
    Forward,
    //% block="reverse"
    Reverse
}

/**
  * Enumeration of directions.
  */
enum RBRobotDirection {
    //% block="left"
    Left,
    //% block="right"
    Right
}

/**
  * Stop modes. Coast or Brake
  */
enum RBStopMode {
    //% block="no brake"
    Coast,
    //% block="brake"
    Brake
}


/**
 * Pre-Defined pixel colours
 */
enum RBColors {
    //% block=red
    Red = 0xff0000,
    //% block=orange
    Orange = 0xffa500,
    //% block=yellow
    Yellow = 0xffff00,
    //% block=green
    Green = 0x00ff00,
    //% block=blue
    Blue = 0x0000ff,
    //% block=indigo
    Indigo = 0x4b0082,
    //% block=violet
    Violet = 0x8a2be2,
    //% block=purple
    Purple = 0xff00ff,
    //% block=white
    White = 0xffffff,
    //% block=black
    Black = 0x000000
}

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

    let _model: RBModel;
    let larsson: number;
    let scandir: number;
    let ledCount = 8;
    let leftSpeed = 0;
    let rightSpeed = 0;
    let _scanning = false;
    let scanColor1 = 0xff0000;
    let scanColor2 = 0x0f0000;
    let scanColor3 = 0x030000;

    function clamp(value: number, min: number, max: number): number {
        return Math.max(Math.min(max, value), min);
    }


    // New Style Motor Blocks
    // slow PWM frequency for slower speeds to improve torque
    function setPWM(speed: number): void {
        if (speed < 200)
           { pins.analogSetPeriod(AnalogPin.P1, 60000);
            pins.analogSetPeriod(AnalogPin.P2, 60000);
           }
        else if (speed < 300)
            {
            pins.analogSetPeriod(AnalogPin.P1, 40000);
            pins.analogSetPeriod(AnalogPin.P2, 60000);
            }
        else
            {
            pins.analogSetPeriod(AnalogPin.P1, 30000);
            pins.analogSetPeriod(AnalogPin.P2, 60000);
            }
    }

    /**
      * Move robot forward (or backward) at speed.
      * @param direction Move Forward or Reverse
      * @param speed speed of motor between 0 and 100. eg: 60
      */
    //% blockId="RBGo" block="go%direction|at speed%speed|\\%"
    //% speed.min=0 speed.max=100
    //% weight=100
    //% subcategory=Motors
    //% group="New style blocks"
    //% blockGap=8
    export function go(direction: RBDirection, speed: number): void {
        move(RBMotor.Both, direction, speed);
    }

    /**
      * Move robot forward (or backward) at speed for milliseconds
      * @param direction Move Forward or Reverse
      * @param speed speed of motor between 0 and 100. eg: 60
      * @param milliseconds duration in milliseconds to drive forward for, then stop. eg: 400
      */
    //% blockId="RBGoms" block="go%direction|at speed%speed|\\% for%milliseconds|ms"
    //% speed.min=0 speed.max=100
    //% weight=90
    //% subcategory=Motors
    //% group="New style blocks"
    //% blockGap=8
    export function goms(direction: RBDirection, speed: number, milliseconds: number): void {
        go(direction, speed);
        basic.pause(milliseconds);
        stop(RBStopMode.Coast);
    }

    /**
      * Rotate robot in direction at speed
      * @param direction direction to turn
      * @param speed speed of motors (0 to 100). eg: 60
      */
    //% blockId="RBRotate" block="spin%direction|at speed%speed|\\%"
    //% speed.min=0 speed.max=100
    //% weight=80
    //% subcategory=Motors
    //% group="New style blocks"
    //% blockGap=8
    export function rotate(direction: RBRobotDirection, speed: number): void {
        if (direction == RBRobotDirection.Left) {
            move(RBMotor.Left, RBDirection.Reverse, speed);
            move(RBMotor.Right, RBDirection.Forward, speed);
        }
        else if (direction == RBRobotDirection.Right) {
            move(RBMotor.Left, RBDirection.Forward, speed);
            move(RBMotor.Right, RBDirection.Reverse, speed);
        }
    }

    /**
      * Rotate robot in direction at speed for milliseconds.
      * @param direction direction to spin
      * @param speed speed of motor between 0 and 100. eg: 60
      * @param milliseconds duration in milliseconds to spin for, then stop. eg: 400
      */
    //% blockId="RBRotatems" block="spin%direction|at speed%speed|\\% for%milliseconds|ms"
    //% speed.min=0 speed.max=100
    //% weight=70
    //% subcategory=Motors
    //% group="New style blocks"
    //% blockGap=8
    export function rotatems(direction: RBRobotDirection, speed: number, milliseconds: number): void {
        rotate(direction, speed);
        basic.pause(milliseconds);
        stop(RBStopMode.Coast);
    }

    /**
      * Stop robot by coasting slowly to a halt or braking
      * @param mode Brakes on or off
      */
    //% blockId="RBstop" block="stop with%mode"
    //% weight=60
    //% subcategory=Motors
    //% group="New style blocks"
    //% blockGap=8
    export function stop(mode: RBStopMode): void {
        let stopMode = 0;
        if (mode == RBStopMode.Brake)
            stopMode = 1;
        pins.digitalWritePin(lMotorD0, stopMode);
        pins.digitalWritePin(lMotorD1, stopMode);
        pins.digitalWritePin(rMotorD0, stopMode);
        pins.digitalWritePin(rMotorD1, stopMode);
    }

    /**
      * Move individual motors forward or reverse
      * @param motor motor to drive
      * @param direction select forwards or reverse
      * @param speed speed of motor between 0 and 100. eg: 60
      */
    //% blockId="RBMove" block="move%motor|motor(s)%direction|at speed%speed|\\%"
    //% weight=50
    //% speed.min=0 speed.max=100
    //% subcategory=Motors
    //% group="New style blocks"
    //% blockGap=8
    export function move(motor: RBMotor, direction: RBDirection, speed: number): void {
        speed = clamp(speed, 0, 100) * 10.23;
        setPWM(speed);
        let lSpeed = Math.round(speed * (100 - leftBias) / 100);
        let rSpeed = Math.round(speed * (100 - rightBias) / 100);
        if ((motor == RBMotor.Left) || (motor == RBMotor.Both)) {
            if (direction == RBDirection.Forward) {
                pins.analogWritePin(lMotorA0, lSpeed);
                pins.digitalWritePin(lMotorD0, 1);
                pins.digitalWritePin(lMotorD1, 0);
            }
            else {
                pins.analogWritePin(lMotorA0, lSpeed);
                pins.digitalWritePin(lMotorD0, 0);
                pins.digitalWritePin(lMotorD1, 1);
            }
        }
        if ((motor == RBMotor.Right) || (motor == RBMotor.Both)) {
            if (direction == RBDirection.Forward) {
                pins.analogWritePin(rMotorA0, rSpeed);
                pins.digitalWritePin(rMotorD0, 1);
                pins.digitalWritePin(rMotorD1, 0);
            }
            else {
                pins.analogWritePin(rMotorA0, rSpeed);
                pins.digitalWritePin(rMotorD0, 0);
                pins.digitalWritePin(rMotorD1, 1);
            }
        }
    }

    /**
      * Set left/right bias to match motors
      * @param direction direction to turn more (if robot goes right, set this to left)
      * @param bias percentage of speed to bias with eg: 10
      */
    //% blockId="RBBias" block="bias%direction|by%bias|\\%"
    //% bias.min=0 bias.max=80
    //% weight=40
    //% subcategory=Motors
    //% group="New style blocks"
    //% blockGap=8
    export function RBBias(direction: RBRobotDirection, bias: number): void {
        bias = clamp(bias, 0, 80);
        if (direction == RBRobotDirection.Left) {
            leftBias = bias;
            rightBias = 0;
        }
        else {
            leftBias = 0;
            rightBias = bias;
        }
    }

  
}
