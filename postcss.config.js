module.exports = {
  // 所有postcss插件
  plugins: {
    autoprefixer: {},
    'postcss-pxtorem': {
      rootValue: 37.5, // 基准值 font-size:页面像素/37.5,但是 设计稿 尺寸750px 大小，所以在设计稿量取的尺寸使用时候需要  **除以2**
      propList: ['*']
    }
  }

}
