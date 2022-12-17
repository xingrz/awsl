import { $$, observe } from '../utils/dom';

observe(document.body, function removeAds(): void {
  const ads = $$(document, '.TipsAd_wrap_3QB_0');
  for (const ad of ads) {
    ad.remove();
  }
});
