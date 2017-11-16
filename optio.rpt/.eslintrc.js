module.exports = {
    "extends": "standard",
    "env": {
        "browser": true,
    },
    "plugins": [
        "standard",
        "promise"
    ],
    "rules": {
        "no-unused-vars": ["error", {"varsIgnorePattern": "Controller || Loader"}],
        "no-new": 0,
    },
    "globals": {
        "angular": true,
        "$": true,
        "isNullOrWhiteSpace": true,
        "moment": true,
        "TimeSpan": true,
        "Split": true,
        "weekDays": true,
        "monthNames": true,
        "getDayOfWeek": true,
        "setPrintSize": true,

        "TimeSheetDay": true,
        "TimeSheetEmployee": true,
        "TimeSheetPage": true,

        "DataLoaderController": true,
        "UrlController": true
    }
};