// import { readFile, writeFile } from 'fs';
// export const getFile = <T>(filePath: string) =>
//   new Promise<T>((resolve, reject) => {
//     readFile(filePath, 'utf8', (error, fileData) => {
//       if (error) {
//         reject(error);
//         return;
//       }
//       try {
//         resolve(JSON.parse(fileData));
//       } catch (e) {
//         reject(e);
//       }
//     });
//   });
// export const writeFileData = <T>(filePath: string, data: T) =>
//   new Promise<T>((resolve, reject) => {
//     writeFile(filePath, JSON.stringify(data, null, 4), 'utf8', (error) => {
//       if (error) {
//         reject(error);
//         return;
//       }
//       resolve(data);
//     });
//   });
//# sourceMappingURL=file.js.map