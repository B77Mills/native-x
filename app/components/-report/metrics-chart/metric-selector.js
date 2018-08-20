import Component from '@ember/component';
import InitValueMixin from 'fortnight/mixins/init-value';
import ActionMixin from 'fortnight/mixins/action';

export default Component.extend(ActionMixin, InitValueMixin, {
  selected: null,
  options: null,

  disabled: false,

  init() {
    this._super(...arguments);
    this.initValue('metricOptions', []);
  },

  actions: {
    setMetric(metric) {
      this.set('selected', metric);
      this.sendEventAction('onchange', metric);
    }
  },
});
