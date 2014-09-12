(function() {

  "use strict";

  angular.module("risevision.widget.googleSpreadsheet.settings")
    .factory("columnsService", ["visualizationApi", "$q", function (visualizationApi, $q) {

      var factory = {};

      function configureColumns(response) {
        var dataTable = response.getDataTable(),
          columnNames = [],
          columnIndexes = [], cellValue, columnLabel, columnId, i, j;

        // narrow down actual columns being used
        for (i = 0; i < dataTable.getNumberOfColumns(); i += 1) {
          for (j = 0; j < dataTable.getNumberOfRows(); j += 1) {
            cellValue = dataTable.getValue(j, i);
            if (cellValue && cellValue !== "") {
              columnIndexes.push(i);
              break;
            }
          }
        }

        // configure the column objects and populate columnNames array
        for (i = 0; i < columnIndexes.length; i +=1) {
          columnLabel = dataTable.getColumnLabel(columnIndexes[i]);
          if (columnLabel === "") {
            // there's no header row or the column is just untitled, use the column id instead (eg. A)
            columnLabel = dataTable.getColumnId(columnIndexes[i]);
          }

          // create an id that can be referenced again when restoring saved widget settings
          columnId = dataTable.getColumnId(columnIndexes[i]) + "_" + dataTable.getColumnType(columnIndexes[i]) +
            "_" + columnLabel;

          columnNames.push({
            id: columnId,
            name: columnLabel,
            type: dataTable.getColumnType(columnIndexes[i])
          });
        }

        return columnNames;
      }

      factory.getColumns = function (url) {
        var deferred = $q.defer();

        visualizationApi.get().then(function (viz) {
          var query = new viz.Query(url);

          // only need the first row
          query.setQuery("select * limit 1");
          query.setTimeout(30);

          query.send(function (response) {
            if (!response) {
              deferred.reject("No response");
            }
            else if (response.isError()) {
              deferred.reject(response.getMessage());
            }
            else {
              deferred.resolve(configureColumns(response));
            }
          });

        });

        return deferred.promise;
      };

      return factory;

    }]);

})();
