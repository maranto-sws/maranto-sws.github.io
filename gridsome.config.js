// This is where project configuration and plugin options are located. 
// Learn more: https://gridsome.org/docs/config

// Changes here require a server restart.
// To restart press CTRL + C in terminal and run `gridsome develop`

module.exports = {
  siteName: "Maranto’s Sewer & Water Services LLC",
  siteUrl: 'https://maranto-sws.github.io',
  siteDescription: "If water goes through it, Maranto's can do it!",
  plugins: [
    {
      use: '@gridsome/plugin-google-analytics',
      options: {
        id: 'UA-139774435-1'
      }
    }
  ]
}
