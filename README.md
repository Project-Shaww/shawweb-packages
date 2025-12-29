# ShawWeb Official Packages

![Estado](https://img.shields.io/badge/Estado-Activo-00D26A?style=flat-square&labelColor=1a1a1a)
![Packages](https://img.shields.io/badge/Paquetes-Oficiales_de_la_comunidad-4CAF50?style=flat-square&labelColor=1a1a1a)

Repositorio oficial de paquetes para **ShawOS** - El sistema operativo en el navegador.

---

##  Tabla de Contenidos

- [¿Qué son los Paquetes de ShawOS?](#-qué-son-los-paquetes-de-shawos)
- [Instalar Paquetes](#-instalar-paquetes)
- [Formatos Soportados](#-formatos-soportados)
- [Crear tu Propio Paquete](#-crear-tu-propio-paquete)
- [Requisitos para Publicar](#-requisitos-para-publicar)
- [Cómo Contribuir](#-cómo-contribuir)
- [Pautas de la Comunidad](#-pautas-de-la-comunidad)
- [Estructura del Repositorio](#-estructura-del-repositorio)

---

##  ¿Qué son los Paquetes de ShawOS?

Los paquetes de ShawOS son **aplicaciones y comandos** que extienden la funcionalidad del sistema operativo. Pueden ser:

- ** Aplicaciones GUI**: Ventanas interactivas con interfaz gráfica
- ** Comandos de Terminal**: Utilidades de línea de comandos
- ** Juegos**: Experiencias interactivas y divertidas
- ** Herramientas**: Editores, calculadoras, gestores, etc.

---

##  Instalar Paquetes

Cualquier usuario de ShawOS puede instalar paquetes de este repositorio oficial usando **SPM (Shaww Package Manager)**:

```bash
# Instalar un paquete oficial
spm install nombre-paquete

# Ejecutar el paquete instalado
spm run nombre-paquete
```

**Ejemplo:**
```bash
spm install snake-game
spm run snake-game
```

---

##  Formatos Soportados

SPM soporta tres tipos de paquetes:

### 1.  Paquetes `.js` (Simple)

Ideal para aplicaciones pequeñas o comandos que no requieren recursos externos.

**Ventajas:**
-  Descarga rápida
-  Instalación instantánea
-  Sin dependencias externas

**Ejemplo de estructura:**
```javascript
// mi-paquete.js

export const packageInfo = {
  name: 'mi-paquete',
  version: '1.0.0',
  author: 'Tu Nombre',
  description: 'Descripción del paquete',
  type: 'gui' // o 'command'
};

export class MiPaquete {
  constructor(container, fileSystem, shawOS) {
    // Tu código aquí
  }
  
  static appSettings(app) {
    return {
      window: ['id', 'Título', '', 600, 400],
      needsSystem: false
    };
  }
}
```

### 2.  Paquetes `.ts` (TypeScript)

Similar a `.js` pero con tipado estático.

**Ventajas:**
-  Todas las ventajas de `.js`
-  Mejor autocompletado en desarrollo
-  Detección de errores en tiempo de desarrollo

**Estructura igual que `.js` pero con tipado:**
```typescript
export const packageInfo = {
  name: 'mi-paquete',
  version: '1.0.0',
  author: 'Tu Nombre',
  description: 'Descripción del paquete',
  type: 'gui' as 'gui' | 'command'
};
```

### 3.  Paquetes `.zip` (Avanzado)

Ideal para aplicaciones complejas con múltiples archivos y recursos.

**Ventajas:**
-  Múltiples archivos organizados
-  Soporta imágenes, audio, datos JSON
-  Estructura modular
-  Recursos externos incluidos

**Estructura del ZIP:**
```
mi-paquete.zip
├── main.js              # Archivo principal (OBLIGATORIO)
├── assets/
│   ├── logo.png         # Imágenes
│   └── background.jpg
├── sounds/
│   ├── click.mp3        # Audio
│   └── music.wav
├── data/
│   └── config.json      # Configuración
└── styles/
    └── theme.css        # Estilos adicionales
```

**Archivos soportados en ZIP:**
- **Código**: `.js`, `.json`, `.txt`, `.html`, `.css`
- **Imágenes**: `.png`, `.jpg`, `.jpeg`, `.gif`, `.webp`, `.svg`
- **Audio**: `.mp3`, `.wav`, `.ogg`
- **Otros**: Cualquier archivo binario

**Acceder a archivos del ZIP:**
```javascript
// En main.js
export class MiJuego {
  constructor(container, fileSystem, shawOS) {
    // Cargar recursos
    const logo = window.getPackageFile('mi-juego', 'assets/logo.png');
    const config = JSON.parse(
      window.getPackageFile('mi-juego', 'data/config.json')
    );
  }
}
```

### 4.  Carpetas (Multi-archivo)

Ideal para proyectos grandes con estructura organizada.

**Ventajas:**
-  Estructura clara y organizada
-  Fácil navegación y mantenimiento
-  Todos los archivos descargables individualmente
-  Mejor para colaboración en GitHub

**Estructura de carpeta:**
```
mi-paquete/
├── main.js              # Archivo principal (OBLIGATORIO)
├── assets/
│   └── sprites/
│       ├── player.png
│       └── enemy.png
├── sounds/
│   └── effects/
│       └── explosion.mp3
└── data/
    └── levels.json
```

**Instalación:**
```bash
# SPM descarga automáticamente todos los archivos de la carpeta
spm install mi-paquete
```

---

##  Crear tu Propio Paquete

### Opción 1: Paquete Simple (.js o .ts)

1. **Crea tu archivo:**

```javascript
// mi-calculadora.js

export const packageInfo = {
  name: 'mi-calculadora',
  version: '1.0.0',
  author: 'Tu Nombre',
  description: 'Calculadora científica',
  type: 'gui'
};

export class MiCalculadora {
  constructor(container, fileSystem, shawOS) {
    this.container = container;
    this.render();
  }
  
  render() {
    this.container.innerHTML = `
      <div class="calculadora">
        <style>
          .calculadora {
            padding: 20px;
            font-family: Arial;
          }
        </style>
        <h1>Mi Calculadora</h1>
        <!-- Tu HTML aquí -->
      </div>
    `;
  }
  
  static appSettings(app) {
    return {
      window: ['calculadora', 'Calculadora', '', 400, 500],
      needsSystem: false
    };
  }
}
```

2. **Prueba localmente** instalándolo desde una URL:
```bash
spm install -o https://tu-servidor.com/mi-calculadora.js
```

3. **Sube a este repositorio** (ver [Cómo Contribuir](#-cómo-contribuir))

### Opción 2: Paquete con Recursos (.zip)

1. **Crea la estructura:**
```
mi-juego/
├── main.js
├── sprites/
│   └── player.png
└── sounds/
    └── jump.mp3
```

2. **Crea main.js:**
```javascript
export const packageInfo = {
  name: 'mi-juego',
  version: '1.0.0',
  author: 'Tu Nombre',
  description: 'Un juego increíble',
  type: 'gui'
};

export class MiJuego {
  constructor(container, fileSystem, shawOS) {
    // Cargar recursos del ZIP
    this.sprite = window.getPackageFile('mi-juego', 'sprites/player.png');
    this.sound = window.getPackageFile('mi-juego', 'sounds/jump.mp3');
    
    this.render();
  }
  
  render() {
    this.container.innerHTML = `
      <div class="juego">
        <img src="${this.sprite}" />
        <audio src="${this.sound}" id="jump-sound"></audio>
      </div>
    `;
  }
  
  static appSettings(app) {
    return {
      window: ['mi-juego', 'Mi Juego', '', 800, 600],
      needsSystem: false
    };
  }
}
```

3. **Comprime en ZIP:**
```bash
# Linux/Mac
cd mi-juego
zip -r mi-juego.zip *

# Windows PowerShell
Compress-Archive -Path * -DestinationPath mi-juego.zip
```

4. **Sube el ZIP al repositorio**

### Opción 3: Carpeta Multi-archivo

1. **Crea tu estructura de carpeta** con `main.js` como archivo principal

2. **Sube la carpeta completa** al repositorio manteniendo la estructura

3. **Los usuarios instalarán** con:
```bash
spm install nombre-carpeta
```

---

##  Requisitos para Publicar

### Requisitos Técnicos

-  **Archivo principal obligatorio:**
  - Para `.js` o `.ts`: El archivo completo
  - Para `.zip`: Debe incluir `main.js`
  - Para carpetas: Debe incluir `main.js`

-  **Metadatos requeridos:**
```javascript
export const packageInfo = {
  name: 'nombre-paquete',        // Obligatorio
  version: '1.0.0',              // Obligatorio
  author: 'Tu Nombre',           // Obligatorio
  description: 'Descripción',    // Obligatorio
  type: 'gui' // o 'command'     // Obligatorio
};
```

-  **Naming conventions:**
  - Nombres en minúsculas
  - Usar guiones para separar palabras: `mi-paquete`
  - Solo caracteres alfanuméricos y guiones
  - Nombres descriptivos y únicos

### Requisitos de Calidad

-  **Funcionalidad:**
  - El paquete debe funcionar correctamente
  - Sin errores críticos en consola
  - Interfaz usable y responsive

-  **Código:**
  - Código limpio y comentado
  - Manejo apropiado de errores
  - Sin console.log innecesarios

-  **Contenido:**
  - Sin contenido ofensivo o inapropiado
  - Respetar derechos de autor de recursos
  - No incluir código malicioso

### Requisitos de Documentación

-  **Descripción clara** en packageInfo
-  **Instrucciones de uso** si es complejo
-  **Créditos** si usas recursos de terceros

---

##  Cómo Contribuir

### Método 1: Pull Request (Recomendado)

1. **Fork este repositorio**

2. **Clona tu fork:**
```bash
git clone https://github.com/TU-USUARIO/shawweb-packages.git
cd shawweb-packages
```

3. **Crea una rama:**
```bash
git checkout -b add-mi-paquete
```

4. **Añade tu paquete:**
   - Para `.js`/`.ts`: Copia directamente en la raíz
   - Para `.zip`: Sube el archivo ZIP
   - Para carpetas: Crea carpeta con tu paquete

5. **Commit y push:**
```bash
git add mi-paquete.js  # o .ts, .zip, o carpeta/
git commit -m "Add: Mi Paquete - Descripción breve"
git push origin add-mi-paquete
```

6. **Abre un Pull Request** en GitHub

### Método 2: Issue Request

Si no sabes usar Git:

1. Ve a la pestaña **Issues**
2. Crea un nuevo issue con título: `[Package Submission] Nombre del Paquete`
3. Incluye:
   - Enlace a tu código (Gist, Pastebin, etc.)
   - Descripción del paquete
   - Capturas de pantalla si es GUI
4. Nosotros lo revisaremos y añadiremos

---

##  Pautas de la Comunidad

###  Aceptamos

-  Juegos y entretenimiento
-  Utilidades y herramientas
-  Editores y aplicaciones productivas
-  Aplicaciones creativas
-  Visualizadores de datos
-  Calculadoras y conversores
-  Integraciones web
-  Aplicaciones educativas

###  No Aceptamos

-  Contenido malicioso o virus
-  Código ofuscado sin explicación
-  Paquetes que violen privacidad
-  Contenido ofensivo o inapropiado
-  Spam o duplicados sin mejoras
-  Código que dañe el sistema
-  Violaciones de copyright

###  Proceso de Revisión

1. **Revisión automática**: Verificación de estructura y formato
2. **Revisión manual**: Un maintainer revisa el código
3. **Testing**: Prueba en ShawOS real
4. **Aprobación**: Merge al repositorio oficial

**Tiempo estimado:** 1-7 días

---

##  Estructura del Repositorio

```
shawweb-packages/
├── README.md                    # Este archivo
├── simple-calculator.js         # Paquetes simples .js
├── notepad-plus.ts             # Paquetes TypeScript
├── retro-game.zip              # Paquetes comprimidos
├── snake-game/                 # Carpetas multi-archivo
│   ├── main.js
│   ├── sprites/
│   └── sounds/
└── todo-list/
    ├── main.js
    ├── styles.css
    └── icon.png
```

---

##  Enlaces Útiles

- **ShawOS Repository**: [Project-Shaww/ShawOS](https://github.com/Project-Shaww/ShawOS)
- **Developer Guide**: [DEVELOPER_GUIDE.md](https://github.com/Project-Shaww/ShawOS/blob/main/DEVELOPER_GUIDE.md)
- **Community Packages**: [shawweb-community-packages](https://github.com/Project-Shaww/shawweb-community-packages)

---

##  Contacto

- **Email**: project.shaww@gmail.com
- **GitHub Issues**: Para reportar problemas
- **GitHub Discussions**: Para preguntas y sugerencias

---

##  Estadísticas

![GitHub contributors](https://img.shields.io/github/contributors/Project-Shaww/shawweb-packages?style=flat-square)
![GitHub issues](https://img.shields.io/github/issues/Project-Shaww/shawweb-packages?style=flat-square)
![GitHub pull requests](https://img.shields.io/github/issues-pr/Project-Shaww/shawweb-packages?style=flat-square)

---

##  Colaboradores

Gracias a todos los que contribuyen a hacer ShawOS mejor:

<!-- ALL-CONTRIBUTORS-LIST:START -->
<!-- Aquí se listarán automáticamente los colaboradores -->
<!-- ALL-CONTRIBUTORS-LIST:END -->

---

## Licencia

Este repositorio es comunitario y de uso libre.

Puedes usar, modificar y compartir los paquetes sin problema,  
pero **no está permitido venderlos ni usarlos con fines comerciales**.

Cada paquete pertenece a su respectivo autor.

---

```
   _____ _                     ____  _____ 
  / ____| |                   / __ \/ ____|
 | (___ | |__   __ ___      _| |  | | (___  
  \___ \| '_ \ / _` \ \ /\ / / |  | |\___ \ 
  ____) | | | | (_| |\ V  V /| |__| |____) |
 |_____/|_| |_|\__,_| \_/\_/  \____/|_____/ 
                                            
    Sistema Operativo en el Navegador
```



---

**ShawWeb Packages - 2025**
