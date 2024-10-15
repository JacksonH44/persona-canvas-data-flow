/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "mw0sw8m5upy92ec",
    "created": "2024-10-15 03:12:03.590Z",
    "updated": "2024-10-15 03:12:03.590Z",
    "name": "persona",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "rnn6hg20",
        "name": "content",
        "type": "text",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      }
    ],
    "indexes": [],
    "listRule": "",
    "viewRule": "",
    "createRule": "",
    "updateRule": "",
    "deleteRule": "",
    "options": {}
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("mw0sw8m5upy92ec");

  return dao.deleteCollection(collection);
})
