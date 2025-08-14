//Babel es una herramienta que convierte tu código JavaScript moderno (ES6+, JSX, etc.) en un formato que entienda el motor de JavaScript del dispositivo.
//nos ayuda a usar @env para las variables de entorno.


module.exports = function(api) {
    api.cache(true);  // Cachea la config para no recalcular en cada build 
    return {
      presets: ['babel-preset-expo'], // Config básica que necesita Expo
      plugins: [
        ["module:react-native-dotenv"] // Plugin para poder leer variables de .env
      ]
    };
  };