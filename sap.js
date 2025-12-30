(function (){
    'use strict';
    const version = '1.0.0';
    // System App Register
    function run(args, context){
        var com = args[0]
        if (!com) com = 'help';
        if (com.startsWith('-')) {
            if (com === '--help' || com === '-h') com = 'help';
            if (com === '--version' || com === '-v') com = 'version';
            if (com === '--list' || com === '-l') com = 'list';
            if (com === '--register' || com === '-r') com = 'register';
            if (com === '--createIcon' || com === '-ci') com = 'createIcon';
            if (com === '--addToMenu' || com === '-am') com = 'addToMenu';
        }

        if (com === 'help' || com === 'h') {
            context.stdout('sap <command> [options]');
            context.stdout('sap createIcon <app> <path>');
            context.stdout('sap addToMenu <app>');
            context.stdout('sap register <app>');
            context.stdout('sap list');
            context.stdout('sap version');
            context.stdout('sap help');
            context.stdout('');
            context.stdout('System App Register v' + version);
            return { success: true };
        } else if (com === 'version' || com === 'v') {
            context.stdout('System App Register v' + version);
            return { success: true };
        } else if (com === 'list' || com === 'l') {
            context.stdout('Apps disponibles:');
            for (const app of Object.keys(window.ShawOSPackages)) {
                var stdout = app;
                if (context.terminal.shawOS.appHandler.apps[app]) stdout += ' (Registrada)';
                context.stdout(stdout);
            }
            return { success: true };
        } else if (com === 'createIcon' || com === 'ci') {
            if (!window.ShawOSPackages) { window.ShawOSPackages = {} };
            if (!args[1]) {
                context.stderr('Uso: sap createIcon <app> <path>');
                return { success: false };
            }
            if (!context.terminal.shawOS.appHandler.apps[args[1]]) {
                context.stderr('El paquete ' + args[1] + ' no está registrado');
                return { success: false };
            }
            var app = args[1];
            var path = args[2];
            //var icon = args[3];
            if (!app || !path) {
                context.stderr('Uso: sap createIcon <app> <path>');
                return { success: false };
            }
            if (path === '.') path = '/' + context.fs.currentPath.join('/');
            if (!path.endsWith('/') && !path.endsWith('.app')) path += '/';
            if (!path.startsWith('/')) {
                if (path.startsWith('./')) path = '/' + context.fs.currentPath.join('/') + '/' + path.replace('./', '');
                else if (path.startsWith('../')) path = '/' + context.fs.currentPath.join('/').split('/').slice(0, context.fs.currentPath.join('/').split('/').length - 1).join('/') + '/' + path.replace('../', '');
                else if (path.startsWith('~')) path = context.fs.getUserHome() + '/' + path.replace('~', '');
                else path = context.fs.getUserHome() + '/Desktop/' + path;
            }
            if (!path.endsWith('.app')) path += app + '.app';

            context.fs.saveNodeAtPath(path, {
                action: app,
                name: path.split('/')[path.split('/').length - 1],
                type: 'app',
                createdAt: new Date().toISOString(),
                modifiedAt: new Date().toISOString()
            });
            context.terminal.shawOS.updateDesktopIcons();
            context.stdout('Icono creado exitosamente');
            return { success: true };
        } else if (com === 'addToMenu' || com === 'am' || com === 'add' || com === 'a' || com === 'register' || com === 'r' || com === 'reg') {
            if (!args[1]) {
                context.stderr('Uso: sap addToMenu <app>');
                return { success: false };
            }
            if (!window.ShawOSPackages) { window.ShawOSPackages = {} };
            if (!window.ShawOSPackages[args[1]]) {
                context.stderr('El paquete ' + args[1] + ' no existe');
                return { success: false };
            }
            var app = args[1];
            var pkg = window.ShawOSPackages[args[1]];
            var files; try{files = pkg.getFiles()} catch(e){files = []}
            window.registerApp(app, pkg, files);
            context.stdout('App ' + app + ' agregada al menu');
            return { success: true };
        } else {
            if (!args[0]) {
                context.stderr('Uso: sap <app>');
                return { success: false };
            }
            if (!window.ShawOSPackages) { window.ShawOSPackages = {} };
            if (!window.ShawOSPackages[args[0]]) {
                context.stderr('El paquete ' + args[0] + ' no existe');
                return { success: false };
            }
            var app = args[0];
            var pkg = window.ShawOSPackages[args[0]];
            var files; try{files = pkg.getFiles()} catch(e){files = []}
            window.registerApp(app, pkg, files);
            context.stdout('App ' + app + ' agregada al menu');
            return { success: true };
        }
    }

    function setup(){
        window.ShawOS.handleMenuAction = function(app){
            if (!window.ShawOS.appHandler.apps[app] && window.ShawOSPackages[app]) { var files; try{files = window.ShawOSPackages[app].getFiles()} catch(e){files = []}; window.registerApp(app, window.ShawOSPackages[app], files); }
            window.ShawOS.appHandler.openAppByName(app);
        }
    }

    if (window.registerCommand) window.registerCommand('sap', run);
    if (window.ShawOS) setup();
})()
