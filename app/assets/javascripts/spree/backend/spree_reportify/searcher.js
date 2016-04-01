//= require spree/backend/spree_reportify/paginator

function Searcher(inputs, reportLoader) {
  this.$insightsTableList = inputs.insightsDiv;
  this.$filters = inputs.filterDiv;
  this.$quickSearchForm = this.$filters.find('#quick-search');
  this.$filterForm = this.$filters.find('#filter-search');
  this.$selectedInsight = inputs.selectedOption;
  this.tableSorter = inputs.tableSorterObject;
  this.reportLoader = reportLoader;
}

Searcher.prototype.bindEvents = function() {
  var requestPath = this.$selectedInsight.data('url'),
    _this = this;
  _this.reportLoader.requestUrl = requestPath;

  this.$filters.removeClass('hide');
  this.setFormActions(this.$quickSearchForm, requestPath);
  this.setFormActions(this.$filterForm, requestPath);

  this.$filterForm.on('submit', function() {
    event.preventDefault();
    $.ajax({
      type: "GET",
      url: _this.$filterForm.attr('action'),
      data: _this.$filterForm.serialize(),
      dataType: 'json',
      success: function(data) {
        _this.populateInsightsData(data);
        _this.initializePaginator(data);
      }
    });
  });

  this.$quickSearchForm.on('submit', function() {
    event.preventDefault();
    $.ajax({
      type: "GET",
      url:  _this.$quickSearchForm.attr('action'),
      data: _this.$quickSearchForm.serialize(),
      dataType: 'json',
      success: function(data) {
        _this.populateInsightsData(data);
        _this.initializePaginator(data);
      }
    });
  });
};

Searcher.prototype.setFormActions = function($form, path) {
  $form.attr("method", "get");
  $form.attr("action", path);
};

Searcher.prototype.populateInsightsData = function(data) {
  this.reportLoader.populateInsightsData(data);
  this.tableSorter.bindEvents();
};

Searcher.prototype.initializePaginator = function(data) {
  var paginatorInputs = {
    paginatorDiv: $('#paginator-div'),
    insightsDiv: this.$insightsTableList,
    reportData: data,
    tableSorterObject: this.tableSorter
  };
  new Paginator(paginatorInputs).bindEvents();
};