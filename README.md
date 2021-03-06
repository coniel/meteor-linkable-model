# Linkable #

A package enabling the creation of models who's data lives in one collection and is linked to many other collections.

This package is based on [socialize:linkable](https://atmospherejs.com/socialize/linkable-model). It's modified to make the linked object optional and adds an optional grandparent linked object as well.

## LinkableModel - Extends BaseModel ##

### Static Methods ###

**LinkableModel.registerLinkableType(type, collection, options)** - Register a child model as a linkable type

**LinkableModel.getCollectionForRegisteredType(type)** - Get the collection reference on a registered Linkable type

### Prototypal Methods ###

**LinkableModel.prototype.linkedObject** - Retrieve the object that is being linked to.

**LinkableModel.prototype.parentLinkedObject** - Retrieve the parent object that is being linked to.