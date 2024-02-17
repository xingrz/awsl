import { $$, attrs, observe, style } from '../utils/dom';

observe(document.body, function noRetweetMenu(): void {
  const popMenus = $$(document, '.toolbar_item_1ky_D .woo-pop-main:not([awsl="yes"])');
  for (const menu of popMenus) {
    attrs(menu, { 'awsl': 'yes' });
    style(menu, { 'display': 'none' });
  }

  const popItems = $$(document, '.toolbar_item_1ky_D .woo-pop-main .woo-pop-item-main:not([awsl="yes"])');
  for (const item of popItems) {
    attrs(item, { 'awsl': 'yes' });
    if (item.innerText.trim() == '转发') {
      item.dispatchEvent(new Event('click'));
    }
  }
});
