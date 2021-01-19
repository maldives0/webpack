const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');

module.exports = (env, options) => {
  const prod = options.mode === 'production';
  console.log(prod);
  const config = {
    mode: prod ? 'production' : 'development',
    devtool: prod ? 'eval' : 'hidden-source-map',
    resolve: {
      extensions: ['.js'],
    },
    entry: {
      main: ['./src/index.js'],
    },
    output: {
      filename: 'bundle.[contenthash].js',
      path: path.join(__dirname, './dist'), //output으로 나올 파일이 저장될 경로
      publicPath: prod ? '/dist' : '/', //파일들이 위치할 서버 상의 경로
      filename: '[name].[chunkhash].js',
    },
    plugins: [
      new CleanWebpackPlugin(),
      new HtmlWebpackPlugin({
        template: './src/index.html', //정의되어있는 기본 template을 기준으로 번들링 시에 새로운 html 파일을 생성해 준다(js, css에 수정사항이 있을 시)
      }),
      new MiniCssExtractPlugin({
        filename: '[name].[contenthash].css',
        chunkFilename: '[id].[contenthash].css',
      }),
      new webpack.LoaderOptionsPlugin({
        minimize: true,
      }),
      new WebpackManifestPlugin(),
    ],
    module: {
      rules: [
        {
          test: /\.scss$/,
          use: [
            prod ? MiniCssExtractPlugin.loader : 'style-loader',
            'css-loader',
            'sass-loader',
          ],
        },
        {
          test: /\.js?$/,
          loader: 'babel-loader',
          options: {
            plugins: ['@babel/plugin-syntax-dynamic-import'],
            presets: [
              [
                '@babel/preset-env',
                {
                  modules: false,
                  targets: '> 0.25%, not dead',
                  useBuiltIns: 'entry',
                  corejs: '3.0.0',
                },
              ],
            ],
          },
          exclude: ['/node_modules'],
        },
        {
          test: /\.(ico|png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
          loader: 'url-loader',
          options: {
            name: '[hash].[ext]',
            limit: 10000,
          },
        },
      ],
    },
    devServer: {
      historyApiFallback: true,
      publicPath: '/', // '/main.89a955c1426aff01ed58.css'
      contentBase: path.join(__dirname, './dist'), //콘텐츠를 제공할 경로지정(정적파일을 제공하려는 경우에만 필요),
    },
    optimization: {
      minimize: true,
      splitChunks: {
        cacheGroups: {
          vendor: {
            chunks: 'initial',
            name: 'vendor',
            enforce: true,
          },
        },
      },
      concatenateModules: true,
    },
  };
  return config;
};
