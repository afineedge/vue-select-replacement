# vue-select-replacement
A themeable component to replace &lt;select&gt; elements in Vue applications.

## Requirements

* [VueJS](http://vuejs.org/) ```^2.0.0```
* [Popper.js](https://popper.js.org/) ```^1.0.0```

## Usage
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
  	<script src="./vue.js"></script>
  	<script src="./popper.min.js"></script>
  	<script src="./vue-select-replacement.js"></script>
  	<script>
  		window.application = new Vue({
  			el: '#app',
  			data: {
  				location: '',
  				locationList: [{
  					id: 0,
  					name: 'New York'
  				}, {
  					id: 1,
  					name: 'Philadelphia'
  				}, {
  					id: 2,
  					name: 'Baltimore'
  				}, {
  					id: 3,
  					name: 'Orlando'
  				}, {
  					id: 4,
  					name: 'Austin'
  				}]
  			}
  		})
  	</script>
  </head>
  <body>
  	<vue-select-replacement v-bind:options="locationList" v-model="location"></vue-select-replacement>
  </body>
</html>
```

## Props
|Name|Required|Format|Default value|Description|
|---|---|---|---|---|
|```options```   |```true``` |```Array```|N/A|the options to be displayed in the dropdown list|
|```searchable```   |```false```|```Boolean```|```false```|assigns visibility of search input|
|```multiple``` |```false```|```Boolean```|```false```|determines whether multiple options may be selected. If true, ```v-model``` must resolve to an array.|
|```actions```      |```false``` |```Boolean```|```false```|assigns visibility of "Select All/Deselect All" buttons in dropdown (if ```multiple``` is ```true```)|
|```max```      |```false```|```Number```|N/A|maximum number of options that may be selected simultaneously (if ```multiple``` is ```true```)|
|```placeholder```        |```false```|```String```|```'Nothing selected'```|assigns text to be shown if no value selected|
|```displayformat```    |```false```|```String```|```''```|determines text to be displayed when values are selected|
|```classes```      |```false```|```String```|```''```|determines classes to be assigned to select element|

## Props details

### options
|Required|Format|Default value|
|---|---|---|
|```true``` |```Array```|N/A|

The options to be displayed in the dropdown list. Each element in the array must have ```id``` and ```name``` attributes, where ```id``` is unique among all elements in the array.

### displayformat
|Required|Format|Default value|
|---|---|---|
|```false```|```String```|```''```|

Determines text to be displayed when values are selected.

#### Options for ```displayformat```
|Option|Description|
|---|---|
|```name```|joins ```name``` attributes from all ```options```, comma-separated|
|```id```|joins ```id``` attributes from all ```options```, comma-separated|
|```count```|displays number of elements selected followed by string 'selected'. Example: '4 selected'|

### classes
|Required|Format|Default value|
|---|---|---|
|```false```|```String```|```''```|

Determines classes to be assigned to select element.