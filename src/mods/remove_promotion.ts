import { $, attrs, observe } from '../utils/dom';
import { VueHTMLElement } from '../utils/vue';

interface IFeedItem {
  promotion?: object;
};

observe(document.body, function removePromotion(): void {
  const feed = $<VueHTMLElement>(document, '.Home_feed_3o7ry:not([awsl-remove-promotion="yes"])');
  if (!feed || !feed.__vue__) return;
  attrs(feed, { 'awsl-remove-promotion': 'yes' });

  const vue = feed.__vue__;

  vue.$watch('data', (data: IFeedItem[]) => {
    const hasPromotion = data.find((item) => item.promotion);
    if (hasPromotion) {
      vue.$set(vue, 'data', data.filter((item) => !item.promotion));
    }
  });
});
