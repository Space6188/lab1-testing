import * as fs from 'fs';
import * as path from 'path';
import { parseInput, evolve, gridToString } from './gameOfLife';

function main() {
  const inputPath = process.argv[2] ?? path.resolve(__dirname, '..', 'input.txt');
  const outputPath = process.argv[3] ?? path.resolve(__dirname, '..', 'output.txt');

  const inputData = fs.readFileSync(inputPath, 'utf-8');

  const { generations, grid } = parseInput(inputData);
  const finalGrid = evolve(grid, generations);

  const outputData = gridToString(finalGrid);

  fs.writeFileSync(outputPath, outputData, 'utf-8');

  console.log('Final grid after', generations, 'generations:');
  console.log(outputData);
}

main();
