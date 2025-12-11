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
  test('рахує кількість сусідів для клітинки всередині поля', () => {
    const grid = stringsToGrid([
      '.x.',
      'xxx',
      '.x.'
    ]);

    const result = countAliveNeighbours(grid, 1, 1);
    expect(result).toBe(4);
  });

  test('підрахунок сусідів враховує замикання по вертикалі (тор)', () => {
    const grid = stringsToGrid([
      '...',
      '...',
      'x..'
    ]);

    const result = countAliveNeighbours(grid, 0, 0);
    expect(result).toBe(1);
  });

  test('підрахунок сусідів враховує замикання по горизонталі (тор)', () => {
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
  test('мертва клітинка з трьома сусідами оживає', () => {
    const grid = stringsToGrid([
      'xxx',
      '...',
      '...'
    ]);

    const next = getNextCellState(grid, 1, 1);
    expect(next).toBe('x');
  });

  test('жива клітинка з двома або трьома сусідами продовжує жити', () => {
    const grid = stringsToGrid([
      'xxx',
      '.x.',
      '...'
    ]);

    const next = getNextCellState(grid, 1, 1);
    expect(next).toBe('x');
  });

  test('жива клітинка з менш ніж двома сусідами вмирає від самотності', () => {
    const grid = stringsToGrid([
      '...',
      '.x.',
      '...'
    ]);

    const next = getNextCellState(grid, 1, 1);
    expect(next).toBe('.');
  });

  test('жива клітинка з більш ніж трьома сусідами вмирає від перенаселеності', () => {
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
  test('коректно обробляє стабільну фігуру (block)', () => {
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

  test('коректно обробляє осцилятор (blinker)', () => {
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
  test('осцилятор (blinker) повертається до початкового стану через два кроки', () => {
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
  test('правильно обробляє вхід з прикладу (3 покоління, 8x5, вертикальний blinker)', () => {
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
