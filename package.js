Package.describe({
    name: "coniel:linkable-model",
    summary: "A package allowing linking of records in one collection with records from many other collections",
    version: "0.0.1",
    git: "https://github.com/coniel/meteor-linkable-model.git"
});

Package.onUse(function(api) {
    api.versionsFrom("1.0.2.1");

    api.use("coniel:base-model@0.3.0");
    api.imply("coniel:base-model");

    //Add the friend-model files
    api.addFiles("linkable-model.js");


    api.export(["LinkableModel"]);
});