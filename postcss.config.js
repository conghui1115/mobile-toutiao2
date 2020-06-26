module.exports = {
  // 所有postcss插件
  plugins: {
    autoprefixer: {},
    'postcss-pxtorem': {
      rootValue: 37.5, // 基准值 font-size:页面像素/37.5
      propList: ['*']
    }
  }

}
