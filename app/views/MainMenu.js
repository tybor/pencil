function MainMenu (menu) {
    Menu.call(this);
    this.setup();
    this.itemRecentFile;
}

__extend(Menu, MainMenu);

MainMenu.prototype.getTemplatePath = function () {
    return this.getTemplatePrefix() + "Menu.xhtml";
};

MainMenu.prototype.setup = function () {

    var thiz = this;
    var createRecentSubMenuElement = function(fileName) {
        var index = fileName.indexOf("/");
        var name = fileName.substring(index);
        var key = "open" + name + "Document" ;
        var element = UICommandManager.register({
            key: key,
            label: name,
            run: function () {
                function handler() {
                    Pencil.controller.loadDocument(name);
                }
                if (Pencil.controller.modified) {
                    Pencil.controller.confirmAndSaveDocument(handler);
                    return;
                }
                handler();
            }
        });
        var setElement = UICommandManager.getCommand(key);
        return setElement;
    }

    var files = Config.get("recent-documents");
    if (files) {
        var elements = [];
        for (var i = 0; i < files.length; i++) {
            elements.push(createRecentSubMenuElement(files[i]));
        }
        this.itemRecentFile = elements;
    }
      var checkRecentButton = false;
    if(thiz.itemRecentFile && thiz.itemRecentFile.length > 0) {
        checkRecentButton = true;
    }

    this.register(UICommandManager.getCommand("newDocumentCommand"));
    this.register(UICommandManager.getCommand("openDocumentCommand"));
    this.register(UICommandManager.getCommand("saveDocumentCommand"));
    this.register(UICommandManager.getCommand("saveAsDocumentCommand"));
    this.separator();
    this.register({
        key: "RecentFileCommand",
        label: "Recent files ",
        isEnabled: function () { return checkRecentButton },
        type: "SubMenu",
        subItems: thiz.itemRecentFile,
    });
    this.separator();
    this.register({
        key: "settingAllCommand",
        label: "Setting",
        isValid: function () { return true; },
        run: function () {
        }
    });
    this.register({
        key: "aboutDialogCommand",
        label: "About...",
        isValid: function () { return true; },
        run: function () {
            var dialog = new AboutDialog();
            dialog.open();
        }
    });
}
