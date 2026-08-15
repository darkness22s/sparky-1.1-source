const platforms = {
  windows: {
    name: "Windows",
    label: "Download for Windows",
    card: "platform-windows",
    title: "Install Sparky on Windows",
    intro: "Sparky uses a familiar Windows installer. The app is not code signed yet, so Windows may ask you to confirm that you trust it.",
    steps: [
      "Continue below to download Sparky-x64.exe.",
      "Open the downloaded installer. If SmartScreen appears, choose More info, then Run anyway.",
      "Follow the installer and open Sparky from the Start menu.",
    ],
    note: "Only continue when the download comes from sparky.llc. The unsigned-app warning is expected for this release.",
  },
  macos: {
    name: "macOS",
    label: "Download for macOS",
    card: "platform-mac",
    title: "Install Sparky on Apple Silicon",
    intro: "This build is for Apple M-series Macs. Sparky is not notarized yet, so macOS requires a one-time confirmation before it opens.",
    steps: [
      "Continue below to download Sparky-arm64.dmg.",
      "In Finder, Control-click the downloaded DMG and choose Open.",
      "Choose Open again, then drag Sparky into Applications.",
    ],
    note: "The extra Open step is expected for this release because the app is not notarized.",
  },
  macosintel: {
    name: "macOS",
    label: "Download for macOS",
    card: "platform-mac",
    title: "Install Sparky on an Intel Mac",
    intro: "This build is for Intel-based Macs. Sparky is not notarized yet, so macOS requires a one-time confirmation before it opens.",
    steps: [
      "Continue below to download Sparky-x64.dmg.",
      "In Finder, Control-click the downloaded DMG and choose Open.",
      "Choose Open again, then drag Sparky into Applications.",
    ],
    note: "The extra Open step is expected for this release because the app is not notarized.",
  },
  linux: {
    name: "Linux",
    label: "Download for Linux",
    card: "platform-linux",
    title: "Run Sparky on Linux",
    intro: "Sparky is already built as a portable x64 AppImage. There is nothing to compile and no installer wizard.",
    steps: [
      "Continue below to download Sparky-x64.AppImage.",
      "Open the file from Downloads. If your browser removed its launch permission, open Properties → Permissions and enable Allow executing file as program.",
      "Double-click Sparky-x64.AppImage whenever you want to run Sparky.",
    ],
    note: "Linux browsers may clear executable permission on downloaded apps. This is a browser security setting, not a build step.",
  },
  "linux-deb": {
    name: "Linux",
    label: "Download Debian installer",
    card: "platform-linux",
    title: "Install Sparky on Linux",
    intro: "This native Debian package is built for 64-bit Linux and installs Sparky with the normal system package flow. It is not repository-signed yet.",
    steps: [
      "Continue below to download Sparky-amd64.deb.",
      "Open the file in your distribution's software installer, or run sudo apt install ./Sparky-amd64.deb from the folder containing it.",
      "Launch Sparky from your applications menu after installation.",
    ],
    note: "The package is not signed by a Linux repository. Confirm that the file came from this local Sparky release before installing it.",
  },
};

const isMac = /Macintosh|Mac OS X|MacIntel|Darwin/i.test(navigator.userAgent);
const isLinux = /Linux/i.test(navigator.userAgent) && !/Android/i.test(navigator.userAgent);
const detectedKey = isMac ? "macos" : isLinux ? "linux" : "windows";
const detected = platforms[detectedKey];

const menuButton = document.querySelector(".menu-button");
menuButton?.addEventListener("click", () => {
  const open = document.body.classList.toggle("menu-open");
  menuButton.setAttribute("aria-expanded", String(open));
  menuButton.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  const icon = menuButton.querySelector(".material-symbols-rounded");
  if (icon) icon.textContent = open ? "close" : "menu";
});
document.querySelectorAll(".primary-nav a").forEach((link) => link.addEventListener("click", () => {
  document.body.classList.remove("menu-open");
  menuButton?.setAttribute("aria-expanded", "false");
  menuButton?.setAttribute("aria-label", "Open menu");
  const icon = menuButton?.querySelector(".material-symbols-rounded");
  if (icon) icon.textContent = "menu";
}));

document.getElementById("detected-system").textContent = detected.name;
document.getElementById("primary-download-label").textContent = detected.label;
for (const id of ["primary-download", "nav-system-download"]) {
  const link = document.getElementById(id);
  link.href = `https://sparky.llc/get?platform=${detectedKey}`;
  link.dataset.platform = detectedKey;
}

const dialog = document.getElementById("download-dialog");
const dialogTitle = document.getElementById("download-dialog-title");
const dialogIntro = document.getElementById("download-dialog-intro");
const dialogSteps = document.getElementById("download-dialog-steps");
const dialogNote = document.getElementById("download-dialog-note");
const continueLink = document.getElementById("download-dialog-continue");

function closeDialog() {
  if (dialog.open) dialog.close();
}

document.querySelector(".download-dialog-close").addEventListener("click", closeDialog);
document.querySelector(".download-dialog-cancel").addEventListener("click", closeDialog);
dialog.addEventListener("click", (event) => {
  if (event.target === dialog) closeDialog();
});

document.querySelectorAll("[data-download]").forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    const platform = platforms[link.dataset.platform] || platforms.windows;
    dialogTitle.textContent = platform.title;
    dialogIntro.textContent = platform.intro;
    dialogNote.textContent = platform.note;
    dialogSteps.replaceChildren(...platform.steps.map((step) => {
      const item = document.createElement("li");
      item.textContent = step;
      return item;
    }));
    continueLink.href = link.href;
    dialog.showModal();
  });
});

fetch("/get/manifest", { cache: "no-store" })
  .then((response) => {
    if (!response.ok) throw new Error("Release unavailable");
    return response.json();
  })
  .then((release) => {
    if (release.version) {
      document.getElementById("release-version").textContent = String(release.version).replace(/^v/u, "");
    }
  })
  .catch(() => {});
