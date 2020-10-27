import Sass from 'sass.js/dist/sass.sync.js';

interface SassFailure {
  status: 1;
  file: string;
  line: number;
  column: number;
  message: string;
}

interface SassSuccess {
  status: 0;
  text: string;
}

export function compile(source: string): Promise<string> {
  return new Promise((resolve, reject) => {
    Sass.compile(source, (res: SassSuccess | SassFailure) => {
      if (res.status === 0) {
        resolve(res.text);
      } else {
        reject(new Error(res.message));
      }
    });
  });
}
