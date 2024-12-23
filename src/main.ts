import {
  App,
  Modal,
  Notice,
  Plugin,
  Setting,
  PluginSettingTab,
} from "obsidian";
import vulnerabilities from "./data/owasp.json";

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

class PwnsidianSettingTab extends PluginSettingTab {
  plugin: PwnsidianPlugin;

  constructor(app: App, plugin: PwnsidianPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    let { containerEl } = this;

    containerEl.empty();

    new Setting(containerEl)
      .setName("Hide other ribbons")
      .setDesc("Check this option to hide other ribbons in the navigation bar")
      .addToggle((toggle) =>
        toggle
          .setValue(this.plugin.settings.hideRibbons)
          .onChange(async (value) => {
            this.plugin.settings.hideRibbons = value;
            await this.plugin.saveSettings();

            // Appliquer immédiatement les changements
            this.plugin.toggleRibbonsVisibility();
          })
      );
  }
}

class VulnerabilityModal extends Modal {
  private vulnerabilities: any[];

  constructor(app: App, vulnerabilities: any[]) {
    super(app);
    this.vulnerabilities = vulnerabilities;
  }

  onOpen() {
    const { contentEl } = this;

    contentEl.createEl("h2", { text: "Vulnérabilités OWASP WSTG" });

    this.vulnerabilities.forEach((vuln) => {
      const vulnEl = contentEl.createEl("div", { cls: "vulnerability-item" });
      vulnEl.createEl("h3", { text: vuln.name });
      vulnEl.createEl("p", { text: `Description: ${vuln.description}` });
      vulnEl.createEl("p", { text: `CVSS: ${vuln.cvss}` });
    });
  }

  onClose() {
    const { contentEl } = this;
    contentEl.empty();
  }
}

class PentestCreatedModal extends Modal {
  private pentest: any;

  constructor(app: any, pentest: any) {
    super(app);
    this.pentest = pentest;
  }

  onOpen() {
    const { contentEl } = this;
    contentEl.createEl("h2", { text: "Pentest Created" });
    contentEl.createEl("p", {
      text: `New Pentest created with ID: ${this.pentest.id}`,
    });
    contentEl.createEl("p", {
      text: `Created At: ${this.pentest.createdAt}`,
    });
    const closeButton = contentEl.createEl("button", {
      text: "Close",
      cls: "mod-warning",
    });

    closeButton.addEventListener("click", () => {
      this.close();
    });
  }

  onClose() {
    const { contentEl } = this;
    contentEl.empty();
  }
}
