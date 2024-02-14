import { style, attrs, $, observe } from '../utils/dom';

observe(document.body, function adjustNavItems(): void {
  const navAll = $(document, '.Nav_inner_1QCVO a.ALink_none_1w6rm[href="/"]:not([awsl="yes"])');
  if (navAll) {
    style(navAll, { 'display': 'none' });
    attrs(navAll, { 'awsl': 'yes' });
  }
});
