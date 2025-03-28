import { Turtle, SimpleTurtle, Point, Color } from "./turtle";
import * as fs from "fs";
import { execSync } from "child_process";

/**
 * Draws a square of the given side length using the turtle.
 * @param turtle The turtle to use for drawing.
 * @param sideLength The length of each side of the square in pixels.
 */
export function drawSquare(turtle: Turtle, sideLength: number): void {
  turtle.forward(sideLength);
  turtle.turn(90);
  turtle.forward(sideLength);
  turtle.turn(90);
  turtle.forward(sideLength);
  turtle.turn(90);
  turtle.forward(sideLength);
  turtle.turn(90);
}

/**
 * Calculates the length of a chord of a circle.
 * Read the specification comment above it carefully in the problem set description.
 * @param radius Radius of the circle.
 * @param angleInDegrees Angle subtended by the chord at the center of the circle (in degrees).
 * @returns The length of the chord.
 */
export function chordLength(radius: number, angleInDegrees: number): number {
  const angleInRadians = (angleInDegrees * Math.PI) / 180;
  const length = 2 * radius * Math.sin(angleInRadians / 2);
  return Math.round(length * 1e6) / 1e6; // to avoid any floating point errors.
}

/**
 * Draws an approximate circle using the turtle.
 * Use your implementation of chordLength.
 * Uses chords as the sides of the polygon that will be my approximate circle.
 * @param turtle The turtle to use.
 * @param radius The radius of the circle.
 * @param numSides The number of sides to approximate the circle with (e.g., 360 for a close approximation).
 */
export function drawApproximateCircle(
  turtle: Turtle,
  radius: number,
  numSides: number
): void {
  // calculate the angle between the sides of the approcimate circle (polygon with numSides sides)
  const angleBetweenSides = 360 / numSides;

  // calculate the length of the sides/chords using the chordLength function.
  const side = chordLength(radius, angleBetweenSides);

  // Draw the circle approximation by drawing a chord for each angle.
  for (let i = 0; i < numSides; i++) {
    turtle.forward(side); // Move forward by the length of the side/chord
    turtle.turn(angleBetweenSides); // Turn by the angle between each side
  }
}

/**
 * Calculates the distance between two points.
 * @param p1 The first point.
 * @param p2 The second point.
 * @returns The distance between p1 and p2.
 */
export function distance(p1: Point, p2: Point): number {
  let distance = Math.sqrt((p2.x - p1.x) ** 2 + (p2.y - p1.y) ** 2);
  return distance;
}

/**
 * Finds a path (sequence of turns and moves) for the turtle to visit a list of points in order.
 * You should use your distance method as appropriate.
 * @param turtle The turtle to move.
 * @param points An array of points to visit in order.
 * @returns An array of instructions (e.g., strings like "forward 10", "turn 90") representing the path.
 *          This is simplified for Problem Set 0 and we won't actually use these instructions to drive the turtle directly in this starter code.
 *          The function primarily needs to *calculate* the path conceptually.
 */
export function findPath(turtle: Turtle, points: Point[]): string[] {
  const instructions: string[] = [];

  let currPosition = turtle.getPosition(); // initially (0,0)
  let currHeading = turtle.getHeading(); // initially 0

  for (const target of points) {
    const deltaX = target.x - currPosition.x;
    const deltaY = target.y - currPosition.y;

    // Calculate the required heading
    // calculate the angle in radians and convert it to degrees
    let targetHeading = (Math.atan2(deltaY, deltaX) * 180) / Math.PI;
    if (targetHeading < 0) {
      targetHeading += 360; // Normalize to [0, 360); ensures heading is always positive
    }

    // find the shortest turn angle
    let turnAngle = targetHeading - currHeading;
    if (turnAngle > 180) {
      turnAngle -= 360; // Rotate counter-clockwise
    } else if (turnAngle < -180) {
      turnAngle += 360; // Rotate clockwise
    }

    // Add turn instruction
    if (turnAngle !== 0) {
      instructions.push(`turn ${turnAngle}`);
      currHeading = targetHeading; // Update heading after turning
    }

    // Compute movement distance using the distance function
    const moveDistance = distance(currPosition, target);
    if (moveDistance > 0) {
      instructions.push(`forward ${moveDistance}`);
      currPosition = target; // Update position after moving
    }
  }

  return instructions;
}

/**
 * Draws your personal art using the turtle.
 * Be creative and implement something interesting!
 * Use at least 20 lines of non-repetitive code.
 * You may use helper methods, loops, etc., and the `color` method of the Turtle.
 * @param turtle The turtle to use.
 */
export function drawPersonalArt(turtle: Turtle): void {
  // Helper function to draw a single star
  function drawStar(size: number, color: Color) {
    turtle.color(color);
    turtle.penDown(); // Ensure pen is down for drawing

    // Draw 5-pointed star
    for (let i = 0; i < 5; i++) {
      turtle.forward(size);
      turtle.turn(144); // 144 degrees for a 5-pointed star
    }
  }

  // Helper function to move turtle without drawing
  function moveToNextStar(angle: number, distance: number) {
    turtle.penUp();
    turtle.turn(angle);
    turtle.forward(distance);
    turtle.turn(-angle);
    turtle.penDown();
  }

  // Draw first star (red, medium size)
  drawStar(-220, "red");

  // Move to second star and draw
  moveToNextStar(80, 100);
  drawStar(30, "blue");

  // Move to third star and draw
  moveToNextStar(-45, 150);
  drawStar(70, "magenta");
}

function generateHTML(
  pathData: { start: Point; end: Point; color: Color }[]
): string {
  const canvasWidth = 500;
  const canvasHeight = 500;
  const scale = 1; // Adjust scale as needed
  const offsetX = canvasWidth / 2; // Center the origin
  const offsetY = canvasHeight / 2; // Center the origin

  let pathStrings = "";
  for (const segment of pathData) {
    const x1 = segment.start.x * scale + offsetX;
    const y1 = segment.start.y * scale + offsetY;
    const x2 = segment.end.x * scale + offsetX;
    const y2 = segment.end.y * scale + offsetY;
    pathStrings += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${segment.color}" stroke-width="2"/>`;
  }

  return `<!DOCTYPE html>
<html>
<head>
    <title>Turtle Graphics Output</title>
    <style>
        body { margin: 0; }
        canvas { display: block; }
    </style>
</head>
<body>
    <svg width="${canvasWidth}" height="${canvasHeight}" style="background-color:#f0f0f0;">
        ${pathStrings}
    </svg>
</body>
</html>`;
}

function saveHTMLToFile(
  htmlContent: string,
  filename: string = "output.html"
): void {
  fs.writeFileSync(filename, htmlContent);
  console.log(`Drawing saved to ${filename}`);
}

function openHTML(filename: string = "output.html"): void {
  try {
    // For macOS
    execSync(`open ${filename}`);
  } catch {
    try {
      // For Windows
      execSync(`start ${filename}`);
    } catch {
      try {
        // For Linux
        execSync(`xdg-open ${filename}`);
      } catch {
        console.log("Could not open the file automatically");
      }
    }
  }
}

export function main(): void {
  const turtle = new SimpleTurtle();

  // Example Usage - Uncomment functions as you implement them

  // Draw a square
  //drawSquare(turtle, 100);

  // Example chordLength calculation (for testing in console)
  //console.log("Chord length for radius 5, angle 60 degrees:", chordLength(5, 60));

  // Draw an approximate circle
  //drawApproximateCircle(turtle, 50, 360);

  // Example distance calculation (for testing in console)
  // const p1: Point = {x: 1, y: 2};
  // const p2: Point = {x: 4, y: 6};
  // console.log("Distance between p1 and p2:", distance(p1, p2));

  // Example findPath (conceptual - prints path to console)
  // const pointsToVisit: Point[] = [
  //   { x: 20, y: 20 },
  //   { x: 80, y: 20 },
  //   { x: 80, y: 80 },
  // ];
  // const pathInstructions = findPath(turtle, pointsToVisit);
  // console.log("Path instructions:", pathInstructions);

  // Draw personal art
  //drawPersonalArt(turtle);

  const htmlContent = generateHTML((turtle as SimpleTurtle).getPath()); // Cast to access getPath
  saveHTMLToFile(htmlContent);
  openHTML();
}

// Run main function if this file is executed directly
if (require.main === module) {
  main();
}
