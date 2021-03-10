module.exports = {
  pages: {
    login: {
      entry: 'src/pages/login/main.js',
      template: 'public/index.html',
      filename: 'login.html'
    },
    index: {
      entry: 'src/main.js',
      template: 'public/index.html',
      filename: 'index.html'
    },
    admin:{
      entry:'src/pages/admin/main.js',
      template:'public/index.html',
      filename:'admin.html'
    }
  },
  lintOnSave: false,

  devServer: {

    overlay: {

      warning: false,

      errors: false

    }

  }
}
