/**
 * A scaffold for creating models which can link records from one collection to records from many other collections
 * @class LinkableModel
 */
LinkableModel = {};

//a place to store references to the collections where the commentable objects are stored.
var LinkableTypes = {};

/**
 * The database object
 * @returns {Instance} An instance of varying types depending on what the comment linked to
 */
var linkableMethods = {
    linkedObject: function () {
        var collection = LinkableModel.getCollectionForRegisteredType(this.linkedObjectType);
        return collection.findOne({_id: this.linkedObjectId});
    },
    linkedObjectParent: function () {
        var collection = LinkableModel.getCollectionForRegisteredType(this.parentLinkedObjectType);
        return collection.findOne({_id: this.parentLinkedObjectId});
    },
    authorizationCheckValues: function (level) {
        var currentObject = this;

        var levels = [];

        while (level > 0) {
            levels.push({linkedObjectId: currentObject.linkedObjectId, linkedObjectType: currentObject.linkedObjectType});
            currentObject = currentObject.linkedObject();
            level -= 1;
        }

        var checkType = "";

        for(var i = 0; i < levels.length - 1; i++) {

            var currentType = levels[i].linkedObjectType;

            if (i < levels.length - 2) {
                console.log(levels);
                currentType = currentType.charAt(0).toUpperCase() + currentType.slice(1)
            }

            checkType = currentType + checkType;
        };

        var checkOn = levels[levels.length -1];

        return {
            checkType: checkType,
            checkOnType: checkOn.linkedObjectType,
            checkOnId: checkOn.linkedObjectId
        }
    }
};

LinkableModel.makeLinkable = function(model, options) {
    _.extend(model.prototype, linkableMethods);

    var schema = LinkableModel.LinkableSchema._schema;

    if (options && options.optional) {
        schema.linkedObjectId.optional = true;
    }

    model.appendSchema(new SimpleSchema(schema));
};

/**
 * Register a data type that can be commented on storing its collection so we can find the object later
 * @param {String}           type       The name of the type
 * @param {Mongo.Collection} collection The collection where the type of data is stored
 */
LinkableModel.registerLinkableType = function (model, type) {
    model.prototype._objectType = type;
    LinkableTypes[type] = model.prototype.getCollection();
};

/**
 * Get the collection where a data type is stored
 * @param   {String}           type The name of the data type
 * @returns {Mongo.Collection} The Collection where the type of data is stored
 */
LinkableModel.getCollectionForRegisteredType = function (type) {
    return LinkableTypes[type];
};

LinkableModel.LinkableSchema = new SimpleSchema({
    "linkedObjectId":{
        type:String,
        regEx:SimpleSchema.RegEx.Id
    },
    "linkedObjectType":{
        type:String,
        optional:true,
        denyUpdate:true,
        custom: function () {
            var shouldBeRequired = this.field('linkedObjectId').isSet;

            if (shouldBeRequired) {
                // inserts
                if (!this.operator) {
                    if (!this.isSet || this.value === null || this.value === "") return "required";
                }

                // updates
                else if (this.isSet) {
                    if (this.operator === "$set" && this.value === null || this.value === "") return "required";
                    if (this.operator === "$unset") return "required";
                    if (this.operator === "$rename") return "required";
                }
            }
        }
    },
    "parentLinkedObjectId":{
        type:String,
        optional: true,
        regEx:SimpleSchema.RegEx.Id
    },
    "parentLinkedObjectType":{
        type:String,
        optional:true,
        denyUpdate:true,
        custom: function () {
            var shouldBeRequired = this.field('parentLinkedObjectId').isSet;

            if (shouldBeRequired) {
                // inserts
                if (!this.operator) {
                    if (!this.isSet || this.value === null || this.value === "") return "required";
                }

                // updates
                else if (this.isSet) {
                    if (this.operator === "$set" && this.value === null || this.value === "") return "required";
                    if (this.operator === "$unset") return "required";
                    if (this.operator === "$rename") return "required";
                }
            }
        }
    }
});
