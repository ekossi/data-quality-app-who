(function(){  
	/**Controller: Parameters*/
	angular.module('admin').controller("ModalMappingController",
	['$uibModalInstance', '$scope', 'requestService', 'd2Meta', 'd2Map', 'indicator',
	function($uibModalInstance, $scope, requestService, d2Meta, d2Map, indicator) {
	    	    
	    var self = this; 

		self.groups = d2Map.groups();
		//TODO: decide what to use
		for (var i = 0; i < self.groups.length; i++) {
			self.groups[i]['displayName'] = self.groups[i]['name']
		}

		if (!indicator) {
			//Set up new indicator structure
			indicator = {
				'core': false,
				'custom': true,
				'name': '',
				'definition': '',
				'groupsSelected': [],
				'dataTypeSelected': 'dataElements',
				'dataSelected': null,
				'dataSetSelected': null
			}
		}

		//TODO: Could just assign self.indicator
		self.core = d2Map.numeratorIsCore(indicator.code);
		self.custom = indicator.custom;
		self.name = indicator.name;
		self.definition = indicator.definition;
		self.groupsSelected = d2Map.numeratorGroups(indicator.code);
		self.dataTypeSelected = 'dataElements';
		self.dataSelected = null;
		self.dataSetSelected = null;


		self.updateDataSetList = function (data) {
  	    	self.dataSetSelected = undefined;

  	    	if (!data) return;
			else self.dataSelected = data;

  	    	if (self.dataTypeSelected === 'dataElements') {

				var id = self.dataSelected.id.substr(0,11);
				d2Meta.object('dataElements', id, 'dataSets[displayName,id,periodType]')
		    		.then(function(data) {
	    			   	self.dataSets = data.dataSets;
	    			});
	    	}
	    	else {
				d2Meta.indicatorDataSets(self.dataSelected.id)
	    			.then(function(data) {
						self.dataSets = data;
	    			});
	    	}
  	    }

	    self.cancel = function () {
	        $uibModalInstance.close();
	    };
	    
	    self.save = function () {
			indicator.name = self.name;
			indicator.core = self.core;
			indicator.defintion = self.definition;
			indicator.dataID = self.dataSelected.id;
			indicator.dataSetID = self.dataSetSelected.id;

	        $uibModalInstance.close({'indicator': indicator, 'groups': self.groupsSelected, 'core': self.core});
	    };
	    
	}]);
})();