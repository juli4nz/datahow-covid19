module.exports = {
  transpileDependencies: ['vuetify'],
  devServer: {
    proxy: 'https://covid-api.com/api',
  },
};
