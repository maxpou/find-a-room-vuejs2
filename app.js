// 'words.json'
var dataUrl = 'faker/generated-data-30.json'

Vue.filter('have-free-wifi', function (property) {
  return property.bonus.hasFreeWifi
})

Vue.filter('have-free-breakfast', function (property) {
  return property.bonus.hasFreeBreakfast
})

Vue.filter('have-tv', function (property) {
  return property.bonus.hasTv
})

Vue.filter('have-bar', function (property) {
  return property.bonus.hasBar
})

Vue.component('property-card-item', {
  template: `
    <div class="card">
      <div class="content">
        <img class="right floated mini ui image">
        <div class="header">
          {{ property.name }}
        </div>
        <div class="meta">
          {{ property.address.street }} - {{ property.distance }}km
          <span v-if="property.bonus.hasFreeWifi"> - <i class="wifi icon"></i></span>
          <span v-if="property.bonus.hasFreeBreakfast"> - <i class="coffee icon"></i></span>
          <span v-if="property.bonus.hasTv"> - <i class="desktop icon"></i></span>
          <span v-if="property.bonus.hasBar"> - <i class="bar icon"></i></span>
        </div>
        <div class="description">
         {{ property.description }}
        </div>
        <div>
          <label>
            <input type="checkbox"
              v-model="isCompare"
              :disabled="comparedproperties.length > 2 && !isCompare">
            compare ({{comparedproperties.length}}/3)
          </label>
        </div>
      </div>
      <div class="ui bottom attached button">
        {{ property.price }}
        <i class="euro icon"></i>
      </div>
    </div>`,
  props: ['property', 'comparedproperties'],
  data: () => {
    return {
      isCompare: false
    }
  },
  watch: {
    isCompare: function () {
      this.$emit('updatecompare', this.property)
    }
  }
})

Vue.component('property-list-item', {
  template: `
    <div class="item">
      <div class="content">
        <a class="header">{{ property.name }}</a>
        <div class="meta">
          <span class="cinema">Union Square 14</span>
        </div>
        <div class="description">
          <p></p>
        </div>
        <div class="extra">
          <div class="ui right floated primary button">
            {{ property.price }}
            <i class="euro icon"></i>
            <i class="right chevron icon"></i>
          </div>
          <div class="ui label" v-if="property.bonus.hasFreeWifi"><i class="wifi icon"></i> Free WIFI</div>
          <div class="ui label" v-if="property.bonus.hasFreeBreakfast"><i class="coffee icon"></i> Free Breakfast</div>
          <div class="ui label" v-if="property.bonus.hasTv"><i class="desktop icon"></i> TV</div>
          <div class="ui label" v-if="property.bonus.hasBar"><i class="bar icon"></i> Bar</div>
        </div>
      </div>
    </div>`,
  props: ['property']
})

Vue.component('property-compare-table', {
  template: `
    <table class="ui definition table">
      <thead>
        <tr>
          <th></th>
          <th v-for="property in properties">{{ property.name }}</th>
      </tr>
      </thead>
      <tbody>
        <tr>
          <td>Distance</td>
          <td v-for="property in properties">{{ property.distance }}km</td>
        </tr>
        <tr>
          <td>WIFI</td>
          <td v-for="property in properties">
            <span v-if="property.bonus.hasFreeWifi"><i class="checkmark icon"></i></span>
            <span v-if="!property.bonus.hasFreeWifi"><i class="remove icon"></i></span>
          </td>
        </tr>
        <tr>
          <td>Bar</td>
          <td v-for="property in properties">
            <span v-if="property.bonus.hasBar"><i class="checkmark icon"></i></span>
            <span v-if="!property.bonus.hasBar"><i class="remove icon"></i></span>
          </td>
        </tr>
        <tr>
          <td></td>
          <td v-for="property in properties">
            <div class="ui right floated primary button">
              {{ property.price }}
              <i class="euro icon"></i>
              <i class="chevron icon"></i>
            </div>
          </td>
        </tr>
    </tbody>
    </table>`,
  props: ['properties']
})

Vue.component('filter-button', {
  props: ['filterdata', 'activefilters'],
  template: `
    <button class="ui icon button" v-bind:class="{active: isActive}" v-on:click='filterProperties'>
      <i class="icon" v-bind:class="this.filterdata.icon"></i>
    </button>`,
  methods: {
    filterProperties: function () {
      this.$emit('filterpropertiesby', this.filterdata.filtername)
    }
  },
  computed: {
    isActive: function () {
      return (this.activefilters.indexOf(this.filterdata.filtername) !== -1)
    }
  }
})

Vue.component('sorter-dropdown', {
  template: `
    <select class="ui fluid search dropdown"
      v-on:change='changeSorter'
      v-model="selected">
      <option>Sort by</option>
      <option value="price">Price</option>
      <option value="distance">Distance</option>
    </select>
  `,
  data: () => {
    return {
      selected: null
    }
  },
  methods: {
    changeSorter: function () {
      this.$emit('sortproperties', this.selected)
    }
  }
})

new Vue({
  el: '#app',
  data: {
    properties: [],
    viewMode: 'cards',
    curentSorter: null,
    activeFilters: [],
    availableFilters: [
      {
        'filtername': 'have-free-wifi',
        'icon': 'wifi'
      }, {
        'filtername': 'have-free-breakfast',
        'icon': 'coffee'
      }, {
        'filtername': 'have-tv',
        'icon': 'desktop'
      }, {
        'filtername': 'have-bar',
        'icon': 'bar'
      }
    ],
    comparedProperties: []
  },
  methods: {
    showedProperties: function (properties) {
      var showedProperties = this.properties

      // filters
      for (let activeFilter in this.activeFilters) {
        showedProperties = showedProperties.filter(
          Vue.filter(this.activeFilters[activeFilter])
        )
      }

      // sorter
      if (this.curentSorter === 'distance') {
        showedProperties = showedProperties.slice().sort(
          (a, b) => b.distance - a.distance)
      } else if (this.curentSorter === 'price') {
        showedProperties = showedProperties.slice().sort(
          (a, b) => b.price - a.price)
      }

      return showedProperties
    },
    addnewfilter: function (newFilter) {
      let newFilterName = newFilter.filtername
      let index = this.activeFilters.indexOf(newFilterName)

      if (index > -1) {
        this.activeFilters.splice(index, 1)
      } else {
        this.activeFilters.push(newFilterName)
      }
    },
    sortproperties: function (newSorter) {
      this.curentSorter = newSorter
    },
    changeViewMode: function (newViewMode) {
      this.viewMode = newViewMode
    },
    updateCompare: function (property) {
      let index = this.comparedProperties.indexOf(property)

      if (index > -1) {
        this.comparedProperties.splice(index, 1)
      } else {
        this.comparedProperties.push(property)
      }
    }
  },
  computed: {
  },
  created: function () {
    this.$http.get(dataUrl).then((response) => {
      response.json().then((data) => {
        this.properties = Object.values(data)
      })
    })
  }
})
