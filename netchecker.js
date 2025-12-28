// netchecker.js - ShawOS package

(function () {
  'use strict';

  class NetChecker {
    constructor(container, fs) {
      this.container = container;
      this.fs = fs;
      this.historyFile = 'netchecker.log';

      this.render();
      this.init();
    }

    render() {
      this.container.innerHTML = `
        <style>
          .nc {
            height: 100%;
            display: flex;
            flex-direction: column;
            font-family: system-ui, sans-serif;
          }
          .nc-header {
            padding: 12px;
            background: #1e40af;
            color: white;
            font-weight: 600;
          }
          .nc-body {
            flex: 1;
            background: #f1f5f9;
            padding: 10px;
            overflow-y: auto;
          }
          .log {
            background: #e5e7eb;
            border-radius: 6px;
            padding: 6px;
            margin-bottom: 6px;
            font-family: monospace;
            font-size: 13px;
          }
          .nc-input-group {
            padding: 8px;
            background: #dbeafe;
            display: flex;
            gap: 8px;
            align-items: center;
          }
          .nc-input-group input {
            flex: 1;
            padding: 8px;
            border: 1px solid #93c5fd;
            border-radius: 4px;
            font-size: 13px;
          }
          .nc-input-group button {
            padding: 8px 16px;
            background: #1e40af;
            color: white;
            border: none;
            border-radius: 4px;
            font-weight: 600;
            cursor: pointer;
          }
          .nc-input-group button:hover {
            background: #1e3a8a;
          }
          .nc-actions {
            padding: 8px;
            background: #c7d2fe;
            display: flex;
            gap: 8px;
          }
          .nc-actions button {
            flex: 1;
            padding: 8px;
            font-weight: 600;
            cursor: pointer;
            border: 1px solid #a5b4fc;
            background: white;
            border-radius: 4px;
          }
          .nc-actions button:hover {
            background: #f0f0f0;
          }
        </style>

        <div class="nc">
          <div class="nc-header">🌐 NetChecker</div>
          <div class="nc-body" id="log"></div>
          <div class="nc-input-group">
            <input 
              type="text" 
              id="custom-url" 
              placeholder="https://ejemplo.com"
              value="https://"
            />
            <button id="ping-custom">Ping</button>
          </div>
          <div class="nc-actions">
            <button id="ping-google">Google</button>
            <button id="ping-cloudflare">Cloudflare</button>
            <button id="ping-github">GitHub</button>
          </div>
        </div>
      `;

      document.getElementById('ping-google').onclick =
        () => this.ping('https://www.google.com');

      document.getElementById('ping-cloudflare').onclick =
        () => this.ping('https://www.cloudflare.com');

      document.getElementById('ping-github').onclick =
        () => this.ping('https://www.github.com');

      document.getElementById('ping-custom').onclick = () => {
        const url = document.getElementById('custom-url').value.trim();
        if (url && url !== 'https://') {
          this.ping(url);
        } else {
          this.log('⚠️ Ingresa una URL válida');
        }
      };

      // Permitir Enter en el input
      document.getElementById('custom-url').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          document.getElementById('ping-custom').click();
        }
      });
    }

    init() {
      this.log(`Estado: ${navigator.onLine ? 'Online' : 'Offline'}`);

      const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
      if (conn?.effectiveType) {
        this.log(`Red: ${conn.effectiveType}`);
      }
    }

    log(text) {
      const log = document.getElementById('log');
      const line = document.createElement('div');
      line.className = 'log';
      line.textContent = `[${new Date().toLocaleTimeString()}] ${text}`;
      log.appendChild(line);
      log.scrollTop = log.scrollHeight;

      this.save(line.textContent);
    }

    save(text) {
      const prev = this.fs.fileExists(this.historyFile)
        ? this.fs.readFile(this.historyFile)
        : '';
      this.fs.writeFile(this.historyFile, prev + text + '\n');
    }

    async ping(url) {
      this.log(`Ping ${url}`);

      const start = performance.now();
      try {
        await fetch(url, { method: 'HEAD', cache: 'no-store', mode: 'no-cors' });
        const ms = Math.round(performance.now() - start);
        this.log(`✓ Respuesta: ${ms} ms`);
      } catch {
        const ms = Math.round(performance.now() - start);
        this.log(`✗ Sin respuesta (${ms} ms)`);
      }
    }

    static appSettings() {
      return {
        window: ['netchecker', 'NetChecker', '', 600, 420],
        needsSystem: false
      };
    }
  }

  if (!window.ShawOSPackages) window.ShawOSPackages = {};
  window.ShawOSPackages.netchecker = NetChecker;

  console.log('📦 NetChecker instalado');
})();