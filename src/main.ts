import { App, Modal, Notice, Plugin } from "obsidian";
import vulnerabilities from "./data/owasp.json";
import { PentestCreatedModal } from "./modals/PentestCreatedModal";
import { PwnsidianSettingTab } from "./settings/PwnsidianSettingTab";
import { VulnerabilityModal } from "./settings/VulnerabilityModal";

interface PwnsidianSettings {
  hideRibbons: boolean;
}

const DEFAULT_SETTINGS: PwnsidianSettings = {
  hideRibbons: false,
};

export default class PwnsidianPlugin extends Plugin {
  settings!: PwnsidianSettings;

  async onload() {
    await this.loadSettings();
    this.addSettingTab(new PwnsidianSettingTab(this.app, this));

    this.addCommand({
      id: "show-vulnerabilities",
      name: "Afficher les vulnérabilités OWASP WSTG",
      callback: () => {
        new VulnerabilityModal(this.app, vulnerabilities).open();
      },
    });

    this.addCommand({
      id: "create-new-pentest",
      name: "Create New Pentest",
      callback: () => {
        this.createNewPentest();
      },
    });

    this.addRibbonIcon("file-plus-2", "New Pentest", async () => {
      this.createNewPentest();
    });
    new Notice("Pwnsidian Plugin Loaded!");
  }

  onunload() {
    new Notice("Pwnsidian Plugin Unloaded!");
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }

  toggleRibbonsVisibility() {
    const ribbons = document.querySelectorAll(".side-dock-ribbon-action");
    ribbons.forEach((ribbon) => {
      if (ribbon.getAttr("aria-label") != "New Pentest") {
        ribbon.getAttr("style") == "display: none !important"
          ? ribbon.setAttr("style", "display: inline-block")
          : ribbon.setAttr("style", "display: none !important");
      }
    });
  }

  createNewPentest() {
    const pentest = {
      id: Date.now().toString(),
      vulnerabilities: [...vulnerabilities],
      createdAt: new Date().toISOString(),
    };

    new Notice(`Pentest Created: ${pentest}`);

    new PentestCreatedModal(this.app, pentest).open();
  }
}
