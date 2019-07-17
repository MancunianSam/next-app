module.exports = {
  webpack(config, { isServer }) {
    if (!isServer) {
      config.output.globalObject = "self"
    }
    config.module.rules.push({
      test: /\.worker\.js$/,
      loader: 'worker-loader',
      // options: { inline: true }, // also works
      options: {
        name: 'static/[hash].worker.js',
        publicPath: '/_next/',
      },
    });
    return config
  },
  target: "serverless",
  // assetPrefix: `https://s3-eu-west-2.amazonaws.com/assets.${process.env.STAGE || "dev"}.tdr.tna`
}