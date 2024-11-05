takeScreenshot();

function takeScreenshot() {
  let startX, startY, endX, endY;

  const overlay = document.createElement("div");
  overlay.id = "zh-ocr-overlay";
  document.body.appendChild(overlay);

  const selection = document.createElement("div");
  selection.id = "zh-ocr-selection";
  document.body.appendChild(selection);

  overlay.addEventListener("mousedown", onMouseDown);

  function onMouseDown(e) {
    startX = e.clientX;
    startY = e.clientY;

    endX = startX;
    endY = startY;

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
    document.addEventListener("keydown", onKeyDown);
  }

  function onMouseMove(e) {
    endX = e.clientX;
    endY = e.clientY;
    drawSelection();
  }

  function onMouseUp() {
    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("mouseup", onMouseUp);
    document.removeEventListener("mousedown", onMouseDown);
    document.removeEventListener("keydown", onKeyDown);

    const area = {
      x: Math.min(startX, endX),
      y: Math.min(startY, endY),
      width: Math.abs(endX - startX),
      height: Math.abs(endY - startY),
    };

    browser.runtime.sendMessage({ action: "captureScreenshot", area });
    overlay.remove();
    selection.remove(); 
  }

  function drawSelection() {
    selection.style.left = `${Math.min(startX, endX)}px`;
    selection.style.top = `${Math.min(startY, endY)}px`;
    selection.style.width = `${Math.abs(endX-startX)}px`;
    selection.style.height = `${Math.abs(endY-startY)}px`;
  }

  function onKeyDown(e) {
    if (e.key === "Escape") {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("keydown", onKeyDown);

      overlay.remove();
      selection.remove(); 
    }
  }

}
