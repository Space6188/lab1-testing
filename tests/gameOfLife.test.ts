import {
  stringsToGrid,
  gridToStrings,
  countAliveNeighbours,
  getNextCellState,
  getNextGeneration,
  evolve,
  parseInput
} from '../src/gameOfLife';

describe('countAliveNeighbours', () => {
  test('рахує кількість живих "x" навколо клітинки всередині поля', () => {
    const grid = stringsToGrid([
      '.x.',
      'xxx',
      '.x.'
    ]);

    const result = countAliveNeighbours(grid, 1, 1);
    expect(result).toBe(4);
  });

  test('враховує живі "x" знизу при замиканні по вертикалі', () => {
    const grid = stringsToGrid([
      '...',
      '...',
      'x..'
    ]);

    const result = countAliveNeighbours(grid, 0, 0);
    expect(result).toBe(1);
  });

  test('враховує живі "x" справа при замиканні по горизонталі', () => {
    const grid = stringsToGrid([
      '..x',
      '...',
      '...'
    ]);

    const result = countAliveNeighbours(grid, 0, 0);
    expect(result).toBe(1);
  });
});

describe('getNextCellState (правила гри)', () => {
  test('клітинка з "." і трьома живими "x" стає "x"', () => {
    const grid = stringsToGrid([
      'xxx',
      '...',
      '...'
    ]);

    const next = getNextCellState(grid, 1, 1);
    expect(next).toBe('x');
  });

  test('клітинка з "x" і двома або трьома живими "x" залишається "x"', () => {
    const grid = stringsToGrid([
      'xxx',
      '.x.',
      '...'
    ]);

    const next = getNextCellState(grid, 1, 1);
    expect(next).toBe('x');
  });

  test('клітинка з "x" і менш ніж двома живими "x" стає "."', () => {
    const grid = stringsToGrid([
      '...',
      '.x.',
      '...'
    ]);

    const next = getNextCellState(grid, 1, 1);
    expect(next).toBe('.');
  });

  test('клітинка з "x" і більш ніж трьома живими "x" стає "."', () => {
    const grid = stringsToGrid([
      'xxx',
      'xxx',
      'xxx'
    ]);

    const next = getNextCellState(grid, 1, 1);
    expect(next).toBe('.');
  });
});

describe('getNextGeneration (оновлення всього поля)', () => {
  test('стабільна фігура block не змінюється після одного кроку', () => {
    const start = stringsToGrid([
      '....',
      '.xx.',
      '.xx.',
      '....'
    ]);

    const next = getNextGeneration(start);
    const strings = gridToStrings(next);

    expect(strings).toEqual([
      '....',
      '.xx.',
      '.xx.',
      '....'
    ]);
  });

  test('трійка клітинок, яка то стоїть вертикально, то горизонтально, що тут з вертикального стає горизонтальним', () => {
    const start = stringsToGrid([
      '.....',
      '..x..',
      '..x..',
      '..x..',
      '.....'
    ]);

    const next = getNextGeneration(start);
    const strings = gridToStrings(next);

    expect(strings).toEqual([
      '.....',
      '.....',
      '.xxx.',
      '.....',
      '.....'
    ]);
  });
});

describe('evolve (кілька поколінь підряд)', () => {
  test('blinker повертається до початкового стану через два кроки', () => {
    const start = stringsToGrid([
      '.....',
      '..x..',
      '..x..',
      '..x..',
      '.....'
    ]);

    const afterTwo = evolve(start, 2);
    const strings = gridToStrings(afterTwo);

    expect(strings).toEqual([
      '.....',
      '..x..',
      '..x..',
      '..x..',
      '.....'
    ]);
  });
});

describe('parseInput + evolve: інтеграційний тест з прикладу з умови', () => {
  test('правильно читає вхід і дає очікуваний результат з прикладу', () => {
    const input = [
      '3',
      '8 5',
      '........',
      '..x.....',
      '..x.....',
      '..x.....',
      '........'
    ].join('\n');

    const { generations, grid } = parseInput(input);
    expect(generations).toBe(3);

    const finalGrid = evolve(grid, generations);
    const strings = gridToStrings(finalGrid);

    expect(strings).toEqual([
      '........',
      '........',
      '.xxx....',
      '........',
      '........'
    ]);
  });
});
