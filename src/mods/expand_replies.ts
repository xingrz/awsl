import { registerModule } from '@/module';
import { $$, attrs, style } from '@/utils/dom';

registerModule({
  id: 'expand_replies',
  name: '展开评论区回复浮层',
  defaultEnabled: true,
  init() {
    const modals = $$(document, '.ReplyModal_scroll3_2kADQ:not([awsl-expand-replies="yes"])');
    for (const modal of modals) {
      attrs(modal, { 'awsl-expand-replies': 'yes' });
      style(modal, {
        'height': 'auto',
        'max-height': 'calc(100vh - 132px)',
      });
    }
  },
});
