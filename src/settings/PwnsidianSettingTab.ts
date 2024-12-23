import { PluginSettingTab, Setting } from "obsidian";
import PwnsidianPlugin from "../main";

export class PwnsidianSettingTab extends PluginSettingTab {
  plugin: PwnsidianPlugin;

  constructor(app: any, plugin: PwnsidianPlugin) {
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
