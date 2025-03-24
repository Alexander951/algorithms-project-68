export default {
  testEnvironment: 'node',
  transform: {
    '^.+\\.js$': 'babel-jest', // Трансформируем все .js файлы через babel-jest
  },
};
