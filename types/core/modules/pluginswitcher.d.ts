declare module '$:/core/modules/pluginswitcher.js' {
  interface PluginSwitcherOptions {
    wiki: TiddlyWiki;
    pluginType: PluginType;
    controllerTitle: string;
    defaultPlugins: string[];
    onSwitch: Callback<string[]>;
  }

  export class PluginSwitcher {
    public switchPlugins(): void;
    public constructor(options: PluginSwitcherOptions);
  }
}
