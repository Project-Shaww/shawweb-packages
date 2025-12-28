(function () {
  'use strict';

  class TestApp {
    constructor(container) {
      container.innerHTML = '<h1 style="color: green;">✅ ¡Funciona!</h1>';
    }

    static appSettings() {
      return {
        window: ['test', 'Test', '', 300, 200],
        needsSystem: false
      };
    }
  }

  if (!window.ShawOSPackages) window.ShawOSPackages = {};
  window.ShawOSPackages.test = TestApp;
  console.log('✅ Test instalado');
})();