# Observable Editor

An unofficial editor for Observable notebooks.  
Made with [Observable notebook-kit](https://github.com/observablehq/notebook-kit).

To use it, you need to have Node.js installed.  
The code tries to find Chrome and open it automatically.
If Chrome wasn’t found, you can open the server URL from console logs in your preferred browser.

---

## Running the Editor

1. **Download the source code**  
   - Clone the repository or download the ZIP and extract it to a folder.

2. **Make sure Node.js is installed**  
   - Download from [nodejs.org](https://nodejs.org/) (version 18 or later).

### Windows
- Run `run.bat`

### macOS / Linux
- Open a Terminal and run:
  ```bash
  node ./src/assets/js/server.js
  ```

### Android (Termux)
- Install Termux from FDroid or Google Play.
- Open Termux and install Node.js:
  ```bash
  pkg update && pkg install nodejs
  ```
- Navigate to the project folder (e.g., `cd ~/storage/downloads/observable-editor`) and run:
  ```bash
  node ./src/assets/js/server.js
  ```
- The editor will open in your default browser automatically (if `termux-open-url` is available).  
  If not, copy the URL printed in the console and paste it into your browser.
