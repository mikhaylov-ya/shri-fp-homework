/**
 * @file Домашка по FP ч. 1
 *
 * Основная задача — написать самому, или найти в FP библиотеках функции anyPass/allPass
 * Эти функции/их аналоги есть и в ramda и в lodash
 *
 * allPass — принимает массив функций-предикатов, и возвращает функцию-предикат, которая
 * вернет true для заданного списка аргументов, если каждый из предоставленных предикатов
 * удовлетворяет этим аргументам (возвращает true)
 *
 * anyPass — то же самое, только удовлетворять значению может единственная функция-предикат из массива.
 *
 * Если какие либо функции написаны руками (без использования библиотек) это не является ошибкой
 */

import { countBy } from "ramda";

const isRed = (color) => color === 'red';
const isGreen = (color) => color === 'green';
const isWhite = (color) => color === 'white';
const isBlue = (color) => color === 'blue';
const isOrange = (color) => color === 'orange';
const not = (fn) => (...args) => !fn(...args);
const equals = (a) => (b) => a === b;
const isColor = (color) => (x) => x === color;
const notColor = (color) => (x) => x !== color;
const eq = (a) => (b) => a === b;
const gte = (n) => (x) => x >= n;

const countColor = (color) => (obj) => countBy(isColor(color))(Object.values(obj));
const pipe = (...fns) => (x) => fns.reduce((v, f) => f(v), x);

const any = (pred) => (xs) => xs.some(pred);

const allPass = (predicates) => (...args) =>
  predicates.every((pred) => pred(...args));

const anyPass = (predicates) => (...args) =>
  predicates.some((pred) => pred(...args));

// 1. Красная звезда, зеленый квадрат, все остальные белые.
export const validateFieldN1 =  allPass([
    ({ star }) => isRed(star),
    ({ square }) => isGreen(square),
    ({ triangle }) => isWhite(triangle),
    ({ circle }) => isWhite(circle),
]);

// 2. Как минимум две фигуры зеленые.
export const validateFieldN2 = allPass([
  (colors) => countColor(colors, 'green') >= 2,
]);

// 3. Количество красных фигур равно кол-ву синих.
export const validateFieldN3 = allPass([
  (colors) => {
    const countColors = countColor(colors);
    return countColors('red') === countColors('blue');
  }
]);


// 4. Синий круг, красная звезда, оранжевый квадрат треугольник любого цвета
export const validateFieldN4 = allPass([
  ({ star }) => isRed(star),
  ({ square }) => isOrange(square),
  ({ circle }) => isBlue(circle),
]);

// 5. Три фигуры одного любого цвета кроме белого (четыре фигуры одного цвета – это тоже true).
export const validateFieldN5 = allPass([
  pipe(
    Object.values,
    (colors) => colors.filter(notColor('white')),
    (colors) =>
      Object.values(
        colors.reduce((acc, color) => {
          acc[color] = (acc[color] || 0) + 1;
          return acc;
        }, {})
      ),
    any(gte(3))
  ),
]);

// 6. Ровно две зеленые фигуры (одна из зелёных – это треугольник), плюс одна красная. Четвёртая оставшаяся любого доступного цвета, но не нарушающая первые два условия
export const validateFieldN6 = allPass([
  pipe(countColor('green'), equals(2)),
  ({ triangle }) => isColor('green')(triangle),
  pipe(countColor('red'), equals(1)),
]);

// 7. Все фигуры оранжевые.
export const validateFieldN7 = allPass([
  pipe(Object.values, (colors) => colors.every(isColor('orange'))),
]);

// 8. Не красная и не белая звезда, остальные – любого цвета.
export const validateFieldN8 = allPass([
  ({ star }) =>
    !anyPass([isColor('red'), isColor('white')])(star),
]);

// 9. Все фигуры зеленые.
export const validateFieldN9 = allPass([
  pipe(Object.values, (colors) => colors.every(isColor('green'))),
]);

// 10. Треугольник и квадрат одного цвета (не белого), остальные – любого цвета
export const validateFieldN10 = allPass([
  ({ triangle, square }) => triangle === square,
  ({ triangle }) => notColor('white')(triangle),
]);
