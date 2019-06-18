module.exports = {
  webpack: config => {
    // Fixes npm packages that depend on `fs` module
    config.node = {
      fs: 'empty'
    }

    return config
  },
    target: 'serverless',
    assetPrefix: "https://s3.amazonaws.com/assets.tdr.tna.com"
}
