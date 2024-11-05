browser.commands.onCommand.addListener(async (command) => {
  if (command === "take-screenshot") {
    console.log("screenshot");
    const [tab] = await browser.tabs.query({ active: true, currentWindow: true });

    await browser.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["overlay.js"]
    });
  }
});

async function captureScreenshot(area) {
  const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
  const imageData = await browser.tabs.captureVisibleTab(tab.windowId, { format: "png" });

  const img = new Image();
  img.src = imageData;

  img.onload = () => {
    const canvas = document.createElement("canvas");
    canvas.width = area.width;
    canvas.height = area.height;

    const context = canvas.getContext("2d");
    context.drawImage(img, area.x, area.y, area.width, area.height, 0, 0, area.width, area.height);

    const croppedData = canvas.toDataURL("image/png");
    
    // Here you can save, display, or further process `croppedData`
    console.log(croppedData); // Example: log the data URL
  };
}

browser.runtime.onMessage.addListener((message) => {
  if (message.action === "captureScreenshot") {
    captureScreenshot(message.area);
  }
});

