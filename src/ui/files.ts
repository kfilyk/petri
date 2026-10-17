// =============================================================================
// files.ts — browser file helpers for save / load (main thread only)
// =============================================================================
//
// Save/load is split across the two threads:
//
//   * The WORKER turns the simulation into JSON and back (utils/saveLoad.ts),
//     because it owns the amoebas.
//   * The MAIN THREAD talks to the browser's download and file-picker APIs,
//     because those need the DOM.
//
// So "save" is: main asks worker → worker posts the JSON string → main calls
// downloadJson(). And "load" is: main calls pickTextFile() → posts the text to
// the worker → worker rebuilds the simulation from it.

/** Trigger a browser download of `json` under `filename`. */
export function downloadJson(json: string, filename: string): void {
  // A Blob is an in-memory file; an object URL lets an <a download> point at it.
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();                     // browsers only honour download clicks from an element in the DOM
  document.body.removeChild(a);
  URL.revokeObjectURL(url);      // free the Blob
}

/**
 * Open the native file picker and resolve with the chosen file's text.
 * Resolves null if the user cancels. `accept` is e.g. '.json'.
 */
export function pickTextFile(accept: string): Promise<string | null> {
  return new Promise((resolve, reject) => {
    // A hidden <input type=file> is still the only way to open the picker
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = accept;
    input.onchange = () => {
      const file = input.files?.[0];
      if (!file) return resolve(null);
      const reader = new FileReader();
      reader.onload = (e) => resolve((e.target?.result as string) ?? null);
      reader.onerror = () => reject(reader.error);
      reader.readAsText(file);
    };
    input.click();
  });
}
