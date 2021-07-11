export const pies = ['blueberry', 'apple', 'steak and ale', 'chicken and mushroom'];

export const randomItem = <T>(items: T[]): T => items[Math.floor(Math.random() * items.length)];

export const getRandomPie = () => randomItem(pies);
