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
      index: ['./src/index.js'],
    },
    output: {
      path: path.join(__dirname, './dist'), //output으로 나올 파일이 저장될 경로
      publicPath: prod ? '/webpack/dist/' : '/', //파일들이 위치할 서버 상의 경로(빌드 시 내 로컬 파일 구조)
      filename: '[name].[chunkhash].js', //청크별로 해시값이 부여
    },
    plugins: [
      new CleanWebpackPlugin(), //빌드할 때 전에 빌드할 때 미리 만들어져있는 파일이 있다면 삭제하기(기본적으로 변경되는 부분만 바뀐다, 단 npm run dev를 하면 전체 삭제됨)
      new HtmlWebpackPlugin({
        template: './src/index.html', //정의되어있는 기본 template을 기준으로 번들링 시에 새로운 html 파일을 생성해 준다(js, css에 수정사항이 있을 시)
      }),
      new MiniCssExtractPlugin({
        filename: '[name].[contenthash].css',
        chunkFilename: '[id].[contenthash].css',
      }), //여러 css 파일을 하나의 파일로 묶어서 번들링함
      new webpack.LoaderOptionsPlugin({
        minimize: true,
      }), //loader들의 옵션을 설정할 수 있다
      new WebpackManifestPlugin(), //manifest파일을 자동으로 생성한다, 별다른 설정없이도 빌드할 때마다 manifest의 파일경로(src)가 바뀌는데 이 바뀌는 경로들이 자동으로 html파일에 적용된다.
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
            plugins: ['@babel/plugin-syntax-dynamic-import'], //코드 스플리팅을 적용한다
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
            name: '[hash].[ext]', //[hash]는 웹팩 빌드를 할 때마다 고유값이 설정됨
            limit: 10000, // limit(바이트 단위)보다 작은 파일은 base64로 인코딩해서 인라인화하고 큰 파일은 file-loader가 이와 같이 module에 별다른 설정을 해주지 않아도 자동으로 해정 파일을 그대로 내보낸다
            esModule: false,
          },
        },
      ],
    },
    devServer: {
      historyApiFallback: true,
      publicPath: '/', // 웹팩 데브 서버가 번들한 결과물이 위치하는 경로(보통 output에 적어주는 publicPath와 동일한 위치를 표시),
      contentBase: path.join(__dirname, './dist'), //콘텐츠를 제공할 경로지정(정적파일을 제공하려는 경우에만 필요),
    },
    optimization: {
      minimize: true,
      splitChunks: {
        cacheGroups: {
          vendor: {
            // 청크들간 공통적으로 사용하는 모듈들을 모아둔 것
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
