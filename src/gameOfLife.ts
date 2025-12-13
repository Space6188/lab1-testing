export type Cell = '.' | 'x';
export type Grid = Cell[][];

export function stringsToGrid(lines: string[]): Grid {
  if (lines.length === 0) {
    throw new Error('Grid must have at least one row');
  }

  const width = lines[0].length;

  return lines.map((line) => {
    if (line.length !== width) {
      throw new Error('All rows must have the same length');
    }

    const chars = line.split('');
    return chars.map((ch) => (ch === 'x' ? 'x' : '.')) as Cell[];
  });
}

export function gridToStrings(grid: Grid): string[] {
  return grid.map((row) => row.join(''));
}

export function gridToString(grid: Grid): string {
  return gridToStrings(grid).join('\n');
}

export function parseInput(input: string): {
  generations: number;
  width: number;
  height: number;
  grid: Grid;
} {
  const lines = input.trim().split(/\r?\n/);
  if (lines.length < 3) {
    throw new Error('Input must contain at least 3 lines');
  }

  const generations = parseInt(lines[0].trim(), 10);
  if (Number.isNaN(generations)) {
    throw new Error('Invalid generations number');
  }

  const [widthStr, heightStr] = lines[1].trim().split(/\s+/);
  const width = parseInt(widthStr, 10);
  const height = parseInt(heightStr, 10);

  if (Number.isNaN(width) || Number.isNaN(height)) {
    throw new Error('Invalid width or height');
  }

  const fieldLines = lines.slice(2, 2 + height);
  if (fieldLines.length !== height) {
    throw new Error('Not enough rows for the field');
  }

  const grid = stringsToGrid(fieldLines);

  if (grid[0].length !== width) {
    throw new Error('Field width does not match the declared width');
  }

  return { generations, width, height, grid };
}

export function countAliveNeighbours(grid: Grid, x: number, y: number): number {
  const height = grid.length;
  const width = grid[0].length;

  let count = 0;

  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      if (dx === 0 && dy === 0) continue;
      const ny = (y + dy + height) % height;
      const nx = (x + dx + width) % width;

      if (grid[ny][nx] === 'x') {
        count++;
      }
    }
  }

  return count;
}

export function getNextCellState(grid: Grid, x: number, y: number): Cell {
  const current = grid[y][x];
  const aliveNeighbours = countAliveNeighbours(grid, x, y);

  if (current === 'x') {
    if (aliveNeighbours === 2 || aliveNeighbours === 3) {
      return 'x';
    }
    return '.';
  } else {
    if (aliveNeighbours === 3) {
      return 'x';
    }
    return '.';
  }
}

export function getNextGeneration(grid: Grid): Grid {
  const height = grid.length;
  const width = grid[0].length;

  const next: Grid = [];

  for (let y = 0; y < height; y++) {
    const row: Cell[] = [];
    for (let x = 0; x < width; x++) {
      row.push(getNextCellState(grid, x, y));
    }
    next.push(row);
  }

  return next;
}

export function evolve(grid: Grid, generations: number): Grid {
  let current = grid;
  for (let i = 0; i < generations; i++) {
    current = getNextGeneration(current);
  }
  return current;
}
