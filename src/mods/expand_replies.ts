import { $$, attrs, observe, style } from '../utils/dom';

observe(document.body, function expandReplies(): void {
  const modals = $$(document, '.ReplyModal_scroll3_2kADQ:not([awsl-expand-replies="yes"])');
  for (const modal of modals) {
    attrs(modal, { 'awsl-expand-replies': 'yes' });
    style(modal, {
      'height': 'auto',
      'max-height': 'calc(100vh - 132px)',
    });
  }
});
