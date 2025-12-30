(function () {
    'use strict'
    class Wallpaperplus {
        constructor(container, fs, shawos) {
            this.container = container;
            this.fileSystem = fs;
            this.shawos = shawos;
            this.render();
            this.loadHistory();
        }

        async checkDependencies() {
            // Check if wallpaperplus command exists, if not try to install it
            const isInstalled = await this.shawos.processManager.execute('wallpaperplus', [], this.shawos.hiddenTerminal.context);
            if (!isInstalled.success) {
                const t = await this.shawos.processManager.execute('spm', ['i', 'wallpaperplus-cli'], this.shawos.hiddenTerminal.context);
                if (!t.success) {
                    return;
                }
            }
        }

        render() {
            this.container.innerHTML = `
                <div class="wallpaperplus-app" style="height: 100%; display: flex; flex-direction: column; gap: 1rem; padding: 1.5rem; color: #fff; background: #1e1e2e;">
                    <style>
                        .window-content:has(.wallpaperplus-app) {
                            padding: 0;
                        }
                        .wp-preview-container {
                            flex: 1;
                            background: rgba(0, 0, 0, 0.3);
                            border-radius: 12px;
                            border: 1px solid rgba(255, 255, 255, 0.1);
                            overflow: hidden;
                            position: relative;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            min-height: 200px;
                        }
                        .wp-preview-img {
                            max-width: 100%;
                            max-height: 100%;
                            object-fit: contain;
                            opacity: 0;
                            transition: opacity 0.3s ease;
                        }
                        .wp-preview-img.loaded {
                            opacity: 1;
                        }
                        .wp-placeholder {
                            position: absolute;
                            color: rgba(255, 255, 255, 0.5);
                            font-family: inherit;
                            font-size: 0.9rem;
                            pointer-events: none;
                        }
                        .wp-controls {
                            display: flex;
                            gap: 10px;
                        }
                        .wp-input {
                            flex: 1;
                            background: rgba(0, 0, 0, 0.2);
                            border: 1px solid rgba(255, 255, 255, 0.2);
                            padding: 10px 15px;
                            border-radius: 8px;
                            color: white;
                            outline: none;
                            transition: all 0.2s;
                            font-family: inherit;
                        }
                        .wp-input:focus {
                            background: rgba(0, 0, 0, 0.4);
                            border-color: #6366f1;
                        }
                        .wp-input::placeholder {
                            color: rgba(255, 255, 255, 0.5);
                        }
                        .wp-btn {
                            background: linear-gradient(135deg, #6366f1, #a855f7);
                            border: none;
                            padding: 0 20px;
                            border-radius: 8px;
                            color: white;
                            cursor: pointer;
                            font-weight: 500;
                            transition: all 0.2s;
                            font-family: inherit;
                        }
                        .wp-btn:hover {
                            opacity: 0.9;
                            transform: translateY(-1px);
                        }
                        .wp-btn:active {
                            transform: translateY(0);
                        }
                        
                        .wp-history-section {
                            background: rgba(0, 0, 0, 0.2);
                            border-radius: 12px;
                            border: 1px solid rgba(255, 255, 255, 0.1);
                            padding: 10px;
                            flex: 1;
                            overflow-y: auto;
                            display: flex;
                            flex-direction: column;
                            gap: 8px;
                        }
                        .wp-history-title {
                            font-size: 0.9rem;
                            color: rgba(255, 255, 255, 0.7);
                            margin-bottom: 5px;
                        }
                        .wp-history-list {
                            display: flex;
                            flex-direction: column;
                            gap: 5px;
                        }
                        .wp-history-item {
                            padding: 8px;
                            background: rgba(255, 255, 255, 0.05);
                            border-radius: 6px;
                            cursor: pointer;
                            transition: background 0.2s;
                            font-size: 0.9rem;
                            white-space: nowrap;
                            overflow: hidden;
                            text-overflow: ellipsis;
                        }
                        .wp-history-item:hover {
                            background: rgba(255, 255, 255, 0.1);
                        }
                    </style>

                    <div class="wp-preview-container">
                        <div class="wp-placeholder">Vista previa</div>
                        <img class="wp-preview-img" alt="Preview">
                    </div>
                    
                    <div class="wp-controls">
                        <input type="text" class="wp-input" placeholder="URL o nombre de fondo..." spellcheck="false">
                        <button class="wp-btn">Aplicar</button>
                    </div>

                    <div class="wp-history-section">
                        <div class="wp-history-title">Historial reciente</div>
                        <div class="wp-history-list"></div>
                    </div>
                </div>
            `;
            
            this.attachEvents();
            this.focusInput();
        }

        attachEvents() {
            const input = this.container.querySelector('.wp-input');
            const btn = this.container.querySelector('.wp-btn');
            const img = this.container.querySelector('.wp-preview-img');
            const placeholder = this.container.querySelector('.wp-placeholder');

            const updatePreview = (val) => {
                if (!val) {
                    img.src = '';
                    img.classList.remove('loaded');
                    placeholder.style.display = 'block';
                    placeholder.textContent = 'Vista previa';
                    return;
                }
                
                let src = val;
                // Simple heuristic: if it doesn't look like a URL/path, assume it's an internal background name
                if (!val.match(/^(http|https|data:|\/)/)) {
                     src = '/backgrounds/' + val + '.webp';
                }

                img.onload = () => {
                    img.classList.add('loaded');
                    placeholder.style.display = 'none';
                };
                img.onerror = () => {
                    img.classList.remove('loaded');
                    placeholder.style.display = 'block';
                    placeholder.textContent = 'Error al cargar imagen';
                };
                img.src = src;
            };

            input.addEventListener('input', (e) => {
                updatePreview(e.target.value.trim());
            });

            btn.addEventListener('click', async() => {
                await this.checkDependencies();
                const val = input.value.trim();
                if (!val) return;

                let args = [];
                // Decide command arguments based on input
                if (val.match(/^(http|https|data:|\/)/)) {
                    args = [val];
                } else {
                    args = ['-sfs', val];
                }
                
                // Call the EXTERNAL command
                const result = await this.shawos.processManager.execute('wallpaperplus', args, this.shawos.hiddenTerminal.context);
                if (result && result.success) {
                    btn.textContent = '¡Hecho!';
                    // Save history
                    this.addToHistory(`wallpaperplus ${args.join(' ')}`);
                    
                    setTimeout(() => btn.textContent = 'Aplicar', 2000);
                } else {
                     // If it failed, maybe user cancelled or command missing?
                     btn.textContent = 'Error';
                     setTimeout(() => btn.textContent = 'Aplicar', 2000);
                }
            });
        }

        loadHistory() {
            const path = '/bin/wpp.hist';
            const listEl = this.container.querySelector('.wp-history-list');
            if (!listEl) return;

            listEl.innerHTML = '';
            
            if (!this.fileSystem.nodeExists(path)) return;

            const file = this.fileSystem.getNodeAtPath(path);
            let history = [];
            try {
                history = JSON.parse(file.content);
            } catch (e) {
                history = [];
            }

            // Show latest first
            [...history].reverse().forEach(cmd => {
                const item = document.createElement('div');
                item.className = 'wp-history-item';
                
                // Cleanup display text
                let displayText = cmd.replace('wallpaperplus ', '');
                if (displayText.startsWith('-sfs ')) displayText = displayText.replace('-sfs ', '').split('/')[displayText.replace('-sfs ', '').split('/').length - 1];
                
                item.textContent = displayText;
                item.addEventListener('click', () => {
                    const input = this.container.querySelector('.wp-input');
                    // Extract value from cmd
                    let val = cmd.replace('wallpaperplus ', '').trim();
                     if (val.startsWith('-sfs ')) val = val.replace('-sfs ', '').trim();
                    
                    input.value = val;
                    // Trigger input event to update preview
                    input.dispatchEvent(new Event('input'));
                });
                
                listEl.appendChild(item);
            });
        }

        addToHistory(command) {
            const path = '/bin/wpp.hist';
            let history = [];

            if (this.fileSystem.nodeExists(path)) {
                const file = this.fileSystem.getNodeAtPath(path);
                try {
                    history = JSON.parse(file.content);
                } catch (e) {
                    history = [];
                }
            }

            // Remove if exists to push to top
            const index = history.indexOf(command);
            if (index > -1) {
                history.splice(index, 1);
            }
            
            history.push(command);
            
            // Limit to last 20?
            if (history.length > 20) history.shift();

            const content = JSON.stringify(history);
            
            this.fileSystem.saveNodeAtPath(path, {
                type: 'file',
                name: 'wpp.hist',
                content: content,
                createdAt: new Date().toISOString(),
                modifiedAt: new Date().toISOString(),
                size: content.length
            });

            this.loadHistory();
        }

        focusInput() {
             const input = this.container.querySelector('.wp-input');
             if (input) setTimeout(() => input.focus(), 100);
        }

        static appSettings(app) {
            return {
                window: ['wallpaperplus', 'Wallpaper Plus', '🖼️', 800, 600],
                needsSystem: false
            }
        }
    }

    if (!window.ShawOSPackages) window.ShawOSPackages = {};
    window.ShawOSPackages.wallpaperplus = Wallpaperplus;
})();
