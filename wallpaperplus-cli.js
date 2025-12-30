(function () {
    'use strict';
    
    const WALLPAPER_KEY = 'shawos-wallpaper';

    function getCurrentWallpaper() {
        return localStorage.getItem(WALLPAPER_KEY) || 'fondo';
    }

    async function setWallpaper(wallpaper, context) {
        if (!wallpaper) {
            context.stderr('Error: Debes especificar el nombre del fondo');
            context.stdout('Uso: wallpaperplus <url>', 'info');
            return { success: false };
        }

        if (wallpaper === getCurrentWallpaper()) {
            context.stdout('El fondo ya es el actual', 'info');
            return { success: true };
        }

        try {
            const response = await fetch(wallpaper);
            if (!response.ok) {
                throw new Error('Error al cargar el fondo');
            }
            document.body.style.backgroundImage = `url(${wallpaper})`;
            localStorage.setItem(WALLPAPER_KEY, wallpaper);
            return { success: true };
        } catch (error) {
            context.stderr('Error al cargar el fondo como url');
        }

        try {
            return await context.exec('wallpaper', ['-s', wallpaper]);
        } catch (error) {
            context.stderr('Error al cargar el fondo como archivo');
            return { success: false };
        }
    }

    function printHelp(context) {
        context.stdout('wallpaperplus: Cambia el fondo de pantalla a una variadad sin límites', 'info');
        context.stdout('Uso: wallpaperplus <url>', 'info');
        context.stdout('Opciones:', 'info');
        context.stdout('  -s, --set <url>   Establece el fondo de pantalla', 'info');
        context.stdout('  -g, --get         Obtiene el fondo de pantalla actual', 'info');
        context.stdout('  -sfs, --set-from-shawos <name> Establece el fondo de pantalla desde ShawOS', 'info');
        context.stdout('  -h, --help        Muestra esta ayuda', 'info');
        context.stdout('Ejemplo: wallpaperplus https://example.com/wallpaper.jpg', 'info');
        return { success: true };
    }


    async function run(args, context) {
        var func = args[0];
        var wallpaper = args[1];
        if (args.length == 0) { return printHelp(context); }
        if (!func.startsWith('-')) {
            wallpaper = func;
            func = '-s';
        }
        switch (func) {
            case '-s':
            case '--set':
                return await setWallpaper(wallpaper, context);
            case '-g':
            case '--get':
                context.stdout(getCurrentWallpaper(), 'info');
                return { success: true };
            case '-sfs':
            case '--set-from-shawos':
                return await context.exec('wallpaper', ['-s', wallpaper]);
            case '-h':
            case '--help':
                return printHelp(context);
            default:
                return printHelp(context);
        }
    }
    
    window.registerCommand('wallpaperplus', run);
})();
